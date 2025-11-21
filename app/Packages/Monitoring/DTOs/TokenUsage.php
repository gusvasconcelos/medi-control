<?php

namespace App\Packages\Monitoring\DTOs;

final readonly class TokenUsage
{
    public function __construct(
        public int $promptTokens,
        public int $completionTokens,
        public int $totalTokens
    ) {
    }

    /**
     * @param array{prompt_tokens: int, completion_tokens: int, total_tokens: int} $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            promptTokens: $data['prompt_tokens'],
            completionTokens: $data['completion_tokens'],
            totalTokens: $data['total_tokens']
        );
    }
}
