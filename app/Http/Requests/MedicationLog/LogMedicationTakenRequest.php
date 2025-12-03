<?php

namespace App\Http\Requests\MedicationLog;

use Illuminate\Foundation\Http\FormRequest;

class LogMedicationTakenRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'taken_at' => ['nullable', 'date_format:Y-m-d H:i:s'],
        ];
    }

    public function attributes(): array
    {
        return [
            'user_id' => __('validation.attributes.user_id'),
            'taken_at' => __('validation.attributes.taken_at'),
        ];
    }
}
