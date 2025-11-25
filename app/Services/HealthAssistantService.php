<?php

namespace App\Services;

use App\Models\User;
use App\Packages\OpenAI\Contracts\OpenAIClientInterface;
use Illuminate\Support\Collection;

class HealthAssistantService
{
    public function __construct(
        private readonly OpenAIClientInterface $openAIClient
    ) {
    }

    /**
     * @param Collection<int, array{role: string, content: string}> $conversationHistory
     * @return array{content: string, usage: array{prompt_tokens: int, completion_tokens: int, total_tokens: int}, tool_calls: array<int, array{id: string, type: string, function: array{name: string, arguments: string}}>}
     */
    public function generateResponse(
        User $user,
        string $userMessage,
        Collection $conversationHistory,
        bool $isSuggestion = false
    ): array {
        $systemPrompt = $this->buildSystemPrompt();
        $userContext = $isSuggestion ? $this->getUserContext($user) : null;
        $messages = $this->buildMessages($systemPrompt, $userContext, $conversationHistory, $userMessage);
        $tools = $isSuggestion ? $this->getToolDefinitions($user) : [];

        $startTime = microtime(true);

        $response = $this->openAIClient->chatCompletion(
            messages: $messages,
            model: config('openai.health_assistant.model'),
            temperature: config('openai.health_assistant.temperature'),
            jsonFormat: false,
            tools: $tools
        );

        $durationMs = (int) ((microtime(true) - $startTime) * 1000);

        return [
            'content' => $response['content'],
            'usage' => $response['usage'],
            'duration_ms' => $durationMs,
            'tool_calls' => $response['tool_calls'] ?? [],
        ];
    }

    private function buildSystemPrompt(): string
    {
        return <<<'XML'
        <assistant_role>
            Você é um assistente de saúde especializado do MediControl, ajudando pacientes polimedicados a gerenciar seus medicamentos com segurança.
        </assistant_role>

        <capabilities>
            - Responder perguntas sobre medicamentos, dosagens e efeitos colaterais
            - Explicar interações medicamentosas e seus níveis de gravidade
            - Sugerir ajustes nos horários de medicamentos para prevenir conflitos
            - Fornecer orientações gerais de saúde relacionadas a medicamentos
            - Ajudar a entender relatórios de aderência
        </capabilities>

        <safety_guidelines>
            - Sempre enfatize a importância de consultar profissionais de saúde para decisões médicas
            - Nunca diagnostique condições ou prescreva medicamentos
            - Seja conservador nas recomendações
            - Indique claramente os níveis de gravidade das interações
            - Em caso de dúvida, recomende consultar um médico ou farmacêutico
        </safety_guidelines>

        <response_format>
            - Use português claro e simples (pt-BR)
            - Seja conciso mas completo
            - Use listas com marcadores quando apropriado
            - Destaque avisos importantes com ênfase
            - Seja empático e encorajador
        </response_format>

        <interaction_severity_levels>
            - grave (severe): Pode ser fatal ou causar danos permanentes. Contraindicado.
            - moderada (moderate): Pode causar efeitos clínicos significativos. Requer monitoramento.
            - leve (minor): Significância clínica limitada. Geralmente não requer intervenção.
            - nenhuma (none): Nenhuma interação clinicamente relevante identificada.
        </interaction_severity_levels>
        XML;
    }

    /**
     * @return array{medications: array<int, array{name: string, dosage: string, time_slots: array<int, string>, via_administration: string}>, interactions: array<int, array{medication_1: string, medication_2: string, severity: string, description: string}>}
     */
    private function getUserContext(User $user): array
    {
        $activeMedications = $user->medications()
            ->with('medication')
            ->where('active', true)
            ->where('start_date', '<=', today())
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', today());
            })
            ->get();

        $medicationsData = $activeMedications->map(function ($userMedication) {
            return [
                'name' => $userMedication->medication->name,
                'dosage' => $userMedication->dosage,
                'time_slots' => $userMedication->time_slots ?? [],
                'via_administration' => $userMedication->via_administration,
            ];
        })->toArray();

        $interactionAlerts = $user->interactionAlerts()
            ->with(['medication1', 'medication2'])
            ->whereNull('acknowledged_at')
            ->whereIn('severity', ['severe', 'moderate'])
            ->get();

        $interactionsData = $interactionAlerts->map(function ($alert) {
            return [
                'medication_1' => $alert->medication1->name,
                'medication_2' => $alert->medication2->name,
                'severity' => $alert->severity,
                'description' => $alert->description,
            ];
        })->toArray();

        return [
            'medications' => $medicationsData,
            'interactions' => $interactionsData,
        ];
    }

    /**
     * @param Collection<int, array{role: string, content: string}> $conversationHistory
     * @return array<int, array{role: string, content: string}>
     */
    private function buildMessages(
        string $systemPrompt,
        ?array $userContext,
        Collection $conversationHistory,
        string $newMessage
    ): array {
        if ($userContext !== null) {
            $contextString = $this->formatUserContext($userContext);

            $systemMessageWithContext = <<<XML
            {$systemPrompt}

            <user_context>
                {$contextString}
            </user_context>
            XML;
        } else {
            $systemMessageWithContext = $systemPrompt;
        }

        $messages = [
            ['role' => 'system', 'content' => $systemMessageWithContext],
        ];

        $conversationLimit = config('openai.health_assistant.conversation_history_limit', 20);
        $recentHistory = $conversationHistory->slice(-$conversationLimit);

        foreach ($recentHistory as $message) {
            $messages[] = [
                'role' => $message['role'],
                'content' => $message['content'],
            ];
        }

        $messages[] = [
            'role' => 'user',
            'content' => $newMessage,
        ];

        return $messages;
    }

    /**
     * @param array{medications: array<int, array{name: string, dosage: string, time_slots: array<int, string>, via_administration: string}>, interactions: array<int, array{medication_1: string, medication_2: string, severity: string, description: string}>} $userContext
     */
    private function formatUserContext(array $userContext): string
    {
        $contextParts = [];

        if (!empty($userContext['medications'])) {
            $contextParts[] = '<medications>';
            foreach ($userContext['medications'] as $med) {
                $timeSlots = implode(', ', $med['time_slots']);
                $contextParts[] = sprintf(
                    '  - %s (%s) - Horários: %s - Via: %s',
                    $med['name'],
                    $med['dosage'],
                    $timeSlots ?: 'Não definido',
                    $med['via_administration']
                );
            }
            $contextParts[] = '</medications>';
        } else {
            $contextParts[] = '<medications>Nenhum medicamento ativo cadastrado</medications>';
        }

        if (!empty($userContext['interactions'])) {
            $contextParts[] = "\n<interaction_alerts>";
            foreach ($userContext['interactions'] as $interaction) {
                $contextParts[] = sprintf(
                    '  - %s + %s (Gravidade: %s): %s',
                    $interaction['medication_1'],
                    $interaction['medication_2'],
                    $interaction['severity'],
                    $interaction['description']
                );
            }
            $contextParts[] = '</interaction_alerts>';
        } else {
            $contextParts[] = "\n<interaction_alerts>Nenhuma interação relevante detectada</interaction_alerts>";
        }

        return implode("\n", $contextParts);
    }

    /**
     * @return array<int, array{type: string, function: array{name: string, description: string, parameters: array<string, mixed>}}>
     */
    private function getToolDefinitions(User $user): array
    {
        $activeMedications = $user->medications()
            ->with('medication')
            ->where('active', true)
            ->where('start_date', '<=', today())
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', today());
            })
            ->get();

        if ($activeMedications->isEmpty()) {
            return [];
        }

        $medicationEnum = $activeMedications->map(function ($userMedication) {
            return $userMedication->medication_id;
        })->unique()->values()->toArray();

        return [
            [
                'type' => 'function',
                'function' => [
                    'name' => 'check_medication_interactions',
                    'description' => 'Verifica todas as interações medicamentosas entre os medicamentos ativos do usuário. Use esta ferramenta APENAS quando o usuário solicitar explicitamente verificar interações entre seus medicamentos, ou quando você precisar obter informações atualizadas sobre interações. Para responder perguntas gerais sobre interações já conhecidas, use o contexto fornecido no sistema sem executar esta tool.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'reason' => [
                                'type' => 'string',
                                'description' => 'Breve explicação do motivo da verificação (ex: "Usuário solicitou verificação completa", "Verificar interações após adicionar novo medicamento")',
                            ],
                        ],
                        'required' => ['reason'],
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'reorganize_medications',
                    'description' => 'Reorganiza os horários dos medicamentos do usuário de acordo com sugestões de espaçamento adequado entre doses. A reorganização SEMPRE começa a partir de amanhã para não afetar medicamentos já tomados ou programados para hoje. Use esta ferramenta quando o usuário solicitar ajustes nos horários de medicação para evitar interações ou melhorar a aderência.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'medication_schedules' => [
                                'type' => 'array',
                                'description' => 'Lista de medicamentos com seus novos horários sugeridos',
                                'items' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'medication_id' => [
                                            'type' => 'integer',
                                            'description' => 'ID do medicamento a ser reorganizado',
                                            'enum' => $medicationEnum,
                                        ],
                                        'new_time_slots' => [
                                            'type' => 'array',
                                            'description' => 'Novos horários para o medicamento no formato HH:MM (24h)',
                                            'items' => [
                                                'type' => 'string',
                                                'pattern' => '^([01][0-9]|2[0-3]):[0-5][0-9]$',
                                            ],
                                        ],
                                    ],
                                    'required' => ['medication_id', 'new_time_slots'],
                                ],
                            ],
                            'reason' => [
                                'type' => 'string',
                                'description' => 'Explicação breve do motivo da reorganização (ex: "Evitar interação entre medicamento A e B", "Melhorar espaçamento para maior eficácia")',
                            ],
                        ],
                        'required' => ['medication_schedules', 'reason'],
                    ],
                ],
            ],
        ];
    }
}
