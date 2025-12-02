<?php

namespace App\Services\Monitoring;

use App\Packages\Monitoring\DTOs\InteractionCheckMetrics;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DiscordMonitoringService
{
    private ?string $webhookUrl;

    private bool $enabled;

    public function __construct()
    {
        $this->webhookUrl = config('monitoring.discord.webhook_url');
        $this->enabled = config('monitoring.discord.enabled', true);
    }

    public function notifyInteractionCheckCompleted(InteractionCheckMetrics $metrics): void
    {
        if (! $this->canSendNotification()) {
            return;
        }

        $embed = $this->buildInteractionCheckEmbed($metrics);

        $this->sendToDiscord($embed);
    }

    public function notifyInteractionCheckFailed(
        string $medicationName,
        string $errorMessage,
        int $medicationsCheckedCount
    ): void {
        if (! $this->canSendNotification()) {
            return;
        }

        $embed = [
            'title' => 'Interaction Check Failed',
            'color' => 15158332,
            'fields' => [
                [
                    'name' => 'Medicamento',
                    'value' => $medicationName,
                    'inline' => true,
                ],
                [
                    'name' => 'Medicamentos a checar',
                    'value' => (string) $medicationsCheckedCount,
                    'inline' => true,
                ],
                [
                    'name' => 'Erro',
                    'value' => mb_substr($errorMessage, 0, 1000),
                    'inline' => false,
                ],
            ],
            'timestamp' => now()->toIso8601String(),
        ];

        $this->sendToDiscord($embed);
    }

    public function notifyInteractionCheckSkipped(string $medicationName, string $reason): void
    {
        if (! $this->canSendNotification()) {
            return;
        }

        $embed = [
            'title' => 'Interaction Check Skipped',
            'color' => 9807270,
            'fields' => [
                [
                    'name' => 'Medicamento',
                    'value' => $medicationName,
                    'inline' => true,
                ],
                [
                    'name' => 'Motivo',
                    'value' => $reason,
                    'inline' => true,
                ],
            ],
            'timestamp' => now()->toIso8601String(),
        ];

        $this->sendToDiscord($embed);
    }

    /**
     * @return array<string, mixed>
     */
    private function buildInteractionCheckEmbed(InteractionCheckMetrics $metrics): array
    {
        $interactionsSummary = $this->buildInteractionsSummary($metrics);

        return [
            'title' => 'Interaction Check Completed',
            'color' => 3066993,
            'fields' => [
                [
                    'name' => 'Medicamento',
                    'value' => $metrics->medicationName,
                    'inline' => true,
                ],
                [
                    'name' => 'Checados',
                    'value' => "{$metrics->medicationsCheckedCount} medicamentos",
                    'inline' => true,
                ],
                [
                    'name' => 'Interações',
                    'value' => $interactionsSummary,
                    'inline' => true,
                ],
                [
                    'name' => 'Alertas criados',
                    'value' => (string) $metrics->alertsCreatedCount,
                    'inline' => true,
                ],
                [
                    'name' => 'Tokens',
                    'value' => sprintf(
                        '%d (prompt: %d, completion: %d)',
                        $metrics->tokenUsage->totalTokens,
                        $metrics->tokenUsage->promptTokens,
                        $metrics->tokenUsage->completionTokens
                    ),
                    'inline' => true,
                ],
                [
                    'name' => 'Duração',
                    'value' => sprintf('%.2fs', $metrics->durationInSeconds),
                    'inline' => true,
                ],
                [
                    'name' => 'Modelo',
                    'value' => $metrics->model,
                    'inline' => true,
                ],
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }

    private function buildInteractionsSummary(InteractionCheckMetrics $metrics): string
    {
        if ($metrics->interactionsFoundCount === 0) {
            return 'Nenhuma encontrada';
        }

        $parts = ["{$metrics->interactionsFoundCount} encontradas"];

        if ($metrics->severeInteractionsCount > 0) {
            $parts[] = "{$metrics->severeInteractionsCount} severa(s)";
        }

        if ($metrics->moderateInteractionsCount > 0) {
            $parts[] = "{$metrics->moderateInteractionsCount} moderada(s)";
        }

        return implode(', ', $parts);
    }

    private function canSendNotification(): bool
    {
        return $this->enabled && ! empty($this->webhookUrl);
    }

    /**
     * @param array<string, mixed> $embed
     */
    private function sendToDiscord(array $embed): void
    {
        try {
            Http::post($this->webhookUrl, [
                'embeds' => [$embed],
            ]);
        } catch (\Throwable $e) {
            Log::warning('Failed to send Discord monitoring notification', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
