<?php

namespace App\Packages\Monitoring\DTOs;

final readonly class InteractionCheckMetrics
{
    public function __construct(
        public string $medicationName,
        public int $medicationsCheckedCount,
        public int $interactionsFoundCount,
        public int $severeInteractionsCount,
        public int $moderateInteractionsCount,
        public int $alertsCreatedCount,
        public TokenUsage $tokenUsage,
        public float $durationInSeconds,
        public string $model
    ) {
    }
}
