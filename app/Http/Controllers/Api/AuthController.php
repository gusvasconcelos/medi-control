<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Exceptions\UnauthorizedException;
use App\Exceptions\UnprocessableEntityException;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $token = auth('api')->attempt($validated);

        if (! $token) {
            throw new UnprocessableEntityException(__('messages.auth.invalid_credentials'), 'INVALID_CREDENTIALS');
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60 // @phpstan-ignore-line
        ]);
    }

    public function me(): JsonResponse
    {
        $user = auth('api')->user();

        if (! $user) {
            throw new UnauthorizedException(__('messages.auth.not_authenticated'));
        }

        return response()->json($user);
    }

    public function logout(): JsonResponse
    {
        auth('api')->logout();

        return response()->json([
            'message' => __('messages.auth.logout')
        ]);
    }

    public function refresh(): JsonResponse
    {
        $token = auth('api')->refresh(); // @phpstan-ignore-line

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60 // @phpstan-ignore-line
        ]);
    }
}
