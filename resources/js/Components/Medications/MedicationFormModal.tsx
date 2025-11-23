import { useState, useEffect } from 'react';
import { ResponsiveModal } from '@/Components/Modal/ResponsiveModal';
import type { Medication } from '@/types';

interface MedicationFormModalProps {
    medication?: Medication | null;
    isOpen: boolean;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Medication, 'id'>) => Promise<void>;
}

export function MedicationFormModal({
    medication,
    isOpen,
    isSubmitting = false,
    onClose,
    onSubmit,
}: MedicationFormModalProps) {
    const [formData, setFormData] = useState<Omit<Medication, 'id'>>({
        name: '',
        active_principle: '',
        manufacturer: '',
        category: '',
        therapeutic_class: '',
        registration_number: '',
        strength: '',
        form: '',
        description: '',
        warnings: '',
        interactions: [],
    });

    useEffect(() => {
        if (medication) {
            setFormData({
                name: medication.name,
                active_principle: medication.active_principle || '',
                manufacturer: medication.manufacturer || '',
                category: medication.category || '',
                therapeutic_class: medication.therapeutic_class || '',
                registration_number: medication.registration_number || '',
                strength: medication.strength || '',
                form: medication.form || '',
                description: medication.description || '',
                warnings: medication.warnings || '',
                interactions: medication.interactions || [],
            });
        } else {
            setFormData({
                name: '',
                active_principle: '',
                manufacturer: '',
                category: '',
                therapeutic_class: '',
                registration_number: '',
                strength: '',
                form: '',
                description: '',
                warnings: '',
                interactions: [],
            });
        }
    }, [medication]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    useEffect(() => {
        if (isOpen) {
            const modal = document.getElementById(
                'medication-form-modal'
            ) as HTMLElement & { showPopover?: () => void };
            modal?.showPopover?.();
        }
    }, [isOpen]);

    const footer = (
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <button
                type="button"
                className="btn btn-ghost w-full sm:w-auto order-2 sm:order-1"
                onClick={onClose}
                disabled={isSubmitting}
            >
                Cancelar
            </button>
            <button
                type="submit"
                form="medication-form"
                className="btn btn-primary w-full sm:w-auto order-1 sm:order-2"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                ) : medication ? (
                    'Atualizar'
                ) : (
                    'Adicionar'
                )}
            </button>
        </div>
    );

    return (
        <ResponsiveModal
            id="medication-form-modal"
            title={medication ? 'Editar Medicamento' : 'Adicionar Medicamento'}
            onClose={onClose}
            footer={footer}
        >
            <form id="medication-form" onSubmit={handleSubmit}>
                <div className="mb-4 rounded-lg bg-base-200 p-3 text-xs sm:text-sm text-base-content/70">
                    <span className="text-error font-semibold">*</span> Campos obrigatórios
                </div>

                <div className="space-y-4">
                    {/* Nome e Princípio Ativo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label pb-1">
                                <span className="label-text text-sm font-medium">
                                    Nome <span className="text-error text-base">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="input input-bordered input-sm sm:input-md w-full"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label pb-1">
                                <span className="label-text text-sm font-medium">
                                    Princípio Ativo <span className="text-error text-base">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="active_principle"
                                className="input input-bordered input-sm sm:input-md w-full"
                                value={formData.active_principle || ''}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    {/* Fabricante e Categoria */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label pb-1">
                                <span className="label-text text-sm font-medium">
                                    Fabricante <span className="text-error text-base">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="manufacturer"
                                className="input input-bordered input-sm sm:input-md w-full"
                                value={formData.manufacturer || ''}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label pb-1">
                                <span className="label-text text-sm font-medium">
                                    Categoria <span className="text-error text-base">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="category"
                                className="input input-bordered input-sm sm:input-md w-full"
                                value={formData.category || ''}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    {/* Classe Terapêutica e Número de Registro */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label pb-1">
                                <span className="label-text text-sm font-medium">
                                    Classe Terapêutica
                                </span>
                            </label>
                            <input
                                type="text"
                                name="therapeutic_class"
                                className="input input-bordered input-sm sm:input-md w-full"
                                value={formData.therapeutic_class || ''}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label pb-1">
                                <span className="label-text text-sm font-medium">
                                    Número de Registro <span className="text-error text-base">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                name="registration_number"
                                className="input input-bordered input-sm sm:input-md w-full"
                                value={formData.registration_number || ''}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    {/* Forma e Dosagem */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label pb-1">
                                <span className="label-text text-sm font-medium">
                                    Forma <span className="text-error text-base">*</span>
                                </span>
                            </label>
                            <select
                                name="form"
                                className="select select-bordered select-sm sm:select-md w-full"
                                value={formData.form || ''}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            >
                                <option value="">Selecione a forma</option>
                                <option value="tablet">Comprimido</option>
                                <option value="capsule">Cápsula</option>
                                <option value="liquid">Líquido</option>
                                <option value="injection">Injeção</option>
                                <option value="cream">Pomada</option>
                                <option value="drops">Gotas</option>
                                <option value="spray">Spray</option>
                                <option value="inhaler">Inalador</option>
                                <option value="patch">Adesivo</option>
                                <option value="other">Outro</option>
                            </select>
                        </div>

                        <div className="form-control w-full">
                            <label className="label pb-1">
                                <span className="label-text text-sm font-medium">
                                    Dosagem
                                </span>
                            </label>
                            <input
                                type="text"
                                name="strength"
                                className="input input-bordered input-sm sm:input-md w-full"
                                value={formData.strength || ''}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                placeholder="Ex: 500mg, 10ml"
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="form-control w-full">
                        <label className="label pb-1">
                            <span className="label-text text-sm font-medium">
                                Descrição
                            </span>
                        </label>
                        <textarea
                            name="description"
                            className="textarea textarea-bordered h-20 text-sm w-full"
                            value={formData.description || ''}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Avisos */}
                    <div className="form-control w-full">
                        <label className="label pb-1">
                            <span className="label-text text-sm font-medium">
                                Avisos
                            </span>
                        </label>
                        <textarea
                            name="warnings"
                            className="textarea textarea-bordered h-20 text-sm w-full"
                            value={formData.warnings || ''}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            </form>
        </ResponsiveModal>
    );
}

