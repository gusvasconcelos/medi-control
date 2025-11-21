<?php

namespace App\Http\Requests\UserMedication;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserMedicationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'medication_id' => ['required', 'exists:medications,id'],
            'dosage' => ['required', 'string', 'max:255'],
            'time_slots' => ['required', 'array', 'min:1'],
            'time_slots.*' => ['required', 'string', 'date_format:H:i'],
            'via_administration' => ['required', Rule::in(['oral', 'topical', 'injection', 'inhalation', 'sublingual', 'rectal', 'other'])],
            'start_date' => ['required', 'date', 'date_format:Y-m-d'],
            'end_date' => ['nullable', 'date', 'date_format:Y-m-d', 'after_or_equal:start_date'],
            'initial_stock' => ['required', 'integer', 'min:0'],
            'current_stock' => ['required', 'integer', 'min:0'],
            'low_stock_threshold' => ['required', 'integer', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'medication_id' => __('validation.attributes.medication_id'),
            'dosage' => __('validation.attributes.dosage'),
            'time_slots' => __('validation.attributes.time_slots'),
            'via_administration' => __('validation.attributes.via_administration'),
            'start_date' => __('validation.attributes.start_date'),
            'end_date' => __('validation.attributes.end_date'),
            'initial_stock' => __('validation.attributes.initial_stock'),
            'current_stock' => __('validation.attributes.current_stock'),
            'low_stock_threshold' => __('validation.attributes.low_stock_threshold'),
            'notes' => __('validation.attributes.notes'),
        ];
    }
}
