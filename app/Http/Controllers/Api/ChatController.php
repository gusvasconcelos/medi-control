<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Chat\SendMessageRequest;
use App\Services\ChatService;
use Illuminate\Http\JsonResponse;

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
