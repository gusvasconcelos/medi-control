import { useState, useEffect } from 'react';
import { ResponsiveModal } from '@/Components/Modal/ResponsiveModal';
import { roleService } from '@/services/roleService';
import { permissionService } from '@/services/permissionService';
import { useToast } from '@/hooks/useToast';
import type { Role, Permission, PermissionGroup } from '@/types/permissions';

interface RoleFormModalProps {
    isOpen: boolean;
    role?: Role | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function RoleFormModal({ isOpen, role, onClose, onSuccess }: RoleFormModalProps) {
    const { showSuccess, showError } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        display_name: '',
        description: '',
        permissions: [] as number[],
    });

    useEffect(() => {
        if (isOpen) {
            loadPermissions();
            if (role) {
                setFormData({
                    name: role.name,
                    display_name: role.display_name,
                    description: role.description || '',
                    permissions: role.permissions?.map((p) => p.id) || [],
                });
            } else {
                setFormData({
                    name: '',
                    display_name: '',
                    description: '',
                    permissions: [],
                });
            }
            const modal = document.getElementById(
                'role-form-modal'
            ) as HTMLElement & { showPopover?: () => void };
            if (modal?.showPopover) {
                modal.showPopover();
            }
        }
    }, [isOpen, role]);

    const loadPermissions = async () => {
        setIsLoadingPermissions(true);
        try {
            const groups = await permissionService.getGroupedPermissions();
            setPermissionGroups(groups);
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
            if (role) {
                await roleService.updateRole(role.id, formData);
                showSuccess('Role atualizada com sucesso');
            } else {
                await roleService.createRole(formData);
                showSuccess('Role criada com sucesso');
            }
            onSuccess();
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Erro ao salvar role';
            showError(message);
            console.error('Error saving role:', error);
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

    const handleGroupToggle = (groupPermissions: Permission[]) => {
        const groupIds = groupPermissions.map((p) => p.id);
        const allSelected = groupIds.every((id) => formData.permissions.includes(id));

        setFormData((prev) => ({
            ...prev,
            permissions: allSelected
                ? prev.permissions.filter((id) => !groupIds.includes(id))
                : [...new Set([...prev.permissions, ...groupIds])],
        }));
    };

    if (!isOpen) return null;

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(e);
    };

    const footer = (
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
                form="role-form"
                className="btn btn-primary"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <span className="loading loading-spinner loading-sm"></span>
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
            id="role-form-modal"
            title={role ? 'Editar Role' : 'Nova Role'}
            onClose={onClose}
            footer={footer}
            dynamicHeight
            expandedContent
        >
            <form id="role-form" onSubmit={handleFormSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Nome (slug) <span className="text-error text-base">*</span></span>
                    </label>
                    <input
                        type="text"
                        className="input input-bordered"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        placeholder="ex: admin, editor, viewer"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Nome de Exibição <span className="text-error text-base">*</span></span>
                    </label>
                    <input
                        type="text"
                        className="input input-bordered"
                        value={formData.display_name}
                        onChange={(e) =>
                            setFormData({ ...formData, display_name: e.target.value })
                        }
                        required
                        placeholder="ex: Administrador, Editor, Visualizador"
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
                        placeholder="Descrição da role..."
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Permissões</span>
                    </label>
                    {isLoadingPermissions ? (
                        <div className="flex justify-center py-4">
                            <span className="loading loading-spinner"></span>
                        </div>
                    ) : (
                        <div className="border border-base-300 rounded-lg p-4 max-h-96 overflow-y-auto space-y-4">
                            {permissionGroups.map((group) => (
                                <div key={group.group} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm"
                                            checked={group.permissions.every((p) =>
                                                formData.permissions.includes(p.id)
                                            )}
                                            onChange={() => handleGroupToggle(group.permissions)}
                                        />
                                        <span className="font-semibold text-sm">
                                            {group.group}
                                        </span>
                                    </div>
                                    <div className="ml-6 space-y-1">
                                        {group.permissions.map((permission) => (
                                            <label
                                                key={permission.id}
                                                className="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-1 rounded"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-sm"
                                                    checked={formData.permissions.includes(
                                                        permission.id
                                                    )}
                                                    onChange={() =>
                                                        handlePermissionToggle(permission.id)
                                                    }
                                                />
                                                <div className="flex-1">
                                                    <div className="text-sm">
                                                        {permission.display_name}
                                                    </div>
                                                    <div className="text-xs text-base-content/60">
                                                        {permission.name}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </form>
        </ResponsiveModal>
    );
}

