import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { permissionService } from '@/services/permissionService';
import { useToast } from '@/hooks/useToast';
import type { Permission } from '@/types/permissions';

interface PermissionFormModalProps {
    isOpen: boolean;
    permission?: Permission | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function PermissionFormModal({
    isOpen,
    permission,
    onClose,
    onSuccess,
}: PermissionFormModalProps) {
    const { showSuccess, showError } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        display_name: '',
        description: '',
        group: '',
    });

    useEffect(() => {
        if (isOpen) {
            if (permission) {
                setFormData({
                    name: permission.name,
                    display_name: permission.display_name,
                    description: permission.description || '',
                    group: permission.group || '',
                });
            } else {
                setFormData({
                    name: '',
                    display_name: '',
                    description: '',
                    group: '',
                });
            }
        }
    }, [isOpen, permission]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (permission) {
                await permissionService.updatePermission(permission.id, formData);
                showSuccess('Permissão atualizada com sucesso');
            } else {
                await permissionService.createPermission(formData);
                showSuccess('Permissão criada com sucesso');
            }
            onSuccess();
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Erro ao salvar permissão';
            showError(message);
            console.error('Error saving permission:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">
                        {permission ? 'Editar Permissão' : 'Nova Permissão'}
                    </h3>
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Nome (slug) *</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            required
                            placeholder="ex: users.create, medications.edit"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Nome de Exibição *</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            value={formData.display_name}
                            onChange={(e) =>
                                setFormData({ ...formData, display_name: e.target.value })
                            }
                            required
                            placeholder="ex: Criar Usuário, Editar Medicamento"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Grupo</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            value={formData.group}
                            onChange={(e) =>
                                setFormData({ ...formData, group: e.target.value })
                            }
                            placeholder="ex: Usuários, Medicamentos"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Descrição</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            rows={3}
                            placeholder="Descrição da permissão..."
                        />
                    </div>

                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Salvando...
                                </>
                            ) : (
                                'Salvar'
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose} />
        </div>
    );
}

