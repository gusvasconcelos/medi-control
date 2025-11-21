import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ResponsiveModalProps {
    id: string;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    onClose: () => void;
    dynamicHeight?: boolean;
    expandedContent?: boolean;
}

/**
 * ResponsiveModal - Modal que se adapta ao tamanho da tela
 *
 * Mobile (< 640px): Full screen
 * Desktop (≥ 640px): Modal centralizado
 */
export function ResponsiveModal({
    id,
    title,
    children,
    footer,
    onClose,
    dynamicHeight = false,
    expandedContent = false,
}: ResponsiveModalProps) {
    const desktopMaxHeight = dynamicHeight && expandedContent
        ? 'calc(100vh - 3rem)'
        : 'calc(100vh - 6rem)';

    return (
        <div
            // @ts-ignore - popover API not yet in TypeScript
            popover="auto"
            id={id}
            className="backdrop:bg-black/50 p-0 sm:rounded-2xl shadow-2xl sm:max-w-2xl overflow-hidden m-auto
                       w-full h-full sm:w-[calc(100vw-2rem)]"
            style={{
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                transform: 'none',
                margin: 0,
            } as React.CSSProperties}
        >
            <style>{`
                @media (min-width: 640px) {
                    #${id} {
                        top: 50% !important;
                        left: 50% !important;
                        right: auto !important;
                        bottom: auto !important;
                        transform: translate(-50%, -50%) !important;
                        height: auto !important;
                        max-height: ${desktopMaxHeight} !important;
                        transition: max-height 0.3s ease-in-out;
                    }
                }
            `}</style>

            <div className="bg-base-100 sm:rounded-2xl flex flex-col h-full sm:max-h-[calc(100vh-6rem)]">
                {/* Header */}
                <div className="flex-shrink-0 bg-base-100 border-b border-base-300 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-ghost btn-circle btn-sm"
                        aria-label="Fechar modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-6">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex-shrink-0 bg-base-100 border-t border-base-300 px-4 sm:px-6 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
