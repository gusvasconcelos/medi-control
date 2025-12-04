<?php

namespace App\Http\Requests\File;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFileRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'file' => ['required_without:url', 'nullable', 'max:10240'],
            'url' => ['required_without:file', 'nullable', 'url', 'max:2048'],
            'original_name' => ['nullable', 'string', 'max:255'],
            'visibility' => ['required', Rule::in(['private', 'public', 'shared'])],
            'disk' => ['nullable', Rule::in(['s3', 'local', 'minio'])],
            'metadata' => ['nullable', 'array'],
        ];
    }

    public function attributes(): array
    {
        return [
            'file' => __('validation.attributes.file'),
            'url' => __('validation.attributes.url'),
            'original_name' => __('validation.attributes.original_name'),
            'visibility' => __('validation.attributes.visibility'),
            'disk' => __('validation.attributes.disk'),
            'metadata' => __('validation.attributes.metadata'),
        ];
    }
}
