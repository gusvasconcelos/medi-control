<?php

namespace App\Http\Controllers\Web\Auth;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Services\PasswordResetService;
use App\Http\Requests\Auth\ForgotPasswordRequest;

final class ForgotPasswordController extends Controller
{
    public function __construct(
        private readonly PasswordResetService $passwordResetService
    ) {
    }

    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function store(ForgotPasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $message = $this->passwordResetService->sendResetLink($validated['email']);

        return response()->json([
            'message' => $message,
        ]);
    }
}
