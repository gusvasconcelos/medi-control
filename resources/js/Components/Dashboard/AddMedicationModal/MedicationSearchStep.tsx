import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { medicationService } from '@/services/medicationService';
import { debounce } from '@/utils/debounce';
import type { MedicationSearchResult } from '@/types';
import { MedicationPreviewCard } from './MedicationPreviewCard';

interface MedicationSearchStepProps {
    selectedMedication: MedicationSearchResult | null;
    onSelectMedication: (medication: MedicationSearchResult) => void;
    onDropdownStateChange?: (isOpen: boolean) => void;
}

export function MedicationSearchStep({
    selectedMedication,
    onSelectMedication,
    onDropdownStateChange,
}: MedicationSearchStepProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<MedicationSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState('');
    const searchRef = useRef<HTMLDivElement>(null);
    const skipSearchRef = useRef(false);

    const performSearch = async (query: string) => {
        if (query.length < 3) {
            setSearchResults([]);
            setShowResults(false);
            onDropdownStateChange?.(false);
            return;
        }

        setIsSearching(true);
        setError('');

        try {
            const response = await medicationService.searchMedications(query, 10);
            setSearchResults(response.data);
            setShowResults(true);
            onDropdownStateChange?.(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao buscar medicamentos');
            setSearchResults([]);
            onDropdownStateChange?.(false);
        } finally {
            setIsSearching(false);
        }
    };

    const debouncedSearch = useRef(
        debounce((query: string) => {
            performSearch(query);
        }, 400)
    ).current;

    useEffect(() => {
        if (skipSearchRef.current) {
            skipSearchRef.current = false;
            return;
        }
        debouncedSearch(searchQuery);
    }, [searchQuery, debouncedSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
                onDropdownStateChange?.(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onDropdownStateChange]);

    const handleSelectMedication = (medication: MedicationSearchResult) => {
        onSelectMedication(medication);
        skipSearchRef.current = true;
        setSearchQuery(medication.name);
        setShowResults(false);
        onDropdownStateChange?.(false);
    };

    return (
        <div className="space-y-4">
            <div className="form-control w-full" ref={searchRef}>
                <label className="label">
                    <span className="label-text font-medium">Buscar medicamento</span>
                </label>

                <div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Digite o nome do medicamento (mín. 3 caracteres)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchResults.length > 0 && setShowResults(true)}
                            className={`input input-bordered w-full pr-10 ${error ? 'input-error' : ''}`}
                            autoComplete="off"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isSearching ? (
                                <Loader2 className="h-5 w-5 animate-spin text-base-content/50" />
                            ) : (
                                <Search className="h-5 w-5 text-base-content/50" />
                            )}
                        </div>
                    </div>

                    {showResults && searchResults.length > 0 && (
                        <div className="w-full mt-2 bg-base-100 border border-base-300 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                            {searchResults.map((medication) => (
                                <button
                                    key={medication.id}
                                    type="button"
                                    onClick={() => handleSelectMedication(medication)}
                                    className="w-full text-left px-4 py-3 hover:bg-base-200 transition-colors border-b border-base-300 last:border-b-0"
                                >
                                    <div className="font-medium text-sm">
                                        {medication.name}
                                    </div>
                                    {medication.active_principle && (
                                        <div className="text-xs text-base-content/70 mt-1">
                                            {medication.active_principle}
                                        </div>
                                    )}
                                    {(medication.manufacturer || medication.strength) && (
                                        <div className="flex gap-2 mt-1 flex-wrap">
                                            {medication.manufacturer && (
                                                <span className="text-xs text-base-content/60">
                                                    {medication.manufacturer}
                                                </span>
                                            )}
                                            {medication.strength && (
                                                <span className="text-xs text-base-content/60">
                                                    {medication.strength}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {error && (
                    <label className="label">
                        <span className="label-text-alt text-error">{error}</span>
                    </label>
                )}

                {!isSearching && searchQuery.length >= 3 && searchResults.length === 0 && !error && (
                    <label className="label">
                        <span className="label-text-alt text-base-content/60">
                            Nenhum medicamento encontrado
                        </span>
                    </label>
                )}
            </div>

            {selectedMedication && (
                <div className="mt-4">
                    <label className="label">
                        <span className="label-text font-medium">Medicamento selecionado</span>
                    </label>
                    <MedicationPreviewCard medication={selectedMedication} />
                </div>
            )}
        </div>
    );
}
