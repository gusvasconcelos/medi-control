<?php

namespace App\Http\Requests\UserMedication;

use Carbon\Carbon;
use Illuminate\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class AdherenceReportRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'start_date' => ['required', 'date_format:Y-m-d'],
            'end_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
        ];
    }

    public function attributes(): array
    {
        return [
            'start_date' => __('validation.attributes.start_date'),
            'end_date' => __('validation.attributes.end_date'),
        ];
    }

    protected function after(): array
    {
        $startDate = Carbon::parse($this->input('start_date'));

        $endDate = Carbon::parse($this->input('end_date'));

        return [
            function (Validator $validator) use ($startDate, $endDate) {
                if ($startDate->diffInDays($endDate) > 90) {
                    $validator->errors()->add(
                        'start_date',
                        __('validation.custom.date_range.exceeded_max_days', ['days' => 90])
                    );
                }
            },
        ];
    }
}
