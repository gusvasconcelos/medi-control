import { CheckCircle, XCircle, Clock, ArrowRight, Shield, AlertTriangle, Info } from 'lucide-react';
import type { ToolExecution } from '@/types/chat';

interface ToolExecutionResultProps {
    toolExecution: ToolExecution;
}

export function ToolExecutionResult({ toolExecution }: ToolExecutionResultProps) {
    const { success, reorganized_medications, interactions_found, severe_count, moderate_count, mild_count, alerts_created, search_results, user_medication_id, medication_name } = toolExecution;

    if (!success) {
        return (
            <div className="mt-3 p-4 bg-error/10 border border-error/20 rounded-lg">
                <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-error text-sm">Erro na operação</h4>
                        <p className="text-sm text-error/80 mt-1">{toolExecution.message}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Medication search results
    if (search_results && search_results.length > 0) {
        return (
            <div className="mt-3 p-4 bg-white/10 border border-white/20 rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                    <Info className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-white text-sm">Medicamentos encontrados</h4>
                        <p className="text-sm text-white/80 mt-1">
                            {search_results.length} {search_results.length === 1 ? 'resultado' : 'resultados'}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    {search_results.map((med, idx) => (
                        <div
                            key={med.id}
                            className="bg-base-100 p-3 rounded-md border border-base-300"
                        >
                            <div className="flex items-start gap-2">
                                <span className="badge badge-sm badge-primary">{idx + 1}</span>
                                <div className="flex-1">
                                    <h5 className="font-semibold text-sm text-base-content">
                                        {med.name}
                                    </h5>
                                    {med.active_principle && (
                                        <p className="text-xs text-base-content/70 mt-1">
                                            Princípio ativo: {med.active_principle}
                                        </p>
                                    )}
                                    <div className="flex gap-2 mt-1 text-xs text-base-content/60">
                                        {med.strength && <span>{med.strength}</span>}
                                        {med.form && <span>• {med.form}</span>}
                                    </div>
                                    <p className="text-xs text-base-content/50 mt-1">ID: {med.id}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Medication added successfully
    if (user_medication_id && medication_name) {
        return (
            <div className="mt-3 p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-success text-sm">Medicamento adicionado</h4>
                        <p className="text-sm text-success/80 mt-1">
                            {medication_name} foi adicionado ao seu tratamento com sucesso!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Interaction check result
    if (interactions_found !== undefined) {
        return (
            <div className="mt-3 p-4 bg-white/10 border border-white/20 rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                    <Shield className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">Verificação de interações concluída</h4>
                        <p className="text-sm text-white/80 mt-1">
                            {interactions_found === 0
                                ? 'Nenhuma interação significativa encontrada'
                                : `${interactions_found} ${interactions_found === 1 ? 'interação encontrada' : 'interações encontradas'}`}
                        </p>
                    </div>
                </div>

                {interactions_found > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                        {severe_count !== undefined && severe_count > 0 && (
                            <div className="bg-error/10 border border-error/20 rounded-md p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertTriangle className="w-4 h-4 text-error" />
                                    <span className="text-xs font-semibold text-error">Graves</span>
                                </div>
                                <p className="text-2xl font-bold text-error">{severe_count}</p>
                            </div>
                        )}

                        {moderate_count !== undefined && moderate_count > 0 && (
                            <div className="bg-warning/10 border border-warning/20 rounded-md p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertTriangle className="w-4 h-4 text-warning" />
                                    <span className="text-xs font-semibold text-warning">Moderadas</span>
                                </div>
                                <p className="text-2xl font-bold text-warning">{moderate_count}</p>
                            </div>
                        )}

                        {mild_count !== undefined && mild_count > 0 && (
                            <div className="bg-info/10 border border-info/20 rounded-md p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Info className="w-4 h-4 text-info" />
                                    <span className="text-xs font-semibold text-info">Leves</span>
                                </div>
                                <p className="text-2xl font-bold text-info">{mild_count}</p>
                            </div>
                        )}
                    </div>
                )}

                {alerts_created !== undefined && alerts_created > 0 && (
                    <div className="mt-3 text-xs text-white/60">
                        {alerts_created} {alerts_created === 1 ? 'novo alerta criado' : 'novos alertas criados'}
                    </div>
                )}
            </div>
        );
    }

    // Medication reorganization result
    if (reorganized_medications && reorganized_medications.length > 0) {
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

    return null;
}
