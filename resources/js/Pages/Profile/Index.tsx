import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { User as UserIcon, Mail, Phone, Shield } from 'lucide-react';

import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { getNavigationItems } from '@/config/navigation';
import { useToast } from '@/hooks/useToast';
import { userService } from '@/services/userService';
import type { PageProps } from '@/types';

interface UpdateProfileData {
    name: string;
    email: string;
    phone?: string;
}

export default function ProfileIndex({ auth }: PageProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const { showSuccess, showError } = useToast();

    const [profileData, setProfileData] = useState<UpdateProfileData>({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            await userService.updateProfile(profileData);
            showSuccess('Perfil atualizado com sucesso');
        } catch (error) {
            showError('Erro ao atualizar perfil');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof UpdateProfileData, value: string) => {
        setProfileData((prev) => ({ ...prev, [field]: value }));
    };

    const roleNames = userRoles.map((role) => role.name).join(', ');

    return (
        <>
            <Head title="Meu Perfil" />

            <AuthenticatedLayout navItems={getNavigationItems('/profile', userRoles)}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        <div className="mb-6 sm:mb-8">
                            <h1 className="mb-1 text-xl font-bold text-base-content sm:text-2xl md:text-3xl">
                                Meu Perfil
                            </h1>
                            <p className="text-xs sm:text-sm text-base-content/60">
                                Gerencie suas informações pessoais
                            </p>
                        </div>

                        <div className="card bg-base-200">
                            <div className="card-body">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text flex items-center gap-2">
                                                <UserIcon className="w-4 h-4" />
                                                Nome
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full"
                                            value={profileData.name}
                                            onChange={(e) =>
                                                handleInputChange('name', e.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            className="input input-bordered w-full"
                                            value={profileData.email}
                                            onChange={(e) =>
                                                handleInputChange('email', e.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                Telefone
                                            </span>
                                        </label>
                                        <input
                                            type="tel"
                                            className="input input-bordered w-full"
                                            value={profileData.phone}
                                            onChange={(e) =>
                                                handleInputChange('phone', e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                Função
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full"
                                            value={roleNames || 'Nenhuma'}
                                            disabled
                                        />
                                    </div>

                                    <div className="divider" />

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="loading loading-spinner loading-sm" />
                                                    Salvando...
                                                </>
                                            ) : (
                                                'Salvar Alterações'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
