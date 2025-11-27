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

    /**
     * @param array<int, array{role: string, content: string}> $messages
     * @param array<int, array{type: string, function: array{name: string, description: string, parameters: array<string, mixed>}}> $tools
     * @return \Generator<int, array{type: string, content?: string, tool_calls?: array<int, array{id: string, type: string, function: array{name: string, arguments: string}}>, usage?: array{prompt_tokens: int, completion_tokens: int, total_tokens: int}}>
     * @throws \RuntimeException
     */
    public function chatCompletionStream(
        array $messages,
        string $model,
        float $temperature = 1,
        array $tools = [],
    ): \Generator;
}
