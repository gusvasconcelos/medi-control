<?php

namespace App\Http\Requests\UserMedication;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserMedicationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'dosage' => ['sometimes', 'string', 'max:255'],
            'time_slots' => ['sometimes', 'array', 'min:1'],
            'time_slots.*' => ['required', 'string', 'date_format:H:i'],
            'via_administration' => ['sometimes', Rule::in(['oral', 'topical', 'injection', 'inhalation', 'sublingual', 'rectal', 'other'])],
            'duration' => ['nullable', 'integer', 'min:1'],
            'start_date' => ['sometimes', 'date', 'date_format:Y-m-d'],
            'end_date' => ['nullable', 'date', 'date_format:Y-m-d', 'after:start_date'],
            'initial_stock' => ['sometimes', 'integer', 'min:0'],
            'current_stock' => ['sometimes', 'integer', 'min:0'],
            'low_stock_threshold' => ['sometimes', 'integer', 'min:0'],
            'notes' => ['nullable', 'string'],
            'active' => ['sometimes', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'dosage' => __('validation.attributes.dosage'),
            'time_slots' => __('validation.attributes.time_slots'),
            'via_administration' => __('validation.attributes.via_administration'),
            'duration' => __('validation.attributes.duration'),
            'start_date' => __('validation.attributes.start_date'),
            'end_date' => __('validation.attributes.end_date'),
            'initial_stock' => __('validation.attributes.initial_stock'),
            'current_stock' => __('validation.attributes.current_stock'),
            'low_stock_threshold' => __('validation.attributes.low_stock_threshold'),
            'notes' => __('validation.attributes.notes'),
            'active' => __('validation.attributes.active'),
        ];
    }
}
