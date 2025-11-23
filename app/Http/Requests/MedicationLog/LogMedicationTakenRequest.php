<?php

namespace App\Http\Requests\MedicationLog;

use Illuminate\Foundation\Http\FormRequest;

class LogMedicationTakenRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'taken_at' => ['nullable', 'date_format:Y-m-d H:i:s'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'taken_at.date_format' => __('validation.date_format', ['attribute' => 'taken_at', 'format' => 'Y-m-d H:i:s']),
            'notes.max' => __('validation.max.string', ['attribute' => 'notes', 'max' => 1000]),
        ];
    }
}
