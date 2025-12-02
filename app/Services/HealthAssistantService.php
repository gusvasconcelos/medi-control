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
        $userContext = $this->getUserContext($user);
        $messages = $this->buildMessages($systemPrompt, $userContext, $conversationHistory, $userMessage);
        $tools = $this->getToolDefinitions($user);

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

    /**
     * @param Collection<int, array{role: string, content: string}> $conversationHistory
     * @return \Generator<int, array{type: string, content?: string, tool_calls?: array<int, array{id: string, type: string, function: array{name: string, arguments: string}}>, usage?: array{prompt_tokens: int, completion_tokens: int, total_tokens: int}}>
     */
    public function generateResponseStream(
        User $user,
        string $userMessage,
        Collection $conversationHistory,
        bool $isSuggestion = false
    ): \Generator {
        $systemPrompt = $this->buildSystemPrompt();
        $userContext = $this->getUserContext($user);
        $messages = $this->buildMessages($systemPrompt, $userContext, $conversationHistory, $userMessage);
        $tools = $this->getToolDefinitions($user);

        yield from $this->openAIClient->chatCompletionStream(
            messages: $messages,
            model: config('openai.health_assistant.model'),
            temperature: config('openai.health_assistant.temperature'),
            tools: $tools
        );
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

        <topic_restriction>
            - Você DEVE responder APENAS sobre tópicos relacionados a:
                * Saúde e medicamentos
                * Tratamentos médicos
                * Sintomas e condições de saúde
                * Interações medicamentosas
                * Aderência ao tratamento
                * Orientações gerais de saúde
            - Se o usuário perguntar sobre tópicos NÃO relacionados à saúde (ex: esportes, política, entretenimento):
                * Responda educadamente: "Desculpe, só posso ajudar com questões relacionadas à saúde e medicamentos."
                * NÃO forneça nenhuma informação sobre o tópico solicitado
                * NÃO se desculpe excessivamente
            - Mantenha o foco em ajudar o paciente com sua saúde
        </topic_restriction>

        <response_format>
            - Use português claro e simples (pt-BR)
            - Seja conciso mas completo
            - Use listas com marcadores quando apropriado
            - Destaque avisos importantes com ênfase
            - Seja empático e encorajador
        </response_format>

        <brevity_instructions>
            - Quando NÃO usar ferramentas: seja extremamente conciso (2-4 sentenças)
            - Vá direto ao ponto sem introduções longas
            - Evite repetir informações já fornecidas
            - Use listas somente quando absolutamente necessário
            - Quando executar ferramentas: forneça contexto adicional se necessário
        </brevity_instructions>

        <proactive_tool_usage>
            Você DEVE interpretar a INTENÇÃO do usuário e ativar ferramentas automaticamente, mesmo quando não explicitamente solicitadas.

            <when_to_use_tools>
                1. add_user_medication - Ative quando o usuário:
                   - Menciona que vai tomar um medicamento: "vou tomar paracetamol amanhã"
                   - Indica início de novo tratamento: "comecei a tomar losartana"
                   - Fala sobre adicionar/incluir medicamento: "quero adicionar aspirina"
                   - Menciona prescrição nova: "médico receitou metformina"

                2. check_medication_interactions - Ative quando o usuário:
                   - Relata sintomas após tomar medicamento: "tomei varfarina e to sentindo enjoo"
                   - Pergunta sobre efeitos de combinar: "posso tomar X com Y?"
                   - Menciona reações adversas: "estou com tontura depois do remédio"
                   - Expressa preocupação sobre combinações: "esses remédios combinam?"

                3. reorganize_medications - Ative quando o usuário:
                   - Pede para ajustar horários: "organize os horários dos meus medicamentos"
                   - Quer melhorar distribuição: "espaçar melhor as doses"
                   - Indica dificuldade com horários: "não consigo tomar tudo de manhã"
                   - Solicita otimização: "qual melhor horário para tomar?"
            </when_to_use_tools>

            <activation_rules>
                - Priorize a ação sobre confirmação - ative a ferramenta quando detectar intenção clara
                - Não peça permissão para usar ferramentas, apenas use-as
                - Pode executar múltiplas ferramentas em sequência se necessário
                - Seja proativo: é melhor ativar uma ferramenta do que apenas responder com texto
            </activation_rules>
        </proactive_tool_usage>

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
                    'description' => 'Verifica interações medicamentosas entre medicamentos ativos. ATIVE quando o usuário: relatar sintomas após tomar medicamento (ex: "tomei X e sinto enjoo"), perguntar sobre combinar medicamentos, mencionar reações adversas, ou expressar preocupação sobre suas medicações. Não peça confirmação, apenas execute a verificação.',
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
                    'description' => 'Reorganiza horários dos medicamentos com espaçamento adequado. A reorganização SEMPRE começa amanhã. ATIVE quando o usuário: pedir para organizar/ajustar horários (ex: "organize os horários"), mencionar dificuldade com distribuição atual, quiser melhorar espaçamento entre doses, ou perguntar sobre melhores horários. Seja proativo e execute a reorganização.',
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
            [
                'type' => 'function',
                'function' => [
                    'name' => 'add_user_medication',
                    'description' => 'Adiciona novo medicamento ao tratamento. ATIVE quando o usuário: mencionar que vai tomar medicamento (ex: "vou tomar paracetamol amanhã"), indicar início de tratamento (ex: "comecei a tomar X"), falar sobre adicionar medicamento, ou mencionar prescrição nova. Primeiro busque por nome, depois colete campos obrigatórios faltantes em conversação natural. Seja proativo.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'medication_name' => [
                                'type' => 'string',
                                'description' => 'Nome do medicamento para buscar no banco de dados (ex: "Paracetamol", "Losartana")',
                            ],
                            'medication_id' => [
                                'type' => 'integer',
                                'description' => 'ID do medicamento confirmado pelo usuário após busca',
                            ],
                            'dosage' => [
                                'type' => 'string',
                                'description' => 'Dosagem do medicamento (ex: "1 comprimido", "500mg", "2 cápsulas")',
                            ],
                            'time_slots' => [
                                'type' => 'array',
                                'description' => 'Horários de tomada no formato HH:MM (24h)',
                                'items' => [
                                    'type' => 'string',
                                    'pattern' => '^([01][0-9]|2[0-3]):[0-5][0-9]$',
                                ],
                                'minItems' => 1,
                            ],
                            'via_administration' => [
                                'type' => 'string',
                                'description' => 'Via de administração do medicamento',
                                'enum' => ['oral', 'topical', 'injection', 'inhalation', 'sublingual', 'rectal', 'other'],
                            ],
                            'start_date' => [
                                'type' => 'string',
                                'description' => 'Data de início do tratamento no formato YYYY-MM-DD',
                                'pattern' => '^\d{4}-\d{2}-\d{2}$',
                            ],
                            'end_date' => [
                                'type' => 'string',
                                'description' => 'Data de término do tratamento no formato YYYY-MM-DD (opcional para tratamentos contínuos)',
                                'pattern' => '^\d{4}-\d{2}-\d{2}$',
                            ],
                            'initial_stock' => [
                                'type' => 'integer',
                                'description' => 'Estoque inicial do medicamento (quantidade de doses/comprimidos)',
                                'minimum' => 0,
                            ],
                            'current_stock' => [
                                'type' => 'integer',
                                'description' => 'Estoque atual (geralmente igual ao inicial no cadastro)',
                                'minimum' => 0,
                            ],
                            'low_stock_threshold' => [
                                'type' => 'integer',
                                'description' => 'Limite de estoque baixo para alertas (geralmente 5-10)',
                                'minimum' => 0,
                            ],
                            'notes' => [
                                'type' => 'string',
                                'description' => 'Observações adicionais sobre o medicamento (opcional)',
                            ],
                            'search_step' => [
                                'type' => 'boolean',
                                'description' => 'true se esta chamada é apenas para buscar medicamentos por nome',
                            ],
                        ],
                        'required' => [],
                    ],
                ],
            ],
        ];
    }
}
