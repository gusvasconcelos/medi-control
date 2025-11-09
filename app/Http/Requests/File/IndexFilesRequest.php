<?php

namespace App\Http\Requests\File;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexFilesRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'visibility' => ['nullable', Rule::in(['private', 'public', 'shared'])],
            'mime_type' => ['nullable', 'string', 'max:255'],
            'search' => ['nullable', 'string', 'max:255'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function attributes(): array
    {
        return [
            'visibility' => __('validation.attributes.visibility'),
            'mime_type' => __('validation.attributes.mime_type'),
            'search' => __('validation.attributes.search'),
            'per_page' => __('validation.attributes.per_page'),
        ];
    }
}
