import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { User as UserIcon, Mail, Phone, Shield, Camera } from 'lucide-react';

import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { getNavigationItems } from '@/config/navigation';
import { useToast } from '@/hooks/useToast';
import { userService } from '@/services/userService';
import { fileService } from '@/services/fileService';
import type { PageProps } from '@/types';

interface UpdateProfileData {
    name: string;
    email: string;
    phone?: string;
    profile_photo_path?: string;
}

export default function ProfileIndex({ auth }: PageProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const { showSuccess, showError } = useToast();

    const [profileData, setProfileData] = useState<UpdateProfileData>({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        profile_photo_path: user?.profile_photo_path || '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | undefined>(
        user?.profile_photo_url
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handlePhotoSelect = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?.id) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showError('Por favor, selecione uma imagem válida');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            showError('A imagem deve ter no máximo 5MB');
            return;
        }

        setIsUploadingPhoto(true);
        try {
            // Upload file
            const uploadResponse = await fileService.uploadUserFile(user.id, file, 'public');

            console.log('Upload response:', uploadResponse);

            // Update profile with new photo path
            const updatedUser = await userService.updateProfile({
                name: profileData.name,
                email: profileData.email,
                phone: profileData.phone,
                profile_photo_path: uploadResponse.data.path,
            });

            console.log('Updated user:', updatedUser);

            // Update local state
            setProfileData((prev) => ({
                ...prev,
                profile_photo_path: updatedUser.profile_photo_path,
            }));

            showSuccess('Foto de perfil atualizada com sucesso');

            // Reload page to update auth context and photo preview
            setTimeout(() => {
                router.reload();
            }, 500);
        } catch (error) {
            showError('Erro ao atualizar foto de perfil');
            console.error('Photo upload error:', error);
        } finally {
            setIsUploadingPhoto(false);
        }
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
                                {/* Profile Photo Section */}
                                <div className="flex flex-col items-center gap-4 pb-6">
                                    <div className="relative">
                                        <div className="avatar">
                                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                {photoPreview ? (
                                                    <img
                                                        src={photoPreview}
                                                        alt={user?.name}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="bg-primary text-primary-content flex items-center justify-center w-full h-full">
                                                        <span className="text-4xl sm:text-5xl">
                                                            {user?.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handlePhotoSelect}
                                            disabled={isUploadingPhoto}
                                            className="btn btn-circle btn-sm btn-primary absolute bottom-0 right-0 shadow-lg"
                                            aria-label="Alterar foto"
                                        >
                                            {isUploadingPhoto ? (
                                                <span className="loading loading-spinner loading-xs" />
                                            ) : (
                                                <Camera className="w-4 h-4" />
                                            )}
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-base-content/60">
                                            Clique no botão para escolher uma foto da galeria ou tirar uma nova
                                        </p>
                                        <p className="text-xs text-base-content/40 mt-1">
                                            PNG, JPG ou JPEG (máx. 5MB)
                                        </p>
                                    </div>
                                </div>

                                <div className="divider" />

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
