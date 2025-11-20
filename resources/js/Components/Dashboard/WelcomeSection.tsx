import { User } from '@/types';

interface WelcomeSectionProps {
    user: User;
}

export function WelcomeSection({ user }: WelcomeSectionProps) {
    const nextSteps = [
        'Adicione seus primeiros medicamentos',
        'Configure lembretes para não esquecer de tomar seus remédios',
        'Explore as funcionalidades do sistema',
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-2">
                    Bem-vindo, {user.name}!
                </h1>
                <p className="text-base-content/70">
                    Este é seu painel de controle de medicamentos.
                </p>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Próximos passos</h2>
                    <ul className="list-disc list-inside space-y-2 text-base-content/80">
                        {nextSteps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
