<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Services\PasswordResetService;
use App\Http\Requests\Auth\ForgotPasswordRequest;

class ForgotPasswordController extends Controller
{
    public function __construct(
        private readonly PasswordResetService $passwordResetService
    ) {
    }

    public function sendResetLink(ForgotPasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $message = $this->passwordResetService->sendResetLink($validated['email']);

        return response()->json([
            'message' => $message,
        ]);
    }
}
