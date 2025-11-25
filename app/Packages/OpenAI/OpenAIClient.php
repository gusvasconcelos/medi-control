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
     * @param array<int, array{type: string, function: array{name: string, description: string, parameters: array<string, mixed>}}> $tools
     * @return array<string, mixed>
     * @throws \RuntimeException
     */
    public function chatCompletion(
        array $messages,
        string $model,
        float $temperature = 1,
        bool $jsonFormat = true,
        array $tools = [],
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

            if (!empty($tools)) {
                $params['tools'] = $tools;
                $params['tool_choice'] = 'auto';
            }

            $response = $this->client->chat()->create($params);

            $duration = round((microtime(true) - $startTime) * 1000, 2);

            Log::info('OpenAI chat completion successful', [
                'model' => $model,
                'duration_ms' => $duration,
                'tokens_used' => $response->usage->totalTokens ?? null,
                'finish_reason' => $response->choices[0]->finishReason ?? null,
            ]);

            $toolCalls = [];
            if (isset($response->choices[0]->message->toolCalls)) {
                foreach ($response->choices[0]->message->toolCalls as $toolCall) {
                    $toolCalls[] = [
                        'id' => $toolCall->id,
                        'type' => $toolCall->type,
                        'function' => [
                            'name' => $toolCall->function->name,
                            'arguments' => $toolCall->function->arguments,
                        ],
                    ];
                }
            }

            return [
                'content' => $response->choices[0]->message->content ?? '',
                'usage' => [
                    'prompt_tokens' => $response->usage->promptTokens ?? 0,
                    'completion_tokens' => $response->usage->completionTokens ?? 0,
                    'total_tokens' => $response->usage->totalTokens ?? 0,
                ],
                'finish_reason' => $response->choices[0]->finishReason ?? 'unknown',
                'tool_calls' => $toolCalls,
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
