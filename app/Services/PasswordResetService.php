<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetService
{
    /**
     * Send password reset link to the user's email.
     *
     * @param string $email
     * @return string
     */
    public function sendResetLink(string $email): string
    {
        Password::sendResetLink(['email' => $email]);

        return 'Caso o email informado exista, você receberá um link de redefinição de senha em breve.';
    }

    /**
     * Reset the user's password using the provided token.
     *
     * @param array{email: string, password: string, password_confirmation: string, token: string} $data
     * @return string
     * @throws ValidationException
     */
    public function resetPassword(array $data): string
    {
        $status = Password::reset(
            $data,
            fn (User $user, string $password) => $user->forceFill(['password' => bcrypt($password)])->save()
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => __($status),
            ]);
        }

        return __('passwords.reset');
    }
}
