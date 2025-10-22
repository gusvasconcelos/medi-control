<?php

namespace App\Http\Requests\UserMedication;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserMedicationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'medication_id' => ['nullable', 'exists:medications,id', 'required_without_all:medication_name,medication_active_principle'],
            'medication_name' => ['nullable', 'string', 'max:255', 'required_without:medication_id'],
            'medication_active_principle' => ['nullable', 'string', 'max:255', 'required_with:medication_name'],
            'medication_manufacturer' => ['nullable', 'string', 'max:255'],
            'medication_category' => ['nullable', 'string', 'max:255'],
            'medication_strength' => ['nullable', 'string', 'max:255'],
            'medication_form' => ['nullable', Rule::in(['tablet', 'capsule', 'liquid', 'injection', 'cream', 'drops', 'spray', 'inhaler', 'patch', 'other'])],

            'dosage' => ['required', 'string', 'max:255'],
            'time_slots' => ['required', 'array', 'min:1'],
            'time_slots.*' => ['required', 'string', 'date_format:H:i'],
            'via_administration' => ['required', Rule::in(['oral', 'topical', 'injection', 'inhalation', 'sublingual', 'rectal', 'other'])],
            'duration' => ['nullable', 'integer', 'min:1'],
            'start_date' => ['required', 'date', 'date_format:Y-m-d'],
            'end_date' => ['nullable', 'date', 'date_format:Y-m-d', 'after:start_date'],
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
            'medication_name' => __('validation.attributes.medication_name'),
            'medication_active_principle' => __('validation.attributes.medication_active_principle'),
            'medication_manufacturer' => __('validation.attributes.medication_manufacturer'),
            'medication_category' => __('validation.attributes.category'),
            'medication_strength' => __('validation.attributes.medication_strength'),
            'medication_form' => __('validation.attributes.medication_form'),
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
        ];
    }
}
