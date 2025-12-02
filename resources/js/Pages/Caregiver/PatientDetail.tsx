import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Mail, Shield } from 'lucide-react';

import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { PatientActionPanel } from '@/Components/Caregiver/PatientActionPanel';
import { getNavigationItems } from '@/config/navigation';
import type { PageProps } from '@/types';
import type { PatientDetailData } from '@/types/caregiver';

interface PatientDetailProps extends PageProps, PatientDetailData {}

function formatDate(dateString: string | null): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

export default function PatientDetail({
    auth,
    patient,
    relationship,
    permissions,
    availableActions,
}: PatientDetailProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];

    const handleBackToPatients = () => {
        router.visit('/my-patients');
    };

    return (
        <>
            <Head title={`Paciente: ${patient.name}`} />

            <AuthenticatedLayout
                navItems={getNavigationItems('/my-patients', userRoles)}
            >
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        <div className="mb-6 sm:mb-8">
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm mb-4"
                                onClick={handleBackToPatients}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar para Pacientes
                            </button>

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex-1">
                                    <h1 className="mb-2 text-xl font-bold text-base-content sm:text-2xl md:text-3xl">
                                        {patient.name}
                                    </h1>
                                    <p className="text-xs sm:text-sm text-base-content/60">
                                        Gerenciar cuidados e acompanhar
                                        tratamento
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 mb-6">
                            <div className="card bg-base-200 shadow-sm">
                                <div className="card-body">
                                    <h2 className="card-title text-lg mb-4">
                                        Informações do Paciente
                                    </h2>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-base-content/60 mb-1">
                                                    Email
                                                </p>
                                                <p className="text-sm font-medium truncate">
                                                    {patient.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-success/10 text-success">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-base-content/60 mb-1">
                                                    Relacionamento Aceito em
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {formatDate(
                                                        relationship.accepted_at
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-accent/10 text-accent">
                                                <Shield className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-base-content/60 mb-1">
                                                    Permissões
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {permissions.length}{' '}
                                                    {permissions.length === 1
                                                        ? 'permissão'
                                                        : 'permissões'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {permissions.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-base-300">
                                            <p className="text-xs text-base-content/60 mb-2">
                                                Permissões concedidas:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {permissions.map(
                                                    (permission) => (
                                                        <span
                                                            key={permission.id}
                                                            className="badge badge-primary badge-sm"
                                                        >
                                                            {
                                                                permission.display_name
                                                            }
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-4">
                                Ações Disponíveis
                            </h2>
                            <PatientActionPanel
                                patientId={patient.id}
                                patientName={patient.name}
                                availableActions={availableActions}
                            />
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
