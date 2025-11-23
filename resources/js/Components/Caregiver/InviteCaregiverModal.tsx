import { useState, useEffect } from 'react';
import { ResponsiveModal } from '@/Components/Modal/ResponsiveModal';
import { caregiverPatientService } from '@/services/caregiverPatientService';
import { useToast } from '@/hooks/useToast';
import type { Permission } from '@/types/permissions';

interface InviteCaregiverModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function InviteCaregiverModal({ isOpen, onClose, onSuccess }: InviteCaregiverModalProps) {
    const { showSuccess, showError } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        permissions: [] as number[],
    });

    useEffect(() => {
        if (isOpen) {
            loadPermissions();
            setFormData({
                email: '',
                permissions: [],
            });
            const modal = document.getElementById('invite-caregiver-modal') as HTMLElement & { showPopover?: () => void };
            if (modal?.showPopover) {
                modal.showPopover();
            }
        } else {
            const modal = document.getElementById('invite-caregiver-modal') as HTMLElement & { hidePopover?: () => void };
            if (modal?.hidePopover) {
                modal.hidePopover();
            }
        }
    }, [isOpen]);

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
        setIsSubmitting(true);

        try {
            await caregiverPatientService.inviteCaregiver({
                email: formData.email,
                permissions: formData.permissions,
            });
            showSuccess('Convite enviado com sucesso');
            onSuccess();
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Erro ao enviar convite';
            showError(message);
            console.error('Error inviting caregiver:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePermissionToggle = (permissionId: number) => {
        setFormData((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permissionId)
                ? prev.permissions.filter((id) => id !== permissionId)
                : [...prev.permissions, permissionId],
        }));
    };


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
                form="invite-caregiver-form"
                className="btn btn-primary"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <span className="loading loading-spinner"></span>
                        Enviando...
                    </>
                ) : (
                    'Enviar Convite'
                )}
            </button>
        </div>
    );

    return (
        <ResponsiveModal
            id="invite-caregiver-modal"
            title="Convidar Cuidador"
            onClose={onClose}
            footer={modalFooter}
        >
            <form id="invite-caregiver-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="block mb-2">
                        <span className="text-sm font-medium">
                            Email do Cuidador <span className="text-error">*</span>
                        </span>
                    </label>
                    <input
                        type="email"
                        className="input input-bordered w-full"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        placeholder="email@exemplo.com"
                    />
                    <label className="block mt-1">
                        <span className="text-xs text-base-content/60">
                            O cuidador receberá um email com o convite
                        </span>
                    </label>
                </div>

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
                                            checked={formData.permissions.includes(permission.id)}
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
