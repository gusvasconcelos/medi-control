import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Heart, Stethoscope, Check, ChevronRight } from 'lucide-react';

interface RoleOption {
    value: 'patient' | 'caregiver';
    title: string;
    description: string;
    icon: typeof Heart;
}

interface RoleSelectionModalProps {
    onSelect: (role: 'patient' | 'caregiver') => void;
    isLoading: boolean;
}

const roleOptions: RoleOption[] = [
    {
        value: 'patient',
        title: 'Paciente',
        description: 'Gerencie seus medicamentos, receba lembretes de horários, acompanhe seu histórico de tratamento e tenha controle total sobre sua saúde.',
        icon: Heart,
    },
    {
        value: 'caregiver',
        title: 'Cuidador',
        description: 'Monitore os tratamentos dos seus pacientes, gerencie múltiplos medicamentos, receba alertas importantes e acompanhe a adesão ao tratamento.',
        icon: Stethoscope,
    },
];

export function RoleSelectionModal({ onSelect, isLoading }: RoleSelectionModalProps) {
    const [selectedRole, setSelectedRole] = useState<'patient' | 'caregiver' | null>(null);

    const handleConfirm = () => {
        if (selectedRole) {
            onSelect(selectedRole);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-base-100">
            <div className="w-full max-w-2xl">
                <Link href="/">
                    <img
                        src="/storage/icon.svg"
                        alt="Logo do MediControl"
                        className="w-24 h-auto mb-8 mx-auto hover:opacity-80 transition-opacity"
                    />
                </Link>

                <h1 className="text-3xl font-bold mb-2 text-center">Bem-vindo ao MediControl</h1>
                <p className="text-base-content/70 mb-8 text-center">
                    Escolha como deseja usar a plataforma
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {roleOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = selectedRole === option.value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setSelectedRole(option.value)}
                                disabled={isLoading}
                                className={`
                                    card bg-base-200 shadow-xl text-left transition-all duration-200
                                    hover:shadow-2xl hover:scale-[1.02]
                                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}
                                `}
                            >
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`
                                                p-3 rounded-full
                                                ${isSelected ? 'bg-primary text-primary-content' : 'bg-base-300'}
                                            `}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <h2 className="card-title text-xl">{option.title}</h2>
                                        </div>
                                        {isSelected && (
                                            <div className="bg-primary text-primary-content rounded-full p-1">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-base-content/70 mt-2 text-sm leading-relaxed">
                                        {option.description}
                                    </p>
                                    <div className="flex items-center gap-1 mt-3 text-sm font-medium text-primary">
                                        <span>Selecionar</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!selectedRole || isLoading}
                    className="btn btn-primary w-full"
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner"></span>
                            Confirmando...
                        </>
                    ) : (
                        'Continuar'
                    )}
                </button>
            </div>
        </div>
    );
}
