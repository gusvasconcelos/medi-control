<?php

namespace App\Http\Requests\Medication;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckInteractionsRequest extends FormRequest
{
    public function rules(): array
    {
        $medication = $this->route('medication');

        return [
            'medications' => ['required', 'array', 'min:1', 'max:10'],
            'medications.*' => [
                'required',
                'integer',
                'exists:medications,id',
                'distinct',
                Rule::notIn([$medication->id]),
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'medications' => __('validation.attributes.medications'),
            'medications.*' => __('validation.attributes.medication_id'),
        ];
    }
}
