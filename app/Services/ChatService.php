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
        private readonly ChatInteractionCheckerService $chatInteractionChecker,
        private readonly AddUserMedicationService $addUserMedicationService
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

    /**
     * @return \Generator<int, array{type: string, content?: string, userMessageId?: int, sessionId?: int, tool_calls?: array<int, array{id: string, type: string, function: array{name: string, arguments: string}}>, usage?: array{prompt_tokens: int, completion_tokens: int, total_tokens: int}, tool_execution?: array{success: bool, message: string, reorganized_medications?: array<int, array{id: int, name: string, old_time_slots: array<int, string>, new_time_slots: array<int, string>, start_date: string}>}}>
     */
    public function sendMessageStream(User $user, string $message, bool $isSuggestion = false): \Generator
    {
        $session = $this->getOrCreateSession($user);

        $userMessage = ChatMessage::create([
            'chat_session_id' => $session->id,
            'role' => MessageRole::USER,
            'content' => $message,
        ]);

        yield [
            'type' => 'user_message_created',
            'userMessageId' => $userMessage->id,
            'sessionId' => $session->id,
        ];

        $conversationHistory = $this->getConversationHistory($session);

        $contentBuffer = '';
        $toolCallsBuffer = [];
        $usageData = null;
        $startTime = microtime(true);

        $stream = $this->healthAssistantService->generateResponseStream(
            $user,
            $message,
            $conversationHistory,
            $isSuggestion
        );

        foreach ($stream as $chunk) {
            if ($chunk['type'] === 'content_delta') {
                $contentBuffer .= $chunk['content'];
                yield $chunk;
            } elseif ($chunk['type'] === 'tool_calls') {
                $toolCallsBuffer = $chunk['tool_calls'];
                yield $chunk;
            } elseif ($chunk['type'] === 'usage') {
                $usageData = $chunk['usage'];
            }
        }

        $durationMs = (int) ((microtime(true) - $startTime) * 1000);

        $toolExecutionResult = null;

        if (!empty($toolCallsBuffer)) {
            $toolExecutionResult = $this->executeToolCalls($user, $toolCallsBuffer);

            if ($toolExecutionResult) {
                $contentBuffer = $this->buildToolExecutionMessage($toolCallsBuffer, $toolExecutionResult);

                yield [
                    'type' => 'tool_execution',
                    'tool_execution' => $toolExecutionResult,
                    'content' => $contentBuffer,
                ];
            }
        }

        $assistantMessage = ChatMessage::create([
            'chat_session_id' => $session->id,
            'role' => MessageRole::ASSISTANT,
            'content' => $contentBuffer,
            'metadata' => [
                'tokens_used' => $usageData['total_tokens'] ?? 0,
                'duration_ms' => $durationMs,
                'model' => config('openai.health_assistant.model'),
                'tool_calls' => $toolCallsBuffer,
                'tool_execution' => $toolExecutionResult,
            ],
        ]);

        $session->updateLastMessageTimestamp();

        yield [
            'type' => 'message_completed',
            'assistantMessageId' => $assistantMessage->id,
        ];
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

            if ($functionName === 'add_user_medication') {
                // Se é apenas busca
                if (!empty($arguments['search_step']) && $arguments['search_step'] === true) {
                    $searchResults = $this->addUserMedicationService->searchMedications(
                        $arguments['medication_name'] ?? ''
                    );

                    if (empty($searchResults)) {
                        return [
                            'success' => false,
                            'message' => "Nenhum medicamento encontrado com o nome '{$arguments['medication_name']}'. Por favor, verifique o nome e tente novamente.",
                        ];
                    }

                    return [
                        'success' => true,
                        'message' => 'Medicamentos encontrados',
                        'search_results' => $searchResults,
                    ];
                }

                // Se tem todos os campos necessários, adicionar
                if (
                    !empty($arguments['medication_id']) &&
                    !empty($arguments['dosage']) &&
                    !empty($arguments['time_slots']) &&
                    !empty($arguments['via_administration']) &&
                    !empty($arguments['start_date']) &&
                    isset($arguments['initial_stock']) &&
                    isset($arguments['current_stock']) &&
                    isset($arguments['low_stock_threshold'])
                ) {
                    return $this->addUserMedicationService->addUserMedication(
                        $user,
                        $arguments
                    );
                }

                // Campos faltando - AI deve pedir
                return [
                    'success' => false,
                    'message' => 'Campos obrigatórios faltando. A AI deve solicitar os campos necessários ao usuário.',
                ];
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

        if ($functionName === 'add_user_medication') {
            // Se foi busca de medicamento
            if (!empty($executionResult['search_results'])) {
                $results = $executionResult['search_results'];

                $message = "Encontrei os seguintes medicamentos:\n\n";
                foreach ($results as $idx => $med) {
                    $message .= ($idx + 1) . ". **{$med['name']}**";
                    if ($med['active_principle']) {
                        $message .= " - {$med['active_principle']}";
                    }
                    if ($med['strength']) {
                        $message .= " ({$med['strength']})";
                    }
                    if ($med['form']) {
                        $message .= " - {$med['form']}";
                    }
                    $message .= " (ID: {$med['id']})\n";
                }

                $message .= "\nQual desses medicamentos você deseja adicionar? Por favor, me informe o número ou nome.";

                return $message;
            }

            // Se foi adição bem-sucedida
            if ($executionResult['success']) {
                return "✅ {$executionResult['message']}\n\nO medicamento foi adicionado ao seu tratamento e as notificações foram programadas automaticamente nos horários definidos.";
            }

            // Se falhou
            return "❌ {$executionResult['message']}";
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
