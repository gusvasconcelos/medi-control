import { Plus, MessageCircle } from 'lucide-react';

interface FloatingActionButtonsProps {
    onAddMedication: () => void;
    onOpenChat?: () => void;
}

export function FloatingActionButtons({
    onAddMedication,
    onOpenChat
}: FloatingActionButtonsProps) {
    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
            {onOpenChat && (
                <button
                    type="button"
                    onClick={onOpenChat}
                    className="btn btn-ghost btn-circle w-12 h-12 shadow-lg bg-base-100 hover:bg-base-200"
                    aria-label="Chat de suporte"
                >
                    <MessageCircle className="w-5 h-5" />
                </button>
            )}

            <button
                type="button"
                onClick={onAddMedication}
                className="btn btn-primary btn-circle w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
                aria-label="Adicionar novo medicamento"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
}
