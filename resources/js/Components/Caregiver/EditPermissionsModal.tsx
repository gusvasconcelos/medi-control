import { useState, useEffect } from 'react';
import { ResponsiveModal } from '@/Components/Modal/ResponsiveModal';
import { caregiverPatientService } from '@/services/caregiverPatientService';
import { useToast } from '@/hooks/useToast';
import type { Permission } from '@/types/permissions';
import type { CaregiverPatient } from '@/types/caregiver';

interface EditPermissionsModalProps {
    isOpen: boolean;
    relationship: CaregiverPatient | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditPermissionsModal({
    isOpen,
    relationship,
    onClose,
    onSuccess,
}: EditPermissionsModalProps) {
    const { showSuccess, showError } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

    useEffect(() => {
        if (isOpen && relationship) {
            loadPermissions();
            setSelectedPermissions(relationship.permissions?.map((p) => p.id) || []);
            const modal = document.getElementById('edit-permissions-modal') as HTMLElement & { showPopover?: () => void };
            if (modal?.showPopover) {
                modal.showPopover();
            }
        } else {
            const modal = document.getElementById('edit-permissions-modal') as HTMLElement & { hidePopover?: () => void };
            if (modal?.hidePopover) {
                modal.hidePopover();
            }
        }
    }, [isOpen, relationship]);

    const loadPermissions = async () => {
        setIsLoadingPermissions(true);
        try {
            const response = await caregiverPatientService.getCaregiverPermissions();
            setPermissions(response.data || []);
        } catch (error) {
            showError('Erro ao carregar permissões');
            console.error('Error loading permissions:', error);
        } finally {
            setIsLoadingPermissions(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!relationship) return;

        setIsSubmitting(true);

        try {
            await caregiverPatientService.updatePermissions(relationship.id, {
                permissions: selectedPermissions,
            });
            showSuccess('Permissões atualizadas com sucesso');
            onSuccess();
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Erro ao atualizar permissões';
            showError(message);
            console.error('Error updating permissions:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePermissionToggle = (permissionId: number) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    if (!isOpen || !relationship) return null;

    const modalFooter = (
        <div className="flex justify-end gap-2">
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
                form="edit-permissions-form"
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
    );

    return (
        <ResponsiveModal
            id="edit-permissions-modal"
            title="Editar Permissões"
            onClose={onClose}
            footer={modalFooter}
        >
            <div className="mb-4">
                <p className="text-sm text-base-content/60">
                    Cuidador: {relationship.caregiver?.name || 'Não identificado'}
                </p>
            </div>

            <form id="edit-permissions-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="block mb-2">
                        <span className="text-sm font-medium">Permissões de Acesso</span>
                    </label>
                    <p className="text-sm text-base-content/60 mb-2">
                        Selecione quais informações o cuidador poderá acessar
                    </p>
                    {isLoadingPermissions ? (
                        <div className="flex justify-center py-4">
                            <span className="loading loading-spinner"></span>
                        </div>
                    ) : permissions.length === 0 ? (
                        <div className="text-center py-4 text-base-content/60">
                            Nenhuma permissão de cuidador disponível
                        </div>
                    ) : (
                        <div className="border border-base-300 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                            {permissions.map((permission) => (
                                <label
                                    key={permission.id}
                                    className="flex flex-col gap-1 cursor-pointer hover:bg-base-200 p-2 rounded"
                                >
                                    <div className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm mt-0.5"
                                            checked={selectedPermissions.includes(permission.id)}
                                            onChange={() => handlePermissionToggle(permission.id)}
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">
                                                {permission.display_name}
                                            </div>
                                            {permission.description && (
                                                <div className="text-xs text-base-content/60 mt-1">
                                                    {permission.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </form>
        </ResponsiveModal>
    );
}
