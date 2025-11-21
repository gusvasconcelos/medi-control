<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

final class LoginController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {
    }

    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function store(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $token = $this->authService->attemptLogin($validated);

        Auth::guard('web')->login(auth('api')->user());

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
