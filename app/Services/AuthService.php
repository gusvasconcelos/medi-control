<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Exceptions\UnauthorizedException;
use App\Exceptions\UnprocessableEntityException;

class AuthService
{
    /**
     * Register a new user in the system.
     *
     * @param array{name: string, email: string, password: string} $userData
     */
    public function registerUser(array $userData): User
    {
        return User::create([
            'name' => $userData['name'],
            'email' => $userData['email'],
            'password' => bcrypt($userData['password']),
        ]);
    }

    /**
     * Attempt to authenticate a user via session (for web/SPA).
     *
     * @param array{email: string, password: string} $credentials
     * @throws UnprocessableEntityException
     */
    public function attemptLogin(array $credentials): User
    {
        if (! Auth::attempt($credentials)) {
            throw new UnprocessableEntityException(__('auth.invalid_credentials'), 'INVALID_CREDENTIALS');
        }

        /** @var User $user */
        $user = Auth::user();

        return $user;
    }

    /**
     * Attempt to authenticate and create a Sanctum token (for mobile API).
     *
     * @param array{email: string, password: string} $credentials
     * @param string $deviceName
     * @return array{user: User, token: string}
     * @throws UnprocessableEntityException
     */
    public function attemptLoginWithToken(array $credentials, string $deviceName): array
    {
        if (! Auth::attempt($credentials)) {
            throw new UnprocessableEntityException(__('auth.invalid_credentials'), 'INVALID_CREDENTIALS');
        }

        /** @var User $user */
        $user = Auth::user();

        $token = $user->createToken($deviceName)->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Get the authenticated user.
     *
     * @throws UnauthorizedException
     */
    public function getAuthenticatedUser(): User
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (! $user) {
            throw new UnauthorizedException(__('auth.not_authenticated'));
        }

        return $user;
    }

    /**
     * Logout the authenticated user (invalidate session).
     */
    public function logout(): void
    {
        Auth::guard('web')->logout();
    }

    /**
     * Revoke all tokens for the authenticated user (for mobile API).
     */
    public function revokeAllTokens(): void
    {
        /** @var User|null $user */
        $user = Auth::user();

        $user?->tokens()->delete();
    }

    /**
     * Revoke the current token (for mobile API).
     */
    public function revokeCurrentToken(): void
    {
        /** @var User|null $user */
        $user = Auth::user();

        $user?->currentAccessToken()?->delete();
    }
}
