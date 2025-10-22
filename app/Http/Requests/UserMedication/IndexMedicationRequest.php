<?php

namespace App\Http\Requests\UserMedication;

use Illuminate\Foundation\Http\FormRequest;

class IndexMedicationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:start_date'],
        ];
    }

    public function attributes(): array
    {
        return [
            'start_date' => __('validation.attributes.start_date'),
            'end_date' => __('validation.attributes.end_date'),
        ];
    }
}
