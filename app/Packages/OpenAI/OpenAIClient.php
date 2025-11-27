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
    ): \Generator {
        $startTime = microtime(true);

        try {
            $params = [
                'model' => $model,
                'messages' => $messages,
                'temperature' => $temperature,
                'top_p' => 1.0,
                'stream' => true,
            ];

            if (!empty($tools)) {
                $params['tools'] = $tools;
                $params['tool_choice'] = 'auto';
            }

            $stream = $this->client->chat()->createStreamed($params);

            $toolCallsBuffer = [];

            foreach ($stream as $response) {
                $delta = $response->choices[0]->delta ?? null;

                if ($delta === null) {
                    continue;
                }

                if (isset($delta->toolCalls)) {
                    foreach ($delta->toolCalls as $toolCall) {
                        $index = $toolCall->index;

                        if (!isset($toolCallsBuffer[$index])) {
                            $toolCallsBuffer[$index] = [
                                'id' => $toolCall->id ?? '',
                                'type' => $toolCall->type ?? 'function',
                                'function' => [
                                    'name' => '',
                                    'arguments' => '',
                                ],
                            ];
                        }

                        if (isset($toolCall->function->name)) {
                            $toolCallsBuffer[$index]['function']['name'] = $toolCall->function->name;
                        }

                        if (isset($toolCall->function->arguments)) {
                            $toolCallsBuffer[$index]['function']['arguments'] .= $toolCall->function->arguments;
                        }
                    }
                }

                if (isset($delta->content) && $delta->content !== '') {
                    yield [
                        'type' => 'content_delta',
                        'content' => $delta->content,
                    ];
                }

                if ($response->choices[0]->finishReason === 'tool_calls') {
                    yield [
                        'type' => 'tool_calls',
                        'tool_calls' => array_values($toolCallsBuffer),
                    ];
                }

                if ($response->choices[0]->finishReason === 'stop') {
                    if (isset($response->usage)) {
                        yield [
                            'type' => 'usage',
                            'usage' => [
                                'prompt_tokens' => $response->usage->promptTokens ?? 0,
                                'completion_tokens' => $response->usage->completionTokens ?? 0,
                                'total_tokens' => $response->usage->totalTokens ?? 0,
                            ],
                        ];
                    }
                }
            }

            $duration = round((microtime(true) - $startTime) * 1000, 2);

            Log::info('OpenAI streaming completion successful', [
                'model' => $model,
                'duration_ms' => $duration,
            ]);
        } catch (ErrorException $e) {
            Log::error('OpenAI API streaming error', [
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);

            throw new \RuntimeException(
                'Failed to stream response from OpenAI: ' . $e->getMessage(),
                $e->getCode(),
                $e
            );
        } catch (TransporterException $e) {
            Log::error('OpenAI streaming transporter error', [
                'error' => $e->getMessage(),
            ]);

            throw new \RuntimeException(
                'Connection error with OpenAI streaming service: ' . $e->getMessage(),
                0,
                $e
            );
        } catch (\Exception $e) {
            Log::error('Unexpected OpenAI streaming error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw new \RuntimeException(
                'Unexpected error during OpenAI streaming request: ' . $e->getMessage(),
                0,
                $e
            );
        }
    }
}
