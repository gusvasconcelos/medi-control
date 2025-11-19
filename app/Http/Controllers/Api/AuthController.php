<?php

namespace App\Http\Controllers\Api;

use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $this->authService->registerUser($validated);

        return response()->json([
            'message' => __('auth.register_success'),
        ]);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $token = $this->authService->attemptLogin($validated);

        return response()->json(
            $this->authService->respondWithToken($token)
        );
    }

    public function me(): JsonResponse
    {
        $user = $this->authService->getAuthenticatedUser();

        return response()->json($user);
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return response()->json([
            'message' => __('auth.logout')
        ]);
    }

    public function refresh(): JsonResponse
    {
        $token = $this->authService->refreshToken();

        return response()->json(
            $this->authService->respondWithToken($token)
        );
    }
}
