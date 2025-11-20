import { ReactNode } from 'react';

interface QuickAccessCardProps {
    title: string;
    description: string;
    buttonText: string;
    onButtonClick?: () => void;
    icon?: ReactNode;
}

export function QuickAccessCard({
    title,
    description,
    buttonText,
    onButtonClick,
    icon,
}: QuickAccessCardProps) {
    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
                {icon && (
                    <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {icon}
                        </div>
                    </div>
                )}
                <h2 className="card-title justify-center text-center">{title}</h2>
                <p className="text-center text-base-content/70">{description}</p>
                <div className="card-actions justify-center mt-4">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={onButtonClick}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
