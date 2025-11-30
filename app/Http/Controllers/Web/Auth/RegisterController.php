<?php

namespace App\Http\Controllers\Web\Auth;

use Inertia\Inertia;
use Inertia\Response;
use App\Services\AuthService;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\Auth\RegisterRequest;

final class RegisterController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(RegisterRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $userData = collect($validated);

        AuthService::registerUser($userData);

        AuthService::attemptLogin($userData);

        $request->session()->regenerate();

        return redirect()->intended(route('select-role'));
    }
}
