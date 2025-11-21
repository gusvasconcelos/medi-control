<?php

namespace App\Http\Controllers\Api;

use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\MobileLoginRequest;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $this->authService->registerUser($validated);

        return response()->json([
            'message' => __('auth.register_success'),
        ]);
    }

    public function login(MobileLoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $result = $this->authService->attemptLoginWithToken(
            credentials: [
                'email' => $validated['email'],
                'password' => $validated['password'],
            ],
            deviceName: $validated['device_name']
        );

        return response()->json([
            'user' => $result['user'],
            'access_token' => $result['token'],
            'token_type' => 'Bearer',
        ]);
    }

    public function me(): JsonResponse
    {
        $user = $this->authService->getAuthenticatedUser();

        return response()->json($user);
    }

    public function logout(): JsonResponse
    {
        $this->authService->revokeCurrentToken();

        return response()->json([
            'message' => __('auth.logout')
        ]);
    }
}
