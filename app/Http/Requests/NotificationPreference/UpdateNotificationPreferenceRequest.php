<?php

namespace App\Http\Requests\NotificationPreference;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNotificationPreferenceRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'medication_reminder' => ['sometimes', 'boolean'],
            'low_stock_alert' => ['sometimes', 'boolean'],
            'interaction_alert' => ['sometimes', 'boolean'],
            'push_enabled' => ['sometimes', 'boolean'],
            'whatsapp_enabled' => ['sometimes', 'boolean'],
            'quiet_hours_start' => ['nullable', 'date_format:H:i'],
            'quiet_hours_end' => ['nullable', 'date_format:H:i'],
        ];
    }
}
