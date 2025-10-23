<?php

namespace App\Http\Requests\MedicationLog;

use Illuminate\Foundation\Http\FormRequest;

class LogMedicationTakenRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'time_slot' => ['required', 'string', 'regex:/^([01]\d|2[0-3]):([0-5]\d)$/'],
            'taken_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'time_slot.required' => __('validation.required', ['attribute' => 'time_slot']),
            'time_slot.regex' => __('validation.medication_log.time_slot_format'),
            'taken_at.date' => __('validation.date', ['attribute' => 'taken_at']),
            'notes.max' => __('validation.max.string', ['attribute' => 'notes', 'max' => 1000]),
        ];
    }
}
