import { Check } from 'lucide-react';

interface Step {
    number: 1 | 2 | 3;
    title: string;
}

interface StepIndicatorProps {
    currentStep: 1 | 2 | 3;
    steps: Step[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
    return (
        <div className="w-full mb-8 max-w-xl mx-auto">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => {
                    const isCompleted = step.number < currentStep;
                    const isCurrent = step.number === currentStep;
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={step.number} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center
                                        font-semibold text-sm transition-colors
                                        ${
                                            isCompleted
                                                ? 'bg-primary text-primary-content'
                                                : isCurrent
                                                  ? 'bg-primary text-primary-content'
                                                  : 'bg-base-300 text-base-content/50'
                                        }
                                    `}
                                >
                                    {isCompleted ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        step.number
                                    )}
                                </div>
                                <span
                                    className={`
                                        text-xs mt-2 text-center font-medium whitespace-nowrap
                                        ${isCurrent ? 'text-base-content' : 'text-base-content/60'}
                                    `}
                                >
                                    {step.title}
                                </span>
                            </div>

                            {!isLast && (
                                <div
                                    className={`
                                        w-16 sm:w-24 md:w-32 h-0.5 mx-3 sm:mx-4 transition-colors
                                        ${isCompleted ? 'bg-primary' : 'bg-base-300'}
                                    `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
