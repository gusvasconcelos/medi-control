import { router, useForm } from '@inertiajs/react';
import { Calendar, Clock, CheckCircle, XCircle, Circle, Edit } from 'lucide-react';
import { useState, FormEventHandler } from 'react';

import type { PatientAdherenceLog, MarkAdherenceData } from '@/types/caregiver';

interface AdherenceLogItemProps {
    log: PatientAdherenceLog;
    patientId: number;
    canMark: boolean;
}

const statusLabels: Record<string, string> = {
    pending: 'Pendente',
    taken: 'Tomado',
    missed: 'Perdido',
    skipped: 'Pulado',
};

const statusColors: Record<string, string> = {
    pending: 'badge-warning',
    taken: 'badge-success',
    missed: 'badge-error',
    skipped: 'badge-info',
};

const statusIcons: Record<string, React.ReactNode> = {
    pending: <Circle className="w-4 h-4" />,
    taken: <CheckCircle className="w-4 h-4" />,
    missed: <XCircle className="w-4 h-4" />,
    skipped: <Circle className="w-4 h-4" />,
};

export function AdherenceLogItem({
    log,
    patientId,
    canMark,
}: AdherenceLogItemProps) {
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, processing } = useForm<MarkAdherenceData>({
        status: log.status,
        taken_at: log.taken_at || '',
        notes: log.notes || '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/caregiver/patients/${patientId}/adherence/${log.id}/mark`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const scheduledDate = new Date(log.scheduled_at);
    const takenDate = log.taken_at ? new Date(log.taken_at) : null;

    return (
        <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`badge ${statusColors[log.status]}`}>
                                {statusLabels[log.status] || log.status}
                            </span>
                            <h4 className="font-semibold">
                                {log.userMedication?.medication?.name || 'N/A'}
                            </h4>
                        </div>

                        <div className="space-y-2 text-sm text-base-content/70">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    <strong>Agendado:</strong>{' '}
                                    {scheduledDate.toLocaleString('pt-BR')}
                                </span>
                            </div>

                            {takenDate && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        <strong>Tomado:</strong>{' '}
                                        {takenDate.toLocaleString('pt-BR')}
                                    </span>
                                </div>
                            )}

                            {log.notes && (
                                <div className="mt-2 p-2 bg-base-300 rounded text-xs">
                                    <strong>Observações:</strong> {log.notes}
                                </div>
                            )}
                        </div>
                    </div>

                    {canMark && log.status !== 'taken' && (
                        <button
                            type="button"
                            className="btn btn-sm btn-ghost"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {isEditing && canMark && (
                    <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-base-300">
                        <div className="space-y-3">
                            <div>
                                <label className="label">
                                    <span className="label-text">Status</span>
                                </label>
                                <select
                                    className="select select-bordered select-sm w-full"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as any)}
                                >
                                    <option value="taken">Tomado</option>
                                    <option value="skipped">Pulado</option>
                                    <option value="missed">Perdido</option>
                                </select>
                            </div>

                            {data.status === 'taken' && (
                                <div>
                                    <label className="label">
                                        <span className="label-text">Data e Hora</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="input input-bordered input-sm w-full"
                                        value={data.taken_at}
                                        onChange={(e) => setData('taken_at', e.target.value)}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="label">
                                    <span className="label-text">Observações</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered textarea-sm w-full"
                                    rows={2}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Adicione observações..."
                                ></textarea>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => setIsEditing(false)}
                                    disabled={processing}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                        'Salvar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
