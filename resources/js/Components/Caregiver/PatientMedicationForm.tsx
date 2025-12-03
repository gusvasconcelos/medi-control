import { useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import { InputField } from '@/Components/Auth/InputField';
import type { Medication, ViaAdministration } from '@/types';
import type { PatientMedicationData, AddPatientMedicationData, UpdatePatientMedicationData } from '@/types/caregiver';

interface PatientMedicationFormProps {
    patientId: number;
    medication?: PatientMedicationData;
    availableMedications: Medication[];
    onSubmit: (data: AddPatientMedicationData | UpdatePatientMedicationData) => void;
    isEditing?: boolean;
}

const viaAdministrationOptions: { value: ViaAdministration; label: string }[] = [
    { value: 'oral', label: 'Oral' },
    { value: 'topical', label: 'Tópico' },
    { value: 'injection', label: 'Injeção' },
    { value: 'inhalation', label: 'Inalação' },
    { value: 'sublingual', label: 'Sublingual' },
    { value: 'rectal', label: 'Retal' },
    { value: 'other', label: 'Outro' },
];

export function PatientMedicationForm({
    patientId,
    medication,
    availableMedications,
    onSubmit,
    isEditing = false,
}: PatientMedicationFormProps) {
    const [timeSlots, setTimeSlots] = useState<string[]>(
        medication?.time_slots || ['08:00']
    );
    const [newTimeSlot, setNewTimeSlot] = useState('');

    const { data, setData, processing, errors } = useForm({
        medication_id: medication?.medication_id || 0,
        dosage: medication?.dosage || '',
        time_slots: medication?.time_slots || ['08:00'],
        via_administration: (medication?.via_administration as ViaAdministration) || 'oral',
        start_date: medication?.start_date || new Date().toISOString().split('T')[0],
        end_date: medication?.end_date || '',
        initial_stock: medication?.initial_stock || 0,
        current_stock: medication?.current_stock || 0,
        low_stock_threshold: medication?.low_stock_threshold || 10,
    });

    const handleAddTimeSlot = () => {
        if (newTimeSlot && !timeSlots.includes(newTimeSlot)) {
            const updatedSlots = [...timeSlots, newTimeSlot].sort();
            setTimeSlots(updatedSlots);
            setData('time_slots', updatedSlots);
            setNewTimeSlot('');
        }
    };

    const handleRemoveTimeSlot = (slot: string) => {
        const updatedSlots = timeSlots.filter((s) => s !== slot);
        setTimeSlots(updatedSlots);
        setData('time_slots', updatedSlots);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        onSubmit(data as AddPatientMedicationData | UpdatePatientMedicationData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card bg-base-200">
                <div className="card-body">
                    <h3 className="text-lg font-semibold mb-4">
                        Informações do Medicamento
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="label">
                                <span className="label-text">Medicamento *</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={data.medication_id}
                                onChange={(e) =>
                                    setData('medication_id', Number(e.target.value))
                                }
                                required
                            >
                                <option value={0} disabled>
                                    Selecione um medicamento
                                </option>
                                {availableMedications.map((med) => (
                                    <option key={med.id} value={med.id}>
                                        {med.name}
                                        {med.strength && ` - ${med.strength}`}
                                        {med.form && ` (${med.form})`}
                                    </option>
                                ))}
                            </select>
                            {errors.medication_id && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.medication_id}
                                    </span>
                                </label>
                            )}
                        </div>

                        <InputField
                            label="Dosagem *"
                            type="text"
                            value={data.dosage}
                            onChange={(e) => setData('dosage', e.target.value)}
                            error={errors.dosage}
                            placeholder="Ex: 500mg"
                            required
                        />

                        <div>
                            <label className="label">
                                <span className="label-text">Via de Administração *</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                value={data.via_administration}
                                onChange={(e) =>
                                    setData('via_administration', e.target.value as ViaAdministration)
                                }
                                required
                            >
                                {viaAdministrationOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.via_administration && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.via_administration}
                                    </span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="divider"></div>

                    <h4 className="font-semibold mb-2">Horários de Administração</h4>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="time"
                            className="input input-bordered flex-1"
                            value={newTimeSlot}
                            onChange={(e) => setNewTimeSlot(e.target.value)}
                        />
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleAddTimeSlot}
                            disabled={!newTimeSlot}
                        >
                            <Plus className="w-4 h-4" />
                            Adicionar
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {timeSlots.map((slot) => (
                            <div key={slot} className="badge badge-lg gap-2">
                                {slot}
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-xs"
                                    onClick={() => handleRemoveTimeSlot(slot)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                    {errors.time_slots && (
                        <label className="label">
                            <span className="label-text-alt text-error">
                                {errors.time_slots}
                            </span>
                        </label>
                    )}
                </div>
            </div>

            <div className="card bg-base-200">
                <div className="card-body">
                    <h3 className="text-lg font-semibold mb-4">Período e Estoque</h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <InputField
                            label="Data de Início *"
                            type="date"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                            error={errors.start_date}
                            required
                        />

                        <InputField
                            label="Data de Término"
                            type="date"
                            value={data.end_date}
                            onChange={(e) => setData('end_date', e.target.value)}
                            error={errors.end_date}
                            placeholder="Deixe vazio para uso contínuo"
                        />

                        <InputField
                            label="Estoque Inicial *"
                            type="number"
                            value={data.initial_stock}
                            onChange={(e) => setData('initial_stock', Number(e.target.value))}
                            error={errors.initial_stock}
                            min={0}
                            required
                        />

                        {isEditing && (
                            <InputField
                                label="Estoque Atual *"
                                type="number"
                                value={data.current_stock}
                                onChange={(e) => setData('current_stock', Number(e.target.value))}
                                error={errors.current_stock}
                                min={0}
                                required
                            />
                        )}

                        <InputField
                            label="Limite de Estoque Baixo *"
                            type="number"
                            value={data.low_stock_threshold}
                            onChange={(e) => setData('low_stock_threshold', Number(e.target.value))}
                            error={errors.low_stock_threshold}
                            min={0}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-3 justify-end">
                <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => window.history.back()}
                    disabled={processing}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={processing || timeSlots.length === 0}
                >
                    {processing ? (
                        <span className="loading loading-spinner"></span>
                    ) : isEditing ? (
                        'Atualizar Medicamento'
                    ) : (
                        'Adicionar Medicamento'
                    )}
                </button>
            </div>
        </form>
    );
}
