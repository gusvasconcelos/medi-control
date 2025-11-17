<?php

namespace App\Packages\OpenAI;

use App\Packages\OpenAI\Contracts\OpenAIClientInterface;
use Illuminate\Support\Facades\Log;
use OpenAI;
use OpenAI\Client;
use OpenAI\Exceptions\ErrorException;
use OpenAI\Exceptions\TransporterException;

final class OpenAIClient implements OpenAIClientInterface
{
    private Client $client;

    public function __construct()
    {
        $this->client = OpenAI::client(config('openai.api_key'));
    }

    /**
     * @param array<int, array{role: string, content: string}> $messages
     * @return array<string, mixed>
     * @throws \RuntimeException
     */
    public function chatCompletion(
        array $messages,
        float $temperature = 1,
        string $model,
        bool $jsonFormat = true,
    ): array {
        $startTime = microtime(true);

        try {
            $params = [
                'model' => $model,
                'messages' => $messages,
                'temperature' => $temperature,
                'top_p' => 1.0,
            ];

            if ($jsonFormat) {
                $params['response_format'] = ['type' => 'json_object'];
            }

            $response = $this->client->chat()->create($params);

            $duration = round((microtime(true) - $startTime) * 1000, 2);

            Log::info('OpenAI chat completion successful', [
                'model' => $model,
                'duration_ms' => $duration,
                'tokens_used' => $response->usage->totalTokens ?? null,
                'finish_reason' => $response->choices[0]->finishReason ?? null,
            ]);

            return [
                'content' => $response->choices[0]->message->content ?? '',
                'usage' => [
                    'prompt_tokens' => $response->usage->promptTokens ?? 0,
                    'completion_tokens' => $response->usage->completionTokens ?? 0,
                    'total_tokens' => $response->usage->totalTokens ?? 0,
                ],
                'finish_reason' => $response->choices[0]->finishReason ?? 'unknown',
            ];
        } catch (ErrorException $e) {
            Log::error('OpenAI API error', [
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);

            throw new \RuntimeException(
                'Failed to get response from OpenAI: ' . $e->getMessage(),
                $e->getCode(),
                $e
            );
        } catch (TransporterException $e) {
            Log::error('OpenAI transporter error', [
                'error' => $e->getMessage(),
            ]);

            throw new \RuntimeException(
                'Connection error with OpenAI service: ' . $e->getMessage(),
                0,
                $e
            );
        } catch (\Exception $e) {
            Log::error('Unexpected OpenAI error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw new \RuntimeException(
                'Unexpected error during OpenAI request: ' . $e->getMessage(),
                0,
                $e
            );
        }
    }
}
