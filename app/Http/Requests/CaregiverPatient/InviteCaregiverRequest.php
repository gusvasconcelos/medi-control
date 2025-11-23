<?php

namespace App\Http\Requests\CaregiverPatient;

use Illuminate\Foundation\Http\FormRequest;

class InviteCaregiverRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'max:255'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'email' => __('validation.attributes.email'),
            'permissions' => __('validation.attributes.permissions'),
        ];
    }
}
