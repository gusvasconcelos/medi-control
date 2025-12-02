<?php

namespace App\Http\Requests\Medication;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMedicationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'active_principle' => ['required', 'string', 'max:1000'],
            'manufacturer' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'therapeutic_class' => ['nullable', 'string', 'max:255'],
            'registration_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('medications', 'registration_number')->ignore($this->route('id')),
            ],
            'strength' => ['nullable', 'string', 'max:255'],
            'form' => ['required', 'string', Rule::in(['tablet', 'capsule', 'liquid', 'injection', 'cream', 'drops', 'spray', 'inhaler', 'patch', 'other'])],
            'description' => ['nullable', 'string', 'max:4000'],
            'warnings' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => __('validation.attributes.name'),
            'active_principle' => __('validation.attributes.active_principle'),
            'manufacturer' => __('validation.attributes.manufacturer'),
            'category' => __('validation.attributes.category'),
            'therapeutic_class' => __('validation.attributes.therapeutic_class'),
            'registration_number' => __('validation.attributes.registration_number'),
            'strength' => __('validation.attributes.strength'),
            'form' => __('validation.attributes.form'),
            'description' => __('validation.attributes.description'),
            'warnings' => __('validation.attributes.warnings'),
        ];
    }
}
