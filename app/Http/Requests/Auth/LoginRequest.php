<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string', 'min:8'],
        ];
    }

    public function attributes(): array
    {
        return [
            'email' => __('validation.attributes.email'),
            'password' => __('validation.attributes.password'),
        ];
    }
}
