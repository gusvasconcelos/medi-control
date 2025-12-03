import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/useToast';
import { today, dateString } from '@/utils/dateUtils';
import type { ViaAdministration, Medication } from '@/types';
import { ResponsiveModal } from '@/Components/Modal/ResponsiveModal';
import { StepIndicator } from '@/Components/Dashboard/AddMedicationModal/StepIndicator';
import { MedicationConfigStep } from '@/Components/Dashboard/AddMedicationModal/MedicationConfigStep';
import { StockManagementStep } from '@/Components/Dashboard/AddMedicationModal/StockManagementStep';

interface AddPatientMedicationModalProps {
    patientId: number;
    availableMedications: Medication[];
    onSuccess: () => void;
}

interface FormErrors {
    medication_id?: string;
    dosage?: string;
    viaAdministration?: string;
    timeSlots?: string;
    startDate?: string;
    endDate?: string;
    initialStock?: string;
    lowStockThreshold?: string;
}

export function AddPatientMedicationModal({
    patientId,
    availableMedications,
    onSuccess,
}: AddPatientMedicationModalProps) {
    const { showSuccess, showError } = useToast();
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
    const [formData, setFormData] = useState({
        dosage: '',
        viaAdministration: '' as ViaAdministration | '',
        timeSlots: ['08:00'],
        startDate: dateString(today()),
        endDate: '',
        initialStock: 0,
        lowStockThreshold: 5,
    });

    const steps = [
        { number: 1 as const, title: 'Buscar' },
        { number: 2 as const, title: 'Configuração' },
        { number: 3 as const, title: 'Estoque' },
    ];

    const updateFormData = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const validateStep1 = (): boolean => {
        if (!selectedMedication) {
            showError('Selecione um medicamento para continuar');
            return false;
        }
        return true;
    };

    const validateStep2 = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.dosage.trim()) {
            newErrors.dosage = 'A dosagem é obrigatória';
        }

        if (!formData.viaAdministration) {
            newErrors.viaAdministration = 'Selecione uma via de administração';
        }

        if (formData.timeSlots.length === 0 || formData.timeSlots.some((slot) => !slot)) {
            newErrors.timeSlots = 'Adicione pelo menos um horário válido';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'A data de início é obrigatória';
        }

        if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
            newErrors.endDate = 'A data de término deve ser maior ou igual à data de início';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = (): boolean => {
        const newErrors: FormErrors = {};

        if (formData.initialStock < 0) {
            newErrors.initialStock = 'O estoque inicial não pode ser negativo';
        }

        if (formData.lowStockThreshold < 0) {
            newErrors.lowStockThreshold = 'O estoque mínimo não pode ser negativo';
        }

        if (
            formData.initialStock > 0 &&
            formData.lowStockThreshold >= formData.initialStock
        ) {
            newErrors.lowStockThreshold = 'O estoque mínimo deve ser menor que o estoque inicial';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        let isValid = false;

        if (currentStep === 1) {
            isValid = validateStep1();
        } else if (currentStep === 2) {
            isValid = validateStep2();
        }

        if (isValid && currentStep < 3) {
            setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
            setErrors({});
        }
    };

    const handleSubmit = () => {
        if (!validateStep3()) {
            return;
        }

        if (!selectedMedication) {
            showError('Medicamento não selecionado');
            return;
        }

        setIsSubmitting(true);

        const data = {
            user_id: patientId,
            medication_id: selectedMedication.id,
            dosage: formData.dosage,
            time_slots: formData.timeSlots,
            via_administration: formData.viaAdministration as ViaAdministration,
            start_date: formData.startDate,
            end_date: formData.endDate || undefined,
            initial_stock: formData.initialStock,
            current_stock: formData.initialStock,
            low_stock_threshold: formData.lowStockThreshold,
        };

        axios.post('/api/v1/user-medications', data)
            .then(() => {
                showSuccess('Medicamento adicionado com sucesso!');
                closeModal();
                onSuccess();
            })
            .catch((error) => {
                const errors = error.response?.data?.errors || {};
                const firstError = Object.values(errors)[0];
                showError(typeof firstError === 'string' ? firstError : 'Erro ao adicionar medicamento');

                const mappedErrors: FormErrors = {};
                Object.keys(errors).forEach((key) => {
                    const value = errors[key];
                    mappedErrors[key as keyof FormErrors] = Array.isArray(value) ? value[0] : value;
                });
                setErrors(mappedErrors);
            })
            .finally(() => setIsSubmitting(false));
    };

    const closeModal = () => {
        const modal = document.getElementById('add-patient-medication-modal') as any;
        if (modal && modal.hidePopover) {
            modal.hidePopover();
        }
        setTimeout(() => {
            setCurrentStep(1);
            setSelectedMedication(null);
            setFormData({
                dosage: '',
                viaAdministration: '',
                timeSlots: ['08:00'],
                startDate: dateString(today()),
                endDate: '',
                initialStock: 0,
                lowStockThreshold: 5,
            });
            setErrors({});
        }, 300);
    };

    const modalFooter = (
        <div className="flex items-center justify-between gap-4">
            <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="btn btn-ghost gap-2"
            >
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
            </button>

            <div className="flex gap-2">
                {currentStep < 3 ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="btn btn-primary gap-2"
                    >
                        <span>Próximo</span>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="btn btn-primary gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner loading-sm" />
                                <span>Salvando...</span>
                            </>
                        ) : (
                            <>
                                <Check className="h-4 w-4" />
                                <span>Finalizar</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <ResponsiveModal
            id="add-patient-medication-modal"
            title="Adicionar Medicamento"
            onClose={closeModal}
            footer={modalFooter}
        >
            <StepIndicator currentStep={currentStep} steps={steps} />

            {currentStep === 1 && (
                <MedicationSelectionStep
                    availableMedications={availableMedications}
                    selectedMedication={selectedMedication}
                    onSelectMedication={setSelectedMedication}
                />
            )}

            {currentStep === 2 && (
                <MedicationConfigStep
                    dosage={formData.dosage}
                    viaAdministration={formData.viaAdministration}
                    timeSlots={formData.timeSlots}
                    startDate={formData.startDate}
                    endDate={formData.endDate}
                    errors={errors}
                    onChange={updateFormData}
                />
            )}

            {currentStep === 3 && (
                <StockManagementStep
                    initialStock={formData.initialStock}
                    lowStockThreshold={formData.lowStockThreshold}
                    errors={errors}
                    onChange={updateFormData}
                />
            )}
        </ResponsiveModal>
    );
}

interface MedicationSelectionStepProps {
    availableMedications: Medication[];
    selectedMedication: Medication | null;
    onSelectMedication: (medication: Medication) => void;
}

function MedicationSelectionStep({
    availableMedications,
    selectedMedication,
    onSelectMedication,
}: MedicationSelectionStepProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMedications = searchQuery.length >= 3
        ? availableMedications.filter((med) =>
            med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            med.active_principle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            med.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : availableMedications;

    const showSearchHint = searchQuery.length > 0 && searchQuery.length < 3;

    return (
        <div className="space-y-4">
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-medium">Buscar medicamento</span>
                </label>
                <input
                    type="text"
                    placeholder="Digite pelo menos 3 caracteres para buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input input-bordered w-full"
                    autoComplete="off"
                />
                {showSearchHint && (
                    <label className="label">
                        <span className="label-text-alt text-warning">
                            Digite pelo menos 3 caracteres para buscar
                        </span>
                    </label>
                )}
            </div>

            {selectedMedication && (
                <div className="mt-4">
                    <label className="label">
                        <span className="label-text font-medium">Medicamento selecionado</span>
                    </label>
                    <div className="card bg-primary/10 border-2 border-primary">
                        <div className="card-body p-4">
                            <h3 className="font-semibold text-base">
                                {selectedMedication.name}
                            </h3>
                            {selectedMedication.active_principle && (
                                <p className="text-sm text-base-content/70 mt-1">
                                    <span className="font-medium">Princípio ativo:</span>{' '}
                                    {selectedMedication.active_principle}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedMedication.manufacturer && (
                                    <span className="badge badge-outline badge-sm">
                                        {selectedMedication.manufacturer}
                                    </span>
                                )}
                                {selectedMedication.strength && (
                                    <span className="badge badge-outline badge-sm">
                                        {selectedMedication.strength}
                                    </span>
                                )}
                                {selectedMedication.form && (
                                    <span className="badge badge-outline badge-sm">
                                        {selectedMedication.form}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="divider">Medicamentos disponíveis</div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredMedications.length === 0 ? (
                    <p className="text-center text-base-content/60 py-8">
                        Nenhum medicamento encontrado
                    </p>
                ) : (
                    filteredMedications.map((medication) => (
                        <button
                            key={medication.id}
                            type="button"
                            onClick={() => onSelectMedication(medication)}
                            className={`
                                w-full text-left p-4 rounded-lg border-2 transition-all
                                ${selectedMedication?.id === medication.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-base-300 bg-base-100 hover:border-primary/50 hover:bg-base-200'
                                }
                            `}
                        >
                            <div className="font-medium text-sm">
                                {medication.name}
                            </div>
                            {medication.active_principle && (
                                <div className="text-xs text-base-content/70 mt-1">
                                    {medication.active_principle}
                                </div>
                            )}
                            {(medication.manufacturer || medication.strength || medication.form) && (
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {medication.manufacturer && (
                                        <span className="text-xs text-base-content/60">
                                            {medication.manufacturer}
                                        </span>
                                    )}
                                    {medication.strength && (
                                        <span className="text-xs text-base-content/60">
                                            {medication.strength}
                                        </span>
                                    )}
                                    {medication.form && (
                                        <span className="text-xs text-base-content/60">
                                            {medication.form}
                                        </span>
                                    )}
                                </div>
                            )}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}

