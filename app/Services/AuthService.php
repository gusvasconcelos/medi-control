<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Exceptions\UnauthorizedException;
use App\Exceptions\UnprocessableEntityException;
use Illuminate\Support\Collection;

class AuthService
{
    /**
     * Register a new user in the system.
     *
     * @param Collection $userData
     * @return User
     */
    public static function registerUser(Collection $userData): User
    {
        return User::create([
            'name' => $userData->get('name'),
            'email' => $userData->get('email'),
            'password' => bcrypt($userData->get('password')),
        ]);
    }

    /**
     * Attempt to authenticate a user via session (for web/SPA).
     *
     * @param Collection $credentials
     * @throws UnprocessableEntityException
     */
    public static function attemptLogin(Collection $credentials): User
    {
        if (! Auth::attempt($credentials->toArray())) {
            throw new UnprocessableEntityException(__('auth.invalid_credentials'), 'INVALID_CREDENTIALS');
        }

        /** @var User $user */
        $user = Auth::user();

        return $user;
    }

    /**
     * Get the authenticated user.
     *
     * @throws UnauthorizedException
     */
    public static function getAuthenticatedUser(): User
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
    public static function logout(): void
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
