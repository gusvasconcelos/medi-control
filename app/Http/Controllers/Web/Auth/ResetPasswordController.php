<?php

namespace App\Http\Controllers\Web\Auth;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Services\PasswordResetService;
use App\Http\Requests\Auth\ResetPasswordRequest;

final class ResetPasswordController extends Controller
{
    public function __construct(
        private readonly PasswordResetService $passwordResetService
    ) {}

    public function create(Request $request): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $request->query('token'),
            'email' => $request->query('email'),
        ]);
    }

    public function store(ResetPasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $message = $this->passwordResetService->resetPassword($validated);

        return response()->json([
            'message' => $message,
        ]);
    }
}
