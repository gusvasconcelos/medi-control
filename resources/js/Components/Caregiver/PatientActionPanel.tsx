import { router } from '@inertiajs/react';
import {
    Pill,
    Calendar,
    User,
    Plus,
    Eye,
    CheckCircle,
} from 'lucide-react';

import type { CaregiverActionPermissions } from '@/types/caregiver';

interface PatientActionPanelProps {
    patientId: number;
    patientName: string;
    availableActions: CaregiverActionPermissions;
}

interface ActionCard {
    title: string;
    description: string;
    icon: React.ReactNode;
    actions: ActionButton[];
}

interface ActionButton {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'accent';
    isAvailable: boolean;
}

export function PatientActionPanel({
    patientId,
    patientName,
    availableActions,
}: PatientActionPanelProps) {
    const actionCards: ActionCard[] = [
        {
            title: 'Medicamentos',
            description: 'Gerenciar medicamentos do paciente',
            icon: <Pill className="w-6 h-6" />,
            actions: [
                {
                    label: 'Ver Medicamentos',
                    icon: <Eye className="w-4 h-4" />,
                    onClick: () => {
                        router.visit(`/medications?patient_id=${patientId}`);
                    },
                    variant: 'primary',
                    isAvailable: availableActions.medications.canView,
                },
                {
                    label: 'Adicionar Medicamento',
                    icon: <Plus className="w-4 h-4" />,
                    onClick: () => {
                        router.visit(`/medications/create?patient_id=${patientId}`);
                    },
                    variant: 'secondary',
                    isAvailable: availableActions.medications.canCreate,
                },
            ],
        },
        {
            title: 'Adesão',
            description: 'Acompanhar e registrar adesão ao tratamento',
            icon: <Calendar className="w-6 h-6" />,
            actions: [
                {
                    label: 'Ver Relatório de Adesão',
                    icon: <Eye className="w-4 h-4" />,
                    onClick: () => {
                        router.visit(`/reports?patient_id=${patientId}`);
                    },
                    variant: 'primary',
                    isAvailable: availableActions.adherence.canView,
                },
                {
                    label: 'Marcar Medicamento',
                    icon: <CheckCircle className="w-4 h-4" />,
                    onClick: () => {
                        router.visit(`/medications?patient_id=${patientId}&action=mark`);
                    },
                    variant: 'accent',
                    isAvailable: availableActions.adherence.canMark,
                },
            ],
        },
        {
            title: 'Perfil',
            description: 'Visualizar informações do paciente',
            icon: <User className="w-6 h-6" />,
            actions: [
                {
                    label: 'Ver Perfil',
                    icon: <Eye className="w-4 h-4" />,
                    onClick: () => {
                        console.log('View profile for patient:', patientId);
                    },
                    variant: 'primary',
                    isAvailable: availableActions.profile.canView,
                },
            ],
        },
    ];

    const getButtonClasses = (variant?: 'primary' | 'secondary' | 'accent') => {
        switch (variant) {
            case 'primary':
                return 'btn-primary';
            case 'secondary':
                return 'btn-secondary';
            case 'accent':
                return 'btn-accent';
            default:
                return 'btn-primary';
        }
    };

    const hasAnyActions = actionCards.some((card) =>
        card.actions.some((action) => action.isAvailable)
    );

    if (!hasAnyActions) {
        return (
            <div className="rounded-lg bg-base-200 p-8 text-center">
                <p className="text-base-content/60">
                    Você não tem permissões para realizar ações para{' '}
                    <span className="font-medium">{patientName}</span>.
                </p>
                <p className="text-sm text-base-content/40 mt-2">
                    Entre em contato com o paciente para solicitar as
                    permissões necessárias.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {actionCards.map((card) => {
                const availableActionsInCard = card.actions.filter(
                    (action) => action.isAvailable
                );

                if (availableActionsInCard.length === 0) {
                    return null;
                }

                return (
                    <div
                        key={card.title}
                        className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    {card.icon}
                                </div>
                                <h2 className="card-title text-lg">
                                    {card.title}
                                </h2>
                            </div>
                            <p className="text-sm text-base-content/60 mb-4">
                                {card.description}
                            </p>
                            <div className="card-actions flex-col gap-2">
                                {availableActionsInCard.map((action) => (
                                    <button
                                        key={action.label}
                                        type="button"
                                        className={`btn btn-sm w-full ${getButtonClasses(action.variant)}`}
                                        onClick={action.onClick}
                                    >
                                        {action.icon}
                                        <span>{action.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
