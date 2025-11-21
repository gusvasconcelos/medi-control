<?php

namespace App\Http\Requests\MedicationLog;

use Illuminate\Foundation\Http\FormRequest;

class LogMedicationTakenRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'taken_at' => ['nullable', 'date_format:H:i'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'taken_at.date' => __('validation.date', ['attribute' => 'taken_at']),
            'notes.max' => __('validation.max.string', ['attribute' => 'notes', 'max' => 1000]),
        ];
    }
}
