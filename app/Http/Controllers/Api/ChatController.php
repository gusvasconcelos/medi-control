<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Chat\SendMessageRequest;
use App\Services\ChatService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ChatController extends Controller
{
    public function __construct(
        private readonly ChatService $chatService
    ) {
    }

    public function show(): JsonResponse
    {
        $user = auth('web')->user();

        $session = $this->chatService->getOrCreateSession($user);
        $messages = $this->chatService->getMessages($session, 50);

        return response()->json([
            'session' => $session,
            'messages' => $messages,
        ]);
    }

    public function index(): JsonResponse
    {
        $user = auth('web')->user();

        $session = $this->chatService->getOrCreateSession($user);
        $messages = $this->chatService->getMessages($session, 50);

        return response()->json([
            'data' => $messages,
            'session_id' => $session->id,
        ]);
    }

    public function store(SendMessageRequest $request): JsonResponse
    {
        $user = auth('web')->user();

        $validated = $request->validated();

        $result = $this->chatService->sendMessage(
            $user,
            $validated['message'],
            $validated['is_suggestion'] ?? false
        );

        return response()->json([
            'message' => $result['assistantMessage'],
            'session_id' => $result['sessionId'],
        ]);
    }

    public function streamMessage(SendMessageRequest $request): StreamedResponse
    {
        $user = auth('web')->user();

        $validated = $request->validated();

        return new StreamedResponse(
            function () use ($user, $validated) {
                // Disable all output buffering
                while (ob_get_level() > 0) {
                    ob_end_clean();
                }

                // Set script timeout to 5 minutes for long responses
                set_time_limit(300);

                // Send initial comment to establish connection
                echo ": connected\n\n";
                if (function_exists('flush')) {
                    @flush();
                }

                $stream = $this->chatService->sendMessageStream(
                    $user,
                    $validated['message'],
                    $validated['is_suggestion'] ?? false
                );

                foreach ($stream as $chunk) {
                    echo 'data: ' . json_encode($chunk) . "\n\n";

                    // Force output to be sent immediately
                    if (function_exists('ob_flush')) {
                        @ob_flush();
                    }
                    if (function_exists('flush')) {
                        @flush();
                    }
                }

                // Send final event to signal completion
                echo "data: {\"type\":\"done\"}\n\n";
                if (function_exists('flush')) {
                    @flush();
                }
            },
            200,
            [
                'Content-Type' => 'text/event-stream',
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
                'X-Accel-Buffering' => 'no',
                'Connection' => 'keep-alive',
                'Pragma' => 'no-cache',
                'Expires' => '0',
            ]
        );
    }

    public function destroy(): JsonResponse
    {
        $user = auth('web')->user();

        $session = $this->chatService->getOrCreateSession($user);

        $this->chatService->clearHistory($session);

        return response()->json([
            'message' => 'Histórico do chat limpo com sucesso',
        ]);
    }

    public function suggestedPrompts(): JsonResponse
    {
        $user = auth('web')->user();

        $prompts = $this->chatService->getSuggestedPrompts($user);

        return response()->json([
            'data' => $prompts,
        ]);
    }
}
