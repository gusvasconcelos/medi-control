<?php

namespace App\Services;

use App\Models\User;
use App\Exceptions\UnauthorizedException;
use App\Exceptions\UnprocessableEntityException;

class AuthService
{
    /**
     * Register a new user in the system.
     *
     * @param array{name: string, email: string, password: string} $userData
     * @return User
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
     * Attempt to authenticate a user and return JWT token.
     *
     * @param array{email: string, password: string} $credentials
     * @return string
     * @throws UnprocessableEntityException
     */
    public function attemptLogin(array $credentials): string
    {
        $token = auth('api')->attempt($credentials);

        if (! $token) {
            throw new UnprocessableEntityException(__('auth.invalid_credentials'), 'INVALID_CREDENTIALS');
        }

        return $token;
    }

    /**
     * Get the authenticated user.
     *
     * @return User
     * @throws UnauthorizedException
     */
    public function getAuthenticatedUser(): User
    {
        /** @var User|null $user */
        $user = auth('api')->user();

        if (! $user) {
            throw new UnauthorizedException(__('auth.not_authenticated'));
        }

        return $user;
    }

    /**
     * Logout the authenticated user (invalidate token).
     *
     * @return void
     */
    public function logout(): void
    {
        auth('api')->logout();
    }

    /**
     * Refresh the JWT token.
     *
     * @return string
     */
    public function refreshToken(): string
    {
        return auth('api')->refresh(); // @phpstan-ignore-line
    }

    /**
     * Format the token response with expiration time.
     *
     * @param string $token
     * @return array{access_token: string, token_type: string, expires_in: int}
     */
    public function respondWithToken(string $token): array
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60 // @phpstan-ignore-line
        ];
    }
}
