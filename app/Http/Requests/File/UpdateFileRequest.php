<?php

namespace App\Http\Requests\File;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFileRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'visibility' => ['nullable', Rule::in(['private', 'public', 'shared'])],
            'metadata' => ['nullable', 'array'],
        ];
    }

    public function attributes(): array
    {
        return [
            'visibility' => __('validation.attributes.visibility'),
            'metadata' => __('validation.attributes.metadata'),
        ];
    }
}
