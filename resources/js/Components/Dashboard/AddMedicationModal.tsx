import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { medicationService } from '@/services/medicationService';
import { useToast } from '@/hooks/useToast';
import { today, dateString } from '@/utils/dateUtils';
import type { MedicationSearchResult, ViaAdministration, CreateUserMedicationData } from '@/types';
import { ResponsiveModal } from '@/Components/Modal/ResponsiveModal';
import { StepIndicator } from './AddMedicationModal/StepIndicator';
import { MedicationSearchStep } from './AddMedicationModal/MedicationSearchStep';
import { MedicationConfigStep } from './AddMedicationModal/MedicationConfigStep';
import { StockManagementStep } from './AddMedicationModal/StockManagementStep';

interface AddMedicationModalProps {
    onSuccess: () => void;
}

interface FormErrors {
    dosage?: string;
    viaAdministration?: string;
    timeSlots?: string;
    startDate?: string;
    endDate?: string;
    initialStock?: string;
    currentStock?: string;
    lowStockThreshold?: string;
}

export function AddMedicationModal({ onSuccess }: AddMedicationModalProps) {
    const { showSuccess, showError } = useToast();
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [selectedMedication, setSelectedMedication] = useState<MedicationSearchResult | null>(
        null
    );
    const [formData, setFormData] = useState({
        dosage: '',
        viaAdministration: '' as ViaAdministration | '',
        timeSlots: ['08:00'],
        startDate: dateString(today()),
        endDate: '',
        notes: '',
        initialStock: 0,
        currentStock: 0,
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

        if (formData.currentStock < 0) {
            newErrors.currentStock = 'O estoque atual não pode ser negativo';
        }

        if (formData.lowStockThreshold < 0) {
            newErrors.lowStockThreshold = 'O estoque mínimo não pode ser negativo';
        }

        if (
            formData.currentStock > 0 &&
            formData.lowStockThreshold >= formData.currentStock
        ) {
            newErrors.lowStockThreshold = 'O estoque mínimo deve ser menor que o estoque atual';
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

    const handleSubmit = async () => {
        if (!validateStep3()) {
            return;
        }

        if (!selectedMedication) {
            showError('Medicamento não selecionado');
            return;
        }

        setIsSubmitting(true);

        try {
            const data: CreateUserMedicationData = {
                medication_id: selectedMedication.id,
                dosage: formData.dosage,
                time_slots: formData.timeSlots,
                via_administration: formData.viaAdministration as ViaAdministration,
                start_date: formData.startDate,
                end_date: formData.endDate || undefined,
                initial_stock: formData.initialStock,
                current_stock: formData.currentStock,
                low_stock_threshold: formData.lowStockThreshold,
                notes: formData.notes || undefined,
            };

            await medicationService.createUserMedication(data);
            showSuccess('Medicamento adicionado com sucesso!');
            closeModal();
            onSuccess();
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Erro ao adicionar medicamento';
            showError(errorMessage);

            const backendErrors = err.response?.data?.errors;
            if (backendErrors) {
                const mappedErrors: FormErrors = {};
                Object.keys(backendErrors).forEach((key) => {
                    mappedErrors[key as keyof FormErrors] = backendErrors[key][0];
                });
                setErrors(mappedErrors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        const modal = document.getElementById('add-medication-modal') as any;
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
                notes: '',
                initialStock: 0,
                currentStock: 0,
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
            id="add-medication-modal"
            title="Adicionar Medicamento"
            onClose={closeModal}
            footer={modalFooter}
            dynamicHeight={currentStep === 1}
            expandedContent={isDropdownOpen}
        >
            <StepIndicator currentStep={currentStep} steps={steps} />

            {currentStep === 1 && (
                <MedicationSearchStep
                    selectedMedication={selectedMedication}
                    onSelectMedication={setSelectedMedication}
                    onDropdownStateChange={setIsDropdownOpen}
                />
            )}

            {currentStep === 2 && (
                <MedicationConfigStep
                    dosage={formData.dosage}
                    viaAdministration={formData.viaAdministration}
                    timeSlots={formData.timeSlots}
                    startDate={formData.startDate}
                    endDate={formData.endDate}
                    notes={formData.notes}
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
