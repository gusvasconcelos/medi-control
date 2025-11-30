<?php

namespace App\Http\Controllers\Web\Auth;

use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use App\Services\PasswordResetService;
use App\Http\Requests\Auth\ForgotPasswordRequest;

final class ForgotPasswordController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function store(ForgotPasswordRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $message = PasswordResetService::sendResetLink($validated['email']);

        return redirect()->route('login')->with('info', $message);
    }
}
