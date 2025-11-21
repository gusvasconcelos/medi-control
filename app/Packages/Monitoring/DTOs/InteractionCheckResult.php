<?php

namespace App\Packages\Monitoring\DTOs;

use App\Packages\OpenAI\DTOs\InteractionResult;
use Illuminate\Support\Collection;

final readonly class InteractionCheckResult
{
    /**
     * @param Collection<int, InteractionResult> $interactions
     */
    public function __construct(
        public Collection $interactions,
        public TokenUsage $tokenUsage,
        public float $durationInSeconds,
        public string $model
    ) {
    }
}
