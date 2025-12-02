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
    public function __construct(
        private readonly AuthService $authService
    ) {
    }

    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(RegisterRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $this->authService->registerUser($validated);

        $this->authService->attemptLogin([
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        $request->session()->regenerate();

        return redirect()->route('select-role');
    }
}
