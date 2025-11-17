<?php

namespace App\Packages\OpenAI\Contracts;

interface OpenAIClientInterface
{
    /**
     * @param array<int, array{role: string, content: string}> $messages
     * @return array<string, mixed>
     * @throws \RuntimeException
     */
    public function chatCompletion(
        array $messages,
        float $temperature = 1,
        string $model,
        bool $jsonFormat = false,
    ): array;
}
