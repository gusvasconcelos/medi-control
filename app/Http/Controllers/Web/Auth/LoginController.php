<?php

namespace App\Http\Controllers\Web\Auth;

use Inertia\Inertia;
use Inertia\Response;
use App\Services\AuthService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Session;

final class LoginController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function store(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $token = $this->authService->attemptLogin($validated);

        return response()->json(
            $this->authService->respondWithToken($token)
        );
    }

    public function destroy(): JsonResponse
    {
        $this->authService->logout();

        Session::flush();

        return response()->json([
            'message' => __('auth.logout')
        ]);
    }
}
