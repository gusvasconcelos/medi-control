import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { RoleSelectionModal } from '@/Components/Auth/RoleSelectionModal';
import { useToast } from '@/hooks/useToast';
import type { PageProps } from '@/types';

export default function SelectRole({ auth }: PageProps) {
    const { showError, showSuccess } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // If not authenticated, redirect to login
    if (!auth?.user) {
        router.visit('/login');
        return null;
    }

    // If user already has a role (patient or caregiver), redirect to dashboard
    const userRoles = auth.user.roles?.map(r => r.name) || [];
    if (userRoles.includes('patient') || userRoles.includes('caregiver')) {
        router.visit('/dashboard');
        return null;
    }

    const handleRoleSelect = async (role: 'patient' | 'caregiver') => {
        setIsLoading(true);

        try {
            await axios.post('/api/v1/users/me/select-role', { role });
            showSuccess('Perfil configurado com sucesso!');
            router.visit('/dashboard');
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                showError(error.response.data.message || 'Erro ao configurar perfil.');
            } else {
                showError('Erro ao configurar perfil. Tente novamente.');
            }
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head title="Selecionar Perfil" />
            <RoleSelectionModal onSelect={handleRoleSelect} isLoading={isLoading} />
        </>
    );
}
