<?php

namespace App\Services;

use App\Models\Medication;
use App\Models\User;

class AddUserMedicationService
{
    public function __construct(
        private readonly UserMedicationService $userMedicationService
    ) {
    }

    /**
     * Busca medicamentos por nome usando UNACCENT para busca sem acentos
     *
     * @return array<int, array{id: int, name: string, active_principle: string, strength: string, form: string}>
     */
    public function searchMedications(string $searchTerm): array
    {
        if (strlen($searchTerm) < 2) {
            return [];
        }

        $medications = Medication::whereRaw(
            "LOWER(UNACCENT(name)) LIKE LOWER(UNACCENT(?))",
            ["%{$searchTerm}%"]
        )
            ->orWhereRaw(
                "LOWER(UNACCENT(active_principle)) LIKE LOWER(UNACCENT(?))",
                ["%{$searchTerm}%"]
            )
            ->limit(5)
            ->get(['id', 'name', 'active_principle', 'strength', 'form']);

        return $medications->map(function ($med) {
            return [
                'id' => $med->id,
                'name' => $med->name,
                'active_principle' => $med->active_principle ?? '',
                'strength' => $med->strength ?? '',
                'form' => $med->form ?? '',
            ];
        })->toArray();
    }

    /**
     * Adiciona medicamento ao usuário
     *
     * @param array{medication_id: int, dosage: string, time_slots: array<int, string>, via_administration: string, start_date: string, end_date?: string|null, initial_stock: int, current_stock: int, low_stock_threshold: int, notes?: string|null} $medicationData
     * @return array{success: bool, message: string, user_medication_id?: int, medication_name?: string}
     */
    public function addUserMedication(User $user, array $medicationData): array
    {
        try {
            // Verificar se medicamento existe
            $medication = Medication::find($medicationData['medication_id']);

            if (!$medication) {
                return [
                    'success' => false,
                    'message' => 'Medicamento não encontrado no banco de dados.',
                ];
            }

            // Verificar se usuário já tem esse medicamento ativo
            $existingMedication = $user->medications()
                ->where('medication_id', $medicationData['medication_id'])
                ->where('active', true)
                ->exists();

            if ($existingMedication) {
                return [
                    'success' => false,
                    'message' => "Você já possui o medicamento '{$medication->name}' ativo. Para alterar horários, use a funcionalidade de edição ou reorganização.",
                ];
            }

            // Criar UserMedication
            $userMedication = $this->userMedicationService->store(collect($medicationData));

            return [
                'success' => true,
                'message' => "Medicamento '{$medication->name}' adicionado com sucesso!",
                'user_medication_id' => $userMedication->id,
                'medication_name' => $medication->name,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao adicionar medicamento: ' . $e->getMessage(),
            ];
        }
    }
}
