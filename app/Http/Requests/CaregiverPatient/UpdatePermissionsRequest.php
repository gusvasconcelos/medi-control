<?php

namespace App\Http\Requests\CaregiverPatient;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePermissionsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'permissions' => ['required', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'permissions' => __('validation.attributes.permissions'),
        ];
    }
}
