import { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { ChatInput } from '@/Components/Chat/ChatInput';
import { MessageBubble } from '@/Components/Chat/MessageBubble';
import { SuggestedPrompts } from '@/Components/Chat/SuggestedPrompts';
import { useChat } from '@/hooks/useChat';
import { getNavigationItems } from '@/config/navigation';
import type { PageProps } from '@/types';
import { ConfirmModal } from '@/Components/Common/ConfirmModal';

export default function ChatIndex({ auth }: PageProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const userName = user?.name?.split(' ')[0] || 'Usuário';
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showClearModal, setShowClearModal] = useState(false);

    const {
        messages,
        sendMessage,
        clearHistory,
        isLoading,
        suggestedPrompts,
    } = useChat();

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleClearHistory = () => {
        setShowClearModal(true);
    };

    const handleConfirmClear = async () => {
        await clearHistory();
        setShowClearModal(false);
    };

    const handlePromptSelect = (promptText: string) => {
        sendMessage(promptText, true);
    };

    return (
        <>
            <Head title="Hermes" />
            <AuthenticatedLayout
                navItems={getNavigationItems('/chat', userRoles)}
            >
                <div className="flex flex-col h-[calc(100vh-6rem)] sm:h-[calc(96vh-4rem)] bg-base-200 pb-24 lg:pb-0">
                    {messages.length === 0 ? (
                        // Welcome Screen
                        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto">
                            <div className="max-w-4xl w-full space-y-4 sm:space-y-8">
                                {/* Greeting */}
                                <div className="text-center space-y-2">
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                        Olá, {userName}
                                    </h1>
                                    <p className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-base-content via-primary to-secondary bg-clip-text text-transparent font-semibold">
                                        O que você gostaria de saber?
                                    </p>
                                    <p className="text-xs sm:text-sm text-base-content/60 pt-2">
                                        Use um dos prompts mais comuns abaixo ou
                                        use o seu próprio para começar
                                    </p>
                                </div>
                            <div>

                            {/* Suggested Prompts */}
                            <SuggestedPrompts
                                prompts={suggestedPrompts}
                                onSelect={handlePromptSelect}
                                disabled={isLoading}
                            />
                            </div>
                        </div>
                    </div>
                    ) : (
                        // Chat Messages
                        <>
                            {/* Header with clear button */}
                            <div className="flex items-center justify-between p-4 bg-base-200 border-b border-base-300">
                                <div className="flex items-center justify-center">
                                    <img src="/storage/staff.webp" alt="Hermes" className="size-8" />
                                    <h1 className="text-xl font-bold text-base-content">
                                        Hermes
                                    </h1>
                                </div>
                                <button
                                    onClick={handleClearHistory}
                                    className="btn btn-ghost btn-sm gap-2"
                                    disabled={isLoading}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        Limpar histórico
                                    </span>
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
                                    {messages.map((message, index) => (
                                        <MessageBubble
                                            key={message.id}
                                            message={message}
                                            isLatest={
                                                index === messages.length - 1
                                            }
                                        />
                                    ))}
                                    {isLoading && (
                                        <div className="chat chat-start">
                                            <div className="chat-image avatar">
                                                <div className="w-10 rounded-full bg-secondary text-secondary-content flex items-center justify-center">
                                                    <span className="loading loading-dots loading-sm"></span>
                                                </div>
                                            </div>
                                            <div className="chat-bubble chat-bubble-secondary">
                                                Digitando...
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Input Area - Always at bottom */}
                    <ChatInput onSend={sendMessage} disabled={isLoading} />
                </div>

                {/* Clear History Confirmation Modal */}
                <ConfirmModal
                    isOpen={showClearModal}
                    title="Limpar histórico do chat"
                    message="Tem certeza que deseja limpar todo o histórico do chat? Esta ação não pode ser desfeita."
                    confirmText="Limpar histórico"
                    cancelText="Cancelar"
                    variant="warning"
                    modalId="clear-chat-history-modal"
                    isSubmitting={isLoading}
                    onClose={() => setShowClearModal(false)}
                    onConfirm={handleConfirmClear}
                />
            </AuthenticatedLayout>
        </>
    );
}
