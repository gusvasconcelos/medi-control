<?php

namespace App\Http\Requests\Medication;

use Illuminate\Foundation\Http\FormRequest;

class ImportMedicationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'mimes:csv,xls,xlsx',
                'max:10240', // 10MB max
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'file' => __('validation.attributes.file'),
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Por favor, selecione um arquivo',
            'file.file' => 'O arquivo selecionado é inválido',
            'file.mimes' => 'O arquivo deve ser do tipo: CSV, XLS ou XLSX',
            'file.max' => 'O arquivo não pode exceder 10MB',
        ];
    }
}
