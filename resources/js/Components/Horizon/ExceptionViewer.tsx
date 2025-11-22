import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface ExceptionViewerProps {
    exception: string;
    title?: string;
}

export function ExceptionViewer({ exception, title = 'Stack Trace' }: ExceptionViewerProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(exception);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy exception:', error);
        }
    };

    const previewLines = exception.split('\n').slice(0, 5).join('\n');
    const hasMore = exception.split('\n').length > 5;

    return (
        <div className="bg-base-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-base-300">
                <span className="text-sm font-medium text-base-content/70">{title}</span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={handleCopy}
                        title="Copiar"
                    >
                        {isCopied ? (
                            <Check className="w-4 h-4 text-success" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>
                    {hasMore && (
                        <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="w-4 h-4" />
                                    Recolher
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-4 h-4" />
                                    Expandir
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
            <pre className="p-4 text-xs font-mono text-error overflow-x-auto whitespace-pre-wrap break-words max-h-[500px] overflow-y-auto">
                {isExpanded ? exception : previewLines}
                {!isExpanded && hasMore && (
                    <span className="text-base-content/50">
                        {'\n'}... {exception.split('\n').length - 5} linhas adicionais
                    </span>
                )}
            </pre>
        </div>
    );
}
