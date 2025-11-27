import { Shield, Clock, AlertTriangle, Calendar, HelpCircle } from 'lucide-react';
import type { SuggestedPrompt } from '@/types/chat';

export interface SuggestedPromptsProps {
    prompts: SuggestedPrompt[];
    onSelect: (prompt: string) => void;
    disabled?: boolean;
}

const iconMap = {
    Shield: Shield,
    Clock: Clock,
    AlertTriangle: AlertTriangle,
    Calendar: Calendar,
    HelpCircle: HelpCircle,
};

export function SuggestedPrompts({
    prompts,
    onSelect,
    disabled = false,
}: SuggestedPromptsProps) {
    if (prompts.length === 0) return null;

    const getIcon = (iconName?: string) => {
        if (!iconName || !(iconName in iconMap)) {
            return HelpCircle;
        }
        return iconMap[iconName as keyof typeof iconMap];
    };

    return (
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {prompts.map((prompt) => {
                    const Icon = getIcon(prompt.icon);
                    return (
                        <button
                            key={prompt.id}
                            onClick={() => onSelect(prompt.text)}
                            disabled={disabled}
                            className="card bg-base-200 border border-base-300 hover:border-primary hover:shadow-lg transition-all duration-200 text-left p-3 sm:p-5 min-h-[90px] sm:min-h-[120px] flex flex-col justify-between group"
                        >
                            <div className="flex-1">
                                <p className="text-sm text-base-content leading-relaxed line-clamp-3">
                                    {prompt.text}
                                </p>
                            </div>
                            <div className="mt-2 sm:mt-4 flex items-center justify-start">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-base-200 group-hover:bg-primary group-hover:text-primary-content transition-colors flex items-center justify-center">
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
