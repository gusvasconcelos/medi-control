import { useState, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Search, Loader2, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import type { Medication } from '@/types';
import { useToast } from '@/hooks/useToast';
import { ResponsiveModal } from '@/Components/Modal/ResponsiveModal';
import { search, checkInteractions } from '@/routes/medications/index';

interface CheckInteractionsModalProps {
    medication: Medication | null;
    isOpen: boolean;
    onClose: () => void;
}

interface MedicationInteraction {
    id: number;
    owner: Medication;
    related: Medication;
    severity: 'low' | 'moderate' | 'high' | 'severe';
    description: string;
    recommendation: string;
    detected_at: string;
}

const severityConfig = {
    low: {
        label: 'Baixa',
        color: 'text-info',
        bgColor: 'bg-info/10',
        icon: Info,
    },
    moderate: {
        label: 'Moderada',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        icon: AlertTriangle,
    },
    high: {
        label: 'Alta',
        color: 'text-error',
        bgColor: 'bg-error/10',
        icon: AlertTriangle,
    },
    severe: {
        label: 'Grave',
        color: 'text-error',
        bgColor: 'bg-error/20',
        icon: AlertTriangle,
    },
};

export function CheckInteractionsModal({ medication, isOpen, onClose }: CheckInteractionsModalProps) {
    const { showError } = useToast();
    const page = usePage<any>();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Medication[]>([]);
    const [selectedMedications, setSelectedMedications] = useState<Medication[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [interactions, setInteractions] = useState<MedicationInteraction[]>([]);
    const [showResults, setShowResults] = useState(false);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setSearchResults([]);
            setSelectedMedications([]);
            setInteractions([]);
            setShowResults(false);
        }
    }, [isOpen]);

    // Listen for flash data with interactions (fallback if onSuccess doesn't work)
    useEffect(() => {
        const result = page.props.interactions as { interactions: MedicationInteraction[] } | MedicationInteraction[] | undefined;

        if (result && isOpen && !isChecking) {
            // Se result é um array direto
            if (Array.isArray(result)) {
                setInteractions(result);
                setShowResults(true);
            }
            // Se result é um objeto com propriedade interactions
            else if (result && typeof result === 'object' && 'interactions' in result) {
                setInteractions(result.interactions as MedicationInteraction[]);
                setShowResults(true);
            }
        }
    }, [page.props.interactions, isOpen, isChecking]);

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (searchQuery.trim().length < 3) {
            setSearchResults([]);
            return;
        }

        searchTimeoutRef.current = setTimeout(() => {
            searchMedications(searchQuery);
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    const searchMedications = (query: string) => {
        setIsSearching(true);

        router.get(
            search.url(),
            {
                q: JSON.stringify({ text: query }),
            },
            {
                only: ['searchResults'],
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    const medicationsData = page.props.searchResults as { data: Medication[] } | undefined;
                    const filtered = (medicationsData?.data || []).filter(
                        (med: Medication) =>
                            med.id !== medication?.id &&
                            !selectedMedications.some(selected => selected.id === med.id)
                    );
                    setSearchResults(filtered);
                },
                onError: () => {
                    showError('Erro ao buscar medicamentos');
                    setSearchResults([]);
                },
                onFinish: () => {
                    setIsSearching(false);
                },
            }
        );
    };

    const handleSelectMedication = (med: Medication) => {
        if (selectedMedications.length >= 10) {
            showError('Você pode selecionar no máximo 10 medicamentos');
            return;
        }

        setSelectedMedications([...selectedMedications, med]);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleRemoveMedication = (medId: number) => {
        setSelectedMedications(selectedMedications.filter(med => med.id !== medId));
    };

    const handleCheckInteractions = () => {
        if (!medication || selectedMedications.length === 0) {
            showError('Selecione pelo menos um medicamento para checar interações');
            return;
        }

        setIsChecking(true);
        setShowResults(false);

        router.post(
            checkInteractions.url(medication),
            {
                medications: selectedMedications.map(med => med.id),
            },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['interactions'],
                onSuccess: (page) => {
                    const result = page.props.interactions as { interactions: MedicationInteraction[] } | MedicationInteraction[] | undefined;

                    if (result) {
                        // Se result é um array direto
                        if (Array.isArray(result)) {
                            setInteractions(result);
                        }
                        // Se result é um objeto com propriedade interactions
                        else if (result && typeof result === 'object' && 'interactions' in result) {
                            setInteractions(result.interactions as MedicationInteraction[]);
                        }

                        setShowResults(true);
                    }
                    setIsChecking(false);
                },
                onError: () => {
                    showError('Erro ao checar interações');
                    setIsChecking(false);
                },
                onFinish: () => {
                    setIsChecking(false);
                },
            }
        );
    };

    const handleClose = () => {
        if (isChecking) return;

        setSearchQuery('');
        setSearchResults([]);
        setSelectedMedications([]);
        setInteractions([]);
        setShowResults(false);

        const modal = document.getElementById('check-interactions-modal') as HTMLElement & { hidePopover?: () => void };
        modal?.hidePopover?.();
        setTimeout(() => {
            onClose();
        }, 300);
    };

    useEffect(() => {
        const modal = document.getElementById('check-interactions-modal') as HTMLElement & { showPopover?: () => void; hidePopover?: () => void };
        if (isOpen && medication) {
            modal?.showPopover?.();
        } else {
            modal?.hidePopover?.();
        }
    }, [isOpen, medication]);

    if (!medication) return null;

    return (
        <ResponsiveModal
            id="check-interactions-modal"
            title="Checar Interações"
            subtitle={medication ? `Medicamento base: ${medication.name}` : undefined}
            onClose={() => {
                handleClose();
            }}
            dynamicHeight
            expandedContent
            footer={!showResults ? (
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            handleClose();
                        }}
                        disabled={isChecking}
                        className="btn btn-ghost"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleCheckInteractions}
                        disabled={isChecking || selectedMedications.length === 0}
                        className="btn btn-primary"
                    >
                        {isChecking ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Verificando...
                            </>
                        ) : (
                            'Checar Interações'
                        )}
                    </button>
                </div>
            ) : (
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            handleClose();
                        }}
                        className="btn btn-ghost"
                    >
                        Fechar
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setShowResults(false);
                            setInteractions([]);
                            setSelectedMedications([]);
                        }}
                        className="btn btn-primary"
                    >
                        Nova Verificação
                    </button>
                </div>
            )}
        >

                {!showResults ? (
                    <>
                        {/* Search Section */}
                        <div className="mb-4">
                            <label className="label">
                                <span className="label-text">
                                    Selecione os medicamentos (máximo 10)
                                </span>
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-base-content/40 pointer-events-none z-10" />
                                <input
                                    type="text"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="Buscar medicamentos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    disabled={isChecking}
                                />
                                {isSearching && (
                                    <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-base-content/40" />
                                )}
                            </div>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="mt-2 bg-base-200 rounded-lg max-h-48 overflow-y-auto">
                                    {searchResults.map((med) => (
                                        <button
                                            key={med.id}
                                            type="button"
                                            onClick={() => handleSelectMedication(med)}
                                            className="w-full text-left px-4 py-3 hover:bg-base-300 transition-colors border-b border-base-300 last:border-b-0"
                                        >
                                            <p className="font-medium">{med.name}</p>
                                            {med.active_principle && (
                                                <p className="text-sm text-base-content/60">
                                                    {med.active_principle}
                                                </p>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected Medications */}
                        {selectedMedications.length > 0 && (
                            <div className="mb-4 flex-1 overflow-y-auto">
                                <label className="label">
                                    <span className="label-text">
                                        Medicamentos selecionados ({selectedMedications.length}/10)
                                    </span>
                                </label>
                                <div className="space-y-2">
                                    {selectedMedications.map((med) => (
                                        <div
                                            key={med.id}
                                            className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                                        >
                                            <div>
                                                <p className="font-medium">{med.name}</p>
                                                {med.active_principle && (
                                                    <p className="text-sm text-base-content/60">
                                                        {med.active_principle}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMedication(med.id)}
                                                disabled={isChecking}
                                                className="btn btn-ghost btn-sm btn-circle"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* Results Section */}
                        <div className="flex-1 overflow-y-auto mb-4">
                            {interactions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <CheckCircle className="h-16 w-16 text-success mb-4" />
                                    <h4 className="text-lg font-semibold mb-2">
                                        Nenhuma interação detectada
                                    </h4>
                                    <p className="text-base-content/60">
                                        Os medicamentos selecionados não apresentam interações conhecidas
                                        com {medication.name}.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <AlertTriangle className="h-5 w-5 text-warning" />
                                        <h4 className="font-semibold">
                                            {interactions.length > 1 ? `${interactions.length} interações detectadas` : `${interactions.length} interação detectada`}
                                        </h4>
                                    </div>

                                    {interactions.map((interaction) => {
                                        const config = severityConfig[interaction.severity];
                                        const Icon = config.icon;

                                        return (
                                            <div
                                                key={interaction.id}
                                                className={`p-4 rounded-lg border-l-4 ${config.bgColor}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <Icon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h5 className="font-semibold">
                                                                {interaction.related.name}
                                                            </h5>
                                                            <span
                                                                className={`badge badge-sm ${config.color}`}
                                                            >
                                                                {config.label}
                                                            </span>
                                                        </div>
                                                        {interaction.related.active_principle && (
                                                            <p className="text-sm text-base-content/60 mb-2">
                                                                {interaction.related.active_principle}
                                                            </p>
                                                        )}
                                                        <p className="text-sm mb-3">
                                                            {interaction.description}
                                                        </p>
                                                        <div className="bg-base-100/50 p-3 rounded">
                                                            <p className="text-sm font-medium mb-1">
                                                                Recomendação:
                                                            </p>
                                                            <p className="text-sm text-base-content/80">
                                                                {interaction.recommendation}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}
        </ResponsiveModal>
    );
}
