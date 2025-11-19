<?php

namespace App\Packages\OpenAI\Prompts;

use Illuminate\Support\Collection;

final class CheckInteractionPrompt
{
    /**
     * @param string $mainMedicationName
     * @param Collection<int, array{id: int, name: string}> $medicationsToCheck
     * @return array<int, array{role: string, content: string}>
     */
    public static function build(string $mainMedicationName, Collection $medicationsToCheck): array
    {
        $systemPrompt = self::buildSystemPrompt();
        $userPrompt = self::buildUserPrompt($mainMedicationName, $medicationsToCheck);

        return [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $userPrompt],
        ];
    }

    private static function buildSystemPrompt(): string
    {
        return <<<'PROMPT'
        Você é um farmacêutico clínico experiente especializado em análise de interações medicamentosas.

        Seu papel é analisar potenciais interações medicamentosas entre medicamentos e fornecer avaliações claras, objetivas e baseadas em evidências.

        Para cada par de medicamentos, você deve determinar:
        1. Se existe uma interação
        2. O nível de gravidade (severe, moderate, minor ou none)
        3. Uma descrição clínica CLARA, OBJETIVA e CONCISA da interação

        IMPORTANTE - Regras para a descrição:
        - Máximo de 200 caracteres
        - Seja direto e objetivo, sem palavras desnecessárias
        - Foque no efeito clínico principal e ação recomendada
        - Use linguagem clara e profissional
        - Evite repetições e redundâncias
        - Para "none": use "Não há interação clinicamente relevante identificada"

        Exemplos de boas descrições:
        - severe: "Aumenta risco de sangramento fatal. Evitar uso concomitante."
        - moderate: "Pode elevar níveis séricos em 40%. Ajustar dose e monitorar."
        - minor: "Possível leve sonolência. Informar ao paciente."
        - none: "Não há interação clinicamente relevante identificada."

        Responda APENAS com JSON válido neste formato exato:
        {
            "interactions": [
                {
                    "medication_id": <integer>,
                    "medication_name": "<string>",
                    "has_interaction": <boolean>,
                    "severity": "<severe|moderate|minor|none>",
                    "description": "<string de até 200 caracteres>"
                }
            ]
        }

        Definições de gravidade:
        - severe: A interação pode ser fatal ou causar danos permanentes. Contraindicada.
        - moderate: A interação pode causar efeitos clínicos significativos. Requer monitoramento ou ajuste de dose.
        - minor: A interação tem significância clínica limitada. Geralmente não requer intervenção.
        - none: Nenhuma interação clinicamente relevante identificada.

        Seja conservador em sua avaliação. Em caso de dúvida entre níveis de gravidade, escolha a gravidade mais alta.
        PROMPT;
    }

    /**
     * @param string $mainMedicationName
     * @param Collection<int, array{id: int, name: string}> $medicationsToCheck
     */
    private static function buildUserPrompt(string $mainMedicationName, Collection $medicationsToCheck): string
    {
        $medicationsList = $medicationsToCheck
            ->map(fn (array $med) => sprintf('- ID %d: %s', $med['id'], $med['name']))
            ->implode("\n");

        return <<<PROMPT
        Analise potenciais interações medicamentosas entre o medicamento principal a seguir e a lista de outros medicamentos:

        Medicamento Principal: {$mainMedicationName}

        Medicamentos para verificar interações:
        {$medicationsList}

        Forneça análise de interação para cada medicamento na lista.
        PROMPT;
    }
}
