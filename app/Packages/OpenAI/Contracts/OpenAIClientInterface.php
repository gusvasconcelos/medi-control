<?php

namespace App\Packages\OpenAI\Contracts;

interface OpenAIClientInterface
{
    /**
     * @param array<int, array{role: string, content: string}> $messages
     * @param array<int, array{type: string, function: array{name: string, description: string, parameters: array<string, mixed>}}> $tools
     * @return array<string, mixed>
     * @throws \RuntimeException
     */
    public function chatCompletion(
        array $messages,
        string $model,
        float $temperature = 1,
        bool $jsonFormat = false,
        array $tools = [],
    ): array;
}
