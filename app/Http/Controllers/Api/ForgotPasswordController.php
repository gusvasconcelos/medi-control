<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Password;
use App\Http\Requests\Auth\ForgotPasswordRequest;

class ForgotPasswordController extends Controller
{
    public function sendResetLink(ForgotPasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();

        Password::sendResetLink($validated);

        return response()->json([
            'message' => 'Caso o email informado exista, você receberá um link de redefinição de senha em breve.',
        ]);
    }
}
