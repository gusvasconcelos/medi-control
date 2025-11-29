<?php

namespace App\Packages\OpenAI\Prompts;

use App\Models\Medication;
use Illuminate\Support\Collection;

final class CheckInteractionPrompt
{
    public static function build(Medication $medication, Collection $medicationsToCheck): array
    {
        $systemPrompt = self::buildSystemPrompt();

        $userPrompt = self::buildUserPrompt($medication, $medicationsToCheck);

        return [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $userPrompt],
        ];
    }

    private static function buildSystemPrompt(): string
    {
        return <<<PROMPT
        <role>
            <description>Você é um farmacêutico clínico experiente especializado em análise de interações medicamentosas.</description>
        </role>

        <objective>
            <description>Seu papel é analisar potenciais interações medicamentosas entre medicamentos e fornecer avaliações claras, objetivas e baseadas em evidências.</description>
        </objective>

        <tasks>
            <description>Para cada par de medicamentos, você deve determinar:</description>
            <item id="1">Se existe uma interação</item>
            <item id="2">O nível de gravidade (severe, moderate, minor ou none)</item>
            <item id="3">Uma descrição clínica CLARA, OBJETIVA e CONCISA da interação</item>
            <item id="4">Uma recomendação para o paciente</item>
        </tasks>

        <extraction_rules>
            <description_rules>
                <item id="1">Máximo de 300 caracteres</item>
                <item id="2">Seja direto e objetivo, sem palavras desnecessárias</item>
                <item id="3">Foque no efeito clínico principal</item>
                <item id="4">Use linguagem clara e profissional</item>
                <item id="5">Evite repetições e redundâncias</item>
                <item id="6">Para "none": use "Não há interação clinicamente relevante identificada"</item>
            </description_rules>
            <recommendation_rules>
                <item id="1">Máximo de 200 caracteres</item>
                <item id="2">Seja direto e objetivo, sem palavras desnecessárias</item>
                <item id="3">Use linguagem clara e profissional</item>
                <item id="4">Evite repetições e redundâncias</item>
                <item id="5">Para "none": use "Nenhuma recomendação necessária"</item>
            </recommendation_rules>
            <gravity_rules>
                <item id="none">none: Nenhuma interação clinicamente relevante identificada.</item>
                <item id="mild">A interação tem significância clínica limitada. Geralmente não requer intervenção.</item>
                <item id="moderate">A interação pode causar efeitos clínicos significativos. Requer monitoramento ou ajuste de dose.</item>
                <item id="severe">A interação pode ser fatal ou causar danos permanentes.</item>
            </gravity_rules>
        </extraction_rules>

        <examples>
            <description>Exemplos de boas descrições:</description>
            <item id="severe">Aumenta risco de sangramento fatal. Evitar uso concomitante.</item>
            <item id="moderate">Pode elevar níveis séricos em 40%. Ajustar dose e monitorar.</item>
            <item id="mild">Possível leve sonolência. Informar ao paciente.</item>
            <item id="none">Não há interação clinicamente relevante identificada.</item>
        </examples>

        <output_format>
            Responda APENAS com JSON válido neste formato exato:
            {
                "interactions": [
                    {
                        "medication_id": <integer>,
                        "has_interaction": <boolean>,
                        "severity": "<none|mild|moderate|severe>",
                        "description": "<string de até 300 caracteres>",
                        "recommendation": "<string de até 200 caracteres>"
                    }
                ]
            }
        </output_format>

        <final_instruction>
            <description>Seja conservador em sua avaliação. Em caso de dúvida entre níveis de gravidade, escolha a gravidade mais alta.</description>
        </final_instruction>
        PROMPT;
    }

    private static function buildUserPrompt(Medication $medication, Collection $medicationsToCheck): string
    {
        $medicationsList = $medicationsToCheck
            ->map(fn (Medication $medication) => "<item id=\"{$medication->id}\">{$medication->name}</item>")
            ->join("\n");

        return <<<PROMPT
        <request>
            <description>Analise potenciais interações medicamentosas entre o medicamento principal a seguir e a lista de outros medicamentos.</description>
        </request>

        <main_medication>
            <id>{$medication->id}</id>
            <name>{$medication->name}</name>
        </main_medication>

        <medications_to_check>
            {$medicationsList}
        </medications_to_check>

        <actions>
            <description>Forneça análise de interação para cada medicamento na lista.</description>
        </actions>
        PROMPT;
    }
}
