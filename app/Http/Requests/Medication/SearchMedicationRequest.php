<?php

namespace App\Http\Requests\Medication;

use Illuminate\Foundation\Http\FormRequest;

class SearchMedicationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'search' => ['required', 'string', 'min:3', 'max:255'],
            'limit' => ['sometimes', 'integer', 'min:1', 'max:50'],
        ];
    }

    public function attributes(): array
    {
        return [
            'search' => __('validation.attributes.search'),
            'limit' => __('validation.attributes.limit'),
        ];
    }
}
