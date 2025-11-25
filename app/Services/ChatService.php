<?php

namespace App\Services;

use App\Enums\MessageRole;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\User;
use Illuminate\Support\Collection;

class ChatService
{
    public function __construct(
        private readonly HealthAssistantService $healthAssistantService,
        private readonly MedicationReorganizationService $medicationReorganizationService,
        private readonly ChatInteractionCheckerService $chatInteractionChecker
    ) {
    }

    public function getOrCreateSession(User $user): ChatSession
    {
        return ChatSession::getOrCreateForUser($user);
    }

    /**
     * @return Collection<int, ChatMessage>
     */
    public function getMessages(ChatSession $session, int $limit = 50): Collection
    {
        return $session->messages()
            ->orderBy('id', 'asc')
            ->limit($limit)
            ->get()
            ->values();
    }

    /**
     * @return array{userMessage: ChatMessage, assistantMessage: ChatMessage, sessionId: int, toolExecution?: array{success: bool, message: string, reorganized_medications: array<int, array{id: int, name: string, old_time_slots: array<int, string>, new_time_slots: array<int, string>, start_date: string}>}}
     */
    public function sendMessage(User $user, string $message, bool $isSuggestion = false): array
    {
        $session = $this->getOrCreateSession($user);

        $userMessage = ChatMessage::create([
            'chat_session_id' => $session->id,
            'role' => MessageRole::USER,
            'content' => $message,
        ]);

        $conversationHistory = $this->getConversationHistory($session);

        $aiResponse = $this->healthAssistantService->generateResponse(
            $user,
            $message,
            $conversationHistory,
            $isSuggestion
        );

        $toolExecutionResult = null;

        if (!empty($aiResponse['tool_calls'])) {
            $toolExecutionResult = $this->executeToolCalls($user, $aiResponse['tool_calls']);

            if ($toolExecutionResult) {
                $aiResponse['content'] = $this->buildToolExecutionMessage($aiResponse['tool_calls'], $toolExecutionResult);
            }
        }

        $assistantMessage = ChatMessage::create([
            'chat_session_id' => $session->id,
            'role' => MessageRole::ASSISTANT,
            'content' => $aiResponse['content'],
            'metadata' => [
                'tokens_used' => $aiResponse['usage']['total_tokens'],
                'duration_ms' => $aiResponse['duration_ms'],
                'model' => config('openai.health_assistant.model'),
                'tool_calls' => $aiResponse['tool_calls'] ?? [],
                'tool_execution' => $toolExecutionResult,
            ],
        ]);

        $session->updateLastMessageTimestamp();

        $result = [
            'userMessage' => $userMessage,
            'assistantMessage' => $assistantMessage,
            'sessionId' => $session->id,
        ];

        if ($toolExecutionResult) {
            $result['toolExecution'] = $toolExecutionResult;
        }

        return $result;
    }

    public function clearHistory(ChatSession $session): void
    {
        $session->messages()->delete();
    }

    /**
     * @return array<int, array{id: string, text: string, icon?: string}>
     */
    public function getSuggestedPrompts(User $user): array
    {
        $basePrompts = [
            [
                'id' => 'check-interactions',
                'text' => 'Verificar interações entre meus medicamentos',
                'icon' => 'Shield',
            ],
            [
                'id' => 'schedule-adjustment',
                'text' => 'Sugerir reajuste de horários para evitar efeitos colaterais',
                'icon' => 'Clock',
            ],
        ];

        $hasSevereInteractions = $user->interactionAlerts()
            ->whereNull('acknowledged_at')
            ->whereIn('severity', ['severe', 'moderate'])
            ->exists();

        if ($hasSevereInteractions) {
            $basePrompts[] = [
                'id' => 'explain-interactions',
                'text' => 'Explicar minhas interações medicamentosas',
                'icon' => 'AlertTriangle',
            ];
        }

        return $basePrompts;
    }

    /**
     * @return Collection<int, array{role: string, content: string}>
     */
    private function getConversationHistory(ChatSession $session): Collection
    {
        $limit = config('openai.health_assistant.conversation_history_limit', 20);

        return $session->messages()
            ->where('role', '!=', MessageRole::SYSTEM->value)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->reverse()
            ->map(function (ChatMessage $message) {
                return [
                    'role' => $message->role->value,
                    'content' => $message->content,
                ];
            });
    }

    /**
     * @param array<int, array{id: string, type: string, function: array{name: string, arguments: string}}> $toolCalls
     * @return array{success: bool, message: string, reorganized_medications?: array<int, array{id: int, name: string, old_time_slots: array<int, string>, new_time_slots: array<int, string>, start_date: string}>, interactions_found?: int, severe_count?: int, moderate_count?: int, mild_count?: int, alerts_created?: int}|null
     */
    private function executeToolCalls(User $user, array $toolCalls): ?array
    {
        foreach ($toolCalls as $toolCall) {
            $functionName = $toolCall['function']['name'];
            $arguments = json_decode($toolCall['function']['arguments'], true);

            if ($functionName === 'reorganize_medications') {
                return $this->medicationReorganizationService->reorganizeMedications(
                    $user,
                    $arguments['medication_schedules']
                );
            }

            if ($functionName === 'check_medication_interactions') {
                return $this->chatInteractionChecker->checkAllMedicationInteractions($user);
            }
        }

        return null;
    }

    /**
     * @param array<int, array{id: string, type: string, function: array{name: string, arguments: string}}> $toolCalls
     * @param array{success: bool, message: string, reorganized_medications?: array<int, array{id: int, name: string, old_time_slots: array<int, string>, new_time_slots: array<int, string>, start_date: string}>, interactions_found?: int, severe_count?: int, moderate_count?: int, mild_count?: int, alerts_created?: int} $executionResult
     */
    private function buildToolExecutionMessage(array $toolCalls, array $executionResult): string
    {
        $functionName = $toolCalls[0]['function']['name'];

        if ($functionName === 'check_medication_interactions') {
            return $executionResult['message'];
        }

        if ($functionName === 'reorganize_medications') {
            if (!$executionResult['success']) {
                return "Não foi possível reorganizar os medicamentos. " . $executionResult['message'];
            }

            $arguments = json_decode($toolCalls[0]['function']['arguments'], true);
            $reason = $arguments['reason'] ?? 'Reorganização solicitada';

            $message = "**Medicamentos reorganizados com sucesso!**\n\n";
            $message .= "**Motivo:** {$reason}\n\n";
            $message .= "**Alterações realizadas:**\n\n";

            foreach ($executionResult['reorganized_medications'] as $medication) {
                $message .= "**{$medication['name']}**\n";
                $message .= "- Horários anteriores: " . implode(', ', $medication['old_time_slots']) . "\n";
                $message .= "- Novos horários: " . implode(', ', $medication['new_time_slots']) . "\n";
                $message .= "- Início da nova programação: {$medication['start_date']}\n\n";
            }

            $message .= "**Importante:** A reorganização começa a partir de amanhã para não afetar medicamentos já tomados ou programados para hoje.\n\n";
            $message .= "As notificações foram atualizadas automaticamente. Você receberá lembretes nos novos horários.";

            return $message;
        }

        return $executionResult['message'];
    }
}
