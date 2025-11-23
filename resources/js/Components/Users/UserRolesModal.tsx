import { useState, useEffect, useMemo } from 'react';
import { Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { ResponsiveModal } from '@/Components/Modal/ResponsiveModal';
import { roleService } from '@/services/roleService';
import { userService } from '@/services/userService';
import { useToast } from '@/hooks/useToast';
import type { User } from '@/types';
import type { Role } from '@/types/permissions';

interface UserRolesModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export function UserRolesModal({
    isOpen,
    user,
    onClose,
    onSuccess,
}: UserRolesModalProps) {
    const { showSuccess, showError } = useToast();
    const [allRoles, setAllRoles] = useState<Role[]>([]);
    const [originalUserRoleIds, setOriginalUserRoleIds] = useState<number[]>([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchLeft, setSearchLeft] = useState('');
    const [searchRight, setSearchRight] = useState('');

    useEffect(() => {
        if (isOpen && user) {
            loadRoles();
            const modal = document.getElementById(
                'user-roles-modal'
            ) as HTMLElement & { showPopover?: () => void };
            if (modal?.showPopover) {
                modal.showPopover();
            }
        }
    }, [isOpen, user]);

    const loadRoles = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const allRolesResponse = await roleService.getRoles({ all: true });
            const roles = Array.isArray(allRolesResponse)
                ? allRolesResponse
                : (allRolesResponse?.data || []);
            setAllRoles(roles);

            const userData = await userService.getUser(user.id);
            const userRoleIds = (userData?.roles || []).map((r) => r.id);
            setOriginalUserRoleIds(userRoleIds);
            setSelectedRoleIds(userRoleIds);
        } catch (error) {
            showError('Erro ao carregar cargos');
            setAllRoles([]);
            setOriginalUserRoleIds([]);
            setSelectedRoleIds([]);
        } finally {
            setIsLoading(false);
        }
    };

    const availableRoles = useMemo(() => {
        return allRoles.filter((role) => !selectedRoleIds.includes(role.id));
    }, [allRoles, selectedRoleIds]);

    const userRoles = useMemo(() => {
        return allRoles.filter((role) => selectedRoleIds.includes(role.id));
    }, [allRoles, selectedRoleIds]);

    const filteredAvailableRoles = useMemo(() => {
        return availableRoles.filter(
            (role) =>
                role.name.toLowerCase().includes(searchLeft.toLowerCase()) ||
                (role.display_name?.toLowerCase().includes(searchLeft.toLowerCase())) ||
                role.id.toString().includes(searchLeft)
        );
    }, [availableRoles, searchLeft]);

    const filteredUserRoles = useMemo(() => {
        return userRoles.filter(
            (role) =>
                role.name.toLowerCase().includes(searchRight.toLowerCase()) ||
                (role.display_name?.toLowerCase().includes(searchRight.toLowerCase())) ||
                role.id.toString().includes(searchRight)
        );
    }, [userRoles, searchRight]);

    const hasChanges = useMemo(() => {
        if (originalUserRoleIds.length !== selectedRoleIds.length) return true;
        const sortedOriginal = [...originalUserRoleIds].sort();
        const sortedSelected = [...selectedRoleIds].sort();
        return !sortedOriginal.every((id, index) => id === sortedSelected[index]);
    }, [originalUserRoleIds, selectedRoleIds]);

    const handleAddRole = (role: Role) => {
        setSelectedRoleIds((prev) => [...prev, role.id]);
    };

    const handleRemoveRole = (role: Role) => {
        setSelectedRoleIds((prev) => prev.filter((id) => id !== role.id));
    };

    const handleSave = async () => {
        if (!user || !hasChanges) return;

        setIsSubmitting(true);
        try {
            await userService.updateUserRoles(user.id, selectedRoleIds);
            showSuccess('Cargos atualizados com sucesso');
            setOriginalUserRoleIds(selectedRoleIds);
            onSuccess?.();
            onClose();
        } catch (error) {
            showError('Erro ao atualizar cargos');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedRoleIds(originalUserRoleIds);
        setSearchLeft('');
        setSearchRight('');
        onClose();
    };

    if (!isOpen || !user) return null;

    const footer = (
        <div className="flex justify-end gap-2">
            <button
                type="button"
                className="btn btn-ghost"
                onClick={handleClose}
                disabled={isSubmitting}
            >
                Cancelar
            </button>
            <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={isSubmitting || !hasChanges}
            >
                {isSubmitting ? (
                    <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Salvando...
                    </>
                ) : (
                    'Vincular'
                )}
            </button>
        </div>
    );

    return (
        <ResponsiveModal
            id="user-roles-modal"
            title={`Gerenciar Cargos - ${user.name}`}
            onClose={handleClose}
            footer={footer}
            dynamicHeight
            expandedContent
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Coluna Esquerda: Cargos que não possui */}
                    <div className="bg-base-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-base-content/60 mb-3">
                            Cargos disponíveis
                        </h3>
                        <div className="mb-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                                <input
                                    type="text"
                                    className="input input-bordered input-sm w-full pl-9 text-xs bg-base-100"
                                    placeholder="Buscar cargo..."
                                    value={searchLeft}
                                    onChange={(e) => setSearchLeft(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <span className="loading loading-spinner loading-sm"></span>
                                </div>
                            ) : filteredAvailableRoles.length > 0 ? (
                                filteredAvailableRoles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="flex items-center justify-between p-2 bg-base-100 rounded hover:bg-base-300 transition-colors cursor-pointer group"
                                        onClick={() => handleAddRole(role)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleAddRole(role);
                                            }
                                        }}
                                    >
                                        <span className="text-xs">
                                            {role.display_name || role.name}
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-xs text-base-content/40">
                                    Nenhum cargo disponível
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Coluna Direita: Cargos que possui */}
                    <div className="bg-base-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-base-content/60 mb-3">
                            Cargos do usuário
                        </h3>
                        <div className="mb-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                                <input
                                    type="text"
                                    className="input input-bordered input-sm w-full pl-9 text-xs bg-base-100"
                                    placeholder="Buscar cargo..."
                                    value={searchRight}
                                    onChange={(e) => setSearchRight(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <span className="loading loading-spinner loading-sm"></span>
                                </div>
                            ) : filteredUserRoles.length > 0 ? (
                                filteredUserRoles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="flex items-center justify-between p-2 bg-base-100 rounded hover:bg-base-300 transition-colors cursor-pointer group"
                                        onClick={() => handleRemoveRole(role)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleRemoveRole(role);
                                            }
                                        }}
                                    >
                                        <ArrowLeft className="h-4 w-4 text-error opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-xs">
                                            {role.display_name || role.name}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-xs text-base-content/40">
                                    Nenhum cargo atribuído
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {hasChanges && (
                    <div className="text-xs text-warning text-center">
                        Você tem alterações não salvas
                    </div>
                )}
            </div>
        </ResponsiveModal>
    );
}
