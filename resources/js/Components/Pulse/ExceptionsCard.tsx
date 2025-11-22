import { AlertTriangle } from 'lucide-react';

interface Exception {
    exception: string;
    count: number;
    location?: string;
}

interface ExceptionsCardProps {
    exceptions: Exception[];
}

export function ExceptionsCard({ exceptions }: ExceptionsCardProps) {
    const parseException = (exceptionStr: string) => {
        try {
            // Tentar parsear como JSON array
            const parsed = JSON.parse(exceptionStr);
            if (Array.isArray(parsed) && parsed.length >= 2) {
                return {
                    name: parsed[0],
                    location: parsed[1]
                };
            }
        } catch {
            // Se não for JSON, tentar separar por vírgula ou usar como está
            const parts = exceptionStr.split(',');
            if (parts.length >= 2) {
                return {
                    name: parts[0].replace(/[\[\]"]/g, '').trim(),
                    location: parts[1].replace(/[\[\]"]/g, '').trim()
                };
            }
        }

        // Fallback: retornar o string original
        return {
            name: exceptionStr,
            location: undefined
        };
    };

    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-4 sm:p-6 hover:border-base-content/20 transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-error/10 rounded-lg">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-error" />
                </div>
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-base-content">Exceções</h2>
                    <p className="text-xs sm:text-sm text-base-content/60">
                        Erros e exceções capturadas
                    </p>
                </div>
            </div>

            {exceptions.length > 0 ? (
                <div className="space-y-3">
                    {exceptions.map((exception, index) => {
                        const parsed = parseException(exception.exception);

                        return (
                            <div
                                key={index}
                                className="bg-base-200 rounded-lg p-3 sm:p-4 border border-base-300 hover:border-error/50 transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-error mt-0.5 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm sm:text-base font-medium text-base-content mb-1 break-words">
                                                    {parsed.name}
                                                </div>
                                                {parsed.location && (
                                                    <div className="text-xs text-base-content/60 font-mono break-all">
                                                        {parsed.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end sm:justify-start shrink-0 pl-6 sm:pl-0">
                                        <div className="badge badge-error badge-md sm:badge-lg">
                                            {exception.count}x
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8 sm:py-12 bg-base-200 rounded-lg">
                    <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-base-content/20 mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-base-content/60 px-4">
                        Nenhuma exceção registrada
                    </p>
                </div>
            )}
        </div>
    );
}

