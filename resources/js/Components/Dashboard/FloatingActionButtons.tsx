import { MessageCircle, Plus } from 'lucide-react';
import { router } from '@inertiajs/react';

interface FloatingActionButtonsProps {
    onAddMedication?: () => void;
}

export function FloatingActionButtons({
}: FloatingActionButtonsProps) {
    const handleOpenChat = () => {
        router.visit('/chat');
    };

    return (
        <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-3 lg:bottom-6 lg:right-6">
            <button
                type="button"
                // @ts-ignore - popoverTarget is valid but TypeScript doesn't recognize it yet
                popoverTarget="add-medication-modal"
                className="btn btn-circle btn-primary order-2 h-14 w-14 shadow-lg transition-shadow hover:shadow-xl"
                aria-label="Adicionar novo medicamento"
            >
                <Plus className="h-6 w-6" />
            </button>

                <button
                    type="button"
                onClick={handleOpenChat}
                    className="btn btn-circle btn-ghost order-1 h-12 w-12 bg-base-100 shadow-lg hover:bg-base-200"
                    aria-label="Chat de suporte"
                >
                    <MessageCircle className="h-5 w-5" />
                </button>
        </div>
    );
}
