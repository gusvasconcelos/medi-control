import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import type { ToolExecution } from '@/types/chat';

interface ToolExecutionResultProps {
    toolExecution: ToolExecution;
}

export function ToolExecutionResult({ toolExecution }: ToolExecutionResultProps) {
    const { success, reorganized_medications } = toolExecution;

    if (!success) {
        return (
            <div className="mt-3 p-4 bg-error/10 border border-error/20 rounded-lg">
                <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-error text-sm">Erro na reorganização</h4>
                        <p className="text-sm text-error/80 mt-1">{toolExecution.message}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-3 p-4 bg-white/10 border border-white/20 rounded-lg">
            <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-semibold text-white text-sm">Medicamentos reorganizados</h4>
                    <p className="text-sm text-white/80 mt-1">
                        {reorganized_medications.length} {reorganized_medications.length === 1 ? 'medicamento foi reorganizado' : 'medicamentos foram reorganizados'}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {reorganized_medications.map((medication) => (
                    <div
                        key={medication.id}
                        className="bg-base-100 p-3 rounded-md border border-base-300"
                    >
                        <h5 className="font-semibold text-sm text-base-content mb-2">
                            {medication.name}
                        </h5>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-base-content/60" />
                                <span className="text-base-content/60">Anterior:</span>
                                <div className="flex flex-wrap gap-1">
                                    {medication.old_time_slots.map((time, idx) => (
                                        <span
                                            key={idx}
                                            className="badge badge-sm badge-ghost"
                                        >
                                            {time}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <ArrowRight className="w-3.5 h-3.5 text-base-content/40 hidden sm:block" />

                            <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-success" />
                                <span className="text-success">Novo:</span>
                                <div className="flex flex-wrap gap-1">
                                    {medication.new_time_slots.map((time, idx) => (
                                        <span
                                            key={idx}
                                            className="badge badge-sm badge-success"
                                        >
                                            {time}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 text-xs text-base-content/60">
                            Início: {new Date(medication.start_date).toLocaleDateString('pt-BR')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
