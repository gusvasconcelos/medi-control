import { Eye, Pencil, Trash2, MoreVertical } from 'lucide-react';
import type { Medication } from '@/types';

interface MedicationsTableProps {
    medications: Medication[];
    isLoading?: boolean;
    onView: (medication: Medication) => void;
    onEdit: (medication: Medication) => void;
    onDelete: (medication: Medication) => void;
}

const formLabels: Record<string, string> = {
    tablet: 'Comprimido',
    capsule: 'Cápsula',
    liquid: 'Líquido',
    injection: 'Injeção',
    cream: 'Pomada',
    drops: 'Gotas',
    spray: 'Spray',
    inhaler: 'Inalador',
    patch: 'Adesivo',
    other: 'Outro',
};

const getFormLabel = (form: string | null | undefined): string | null => {
    if (!form) return null;
    return formLabels[form] || form;
};

export function MedicationsTable({
    medications,
    isLoading = false,
    onView,
    onEdit,
    onDelete,
}: MedicationsTableProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (medications.length === 0) {
        return (
            <div className="rounded-lg bg-base-200 p-8 text-center">
                <p className="text-base-content/60">
                    Nenhum medicamento encontrado.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop View - Table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Princípio Ativo</th>
                            <th>Fabricante</th>
                            <th>Categoria</th>
                            <th>Forma</th>
                            <th>Registro</th>
                            <th className="text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medications.map((medication) => (
                            <tr key={medication.id} className="hover">
                                <td className="font-medium">{medication.name}</td>
                                <td>
                                    {medication.active_principle || (
                                        <span className="text-base-content/40">
                                            -
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {medication.manufacturer || (
                                        <span className="text-base-content/40">
                                            -
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {medication.category || (
                                        <span className="text-base-content/40">
                                            -
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {getFormLabel(medication.form) || (
                                        <span className="text-base-content/40">
                                            -
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {medication.registration_number || (
                                        <span className="text-base-content/40">
                                            -
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => onView(medication)}
                                            aria-label="Ver detalhes"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => onEdit(medication)}
                                            aria-label="Editar"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-sm text-error"
                                            onClick={() => onDelete(medication)}
                                            aria-label="Deletar"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="lg:hidden space-y-3">
                {medications.map((medication) => (
                    <div
                        key={medication.id}
                        className="rounded-lg bg-base-100 border border-base-300 p-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base text-base-content truncate">
                                    {medication.name}
                                </h3>
                                <div className="mt-2 space-y-1.5">
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs text-base-content/60 font-medium min-w-[90px]">
                                            Princípio Ativo:
                                        </span>
                                        <span className="text-xs text-base-content flex-1">
                                            {medication.active_principle || (
                                                <span className="text-base-content/40">
                                                    Não informado
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs text-base-content/60 font-medium min-w-[90px]">
                                            Categoria:
                                        </span>
                                        <span className="text-xs text-base-content flex-1">
                                            {medication.category || (
                                                <span className="text-base-content/40">
                                                    Não informado
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Dropdown Menu */}
                            <div className="dropdown dropdown-end">
                                <button
                                    type="button"
                                    tabIndex={0}
                                    className="btn btn-ghost btn-sm btn-circle"
                                    aria-label="Ações"
                                >
                                    <MoreVertical className="h-5 w-5" />
                                </button>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow-lg"
                                >
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() => onView(medication)}
                                            className="flex items-center gap-3"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Ver detalhes
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() => onEdit(medication)}
                                            className="flex items-center gap-3"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Editar
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(medication)}
                                            className="flex items-center gap-3 text-error"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Deletar
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

