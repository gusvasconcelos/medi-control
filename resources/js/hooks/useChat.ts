import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { chatService } from '@/services/chatService';
import { useToast } from '@/hooks/useToast';
import type { ChatMessage, SuggestedPrompt } from '@/types/chat';

export interface UseChatReturn {
    messages: ChatMessage[];
    sendMessage: (text: string, isSuggestion?: boolean) => Promise<void>;
    clearHistory: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
    suggestedPrompts: SuggestedPrompt[];
}

export function useChat(): UseChatReturn {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [suggestedPrompts, setSuggestedPrompts] = useState<SuggestedPrompt[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showSuccess, showError } = useToast();

    // Load initial messages and suggested prompts
    useEffect(() => {
        async function loadChatData() {
            try {
                const [sessionData, promptsData] = await Promise.all([
                    chatService.getSession(),
                    chatService.getSuggestedPrompts(),
                ]);

                setMessages(sessionData.messages || []);
                setSuggestedPrompts(promptsData.data || []);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(
                        err.response?.data?.message ||
                            'Erro ao carregar o chat'
                    );
                    showError('Erro ao carregar o chat');
                } else {
                    setError('Erro desconhecido');
                    showError('Erro desconhecido ao carregar o chat');
                }
            }
        }

        loadChatData();
    }, [showError]);

    const sendMessage = useCallback(
        async (text: string, isSuggestion = false) => {
            if (!text.trim() || isLoading) return;

            setIsLoading(true);
            setError(null);

            // Optimistic UI update - add user message immediately
            const optimisticUserMessage: ChatMessage = {
                id: Date.now(),
                chat_session_id: 0,
                role: 'user',
                content: text,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, optimisticUserMessage]);

            try {
                const response = await chatService.sendMessage(text, isSuggestion);

                // Replace optimistic message with actual user message and add assistant response
                setMessages((prev) => [
                    ...prev.filter((msg) => msg.id !== optimisticUserMessage.id),
                    // The backend returns only the assistant message, we keep the user message
                    optimisticUserMessage,
                    response.message,
                ]);
            } catch (err) {
                // Rollback optimistic update on error
                setMessages((prev) =>
                    prev.filter((msg) => msg.id !== optimisticUserMessage.id)
                );

                if (axios.isAxiosError(err)) {
                    const errorMessage =
                        err.response?.data?.message ||
                        'Erro ao enviar mensagem';
                    setError(errorMessage);
                    showError(errorMessage);
                } else {
                    setError('Erro desconhecido');
                    showError('Erro desconhecido ao enviar mensagem');
                }
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading, showError]
    );

    const clearHistory = useCallback(async () => {
        try {
            await chatService.clearHistory();
            setMessages([]);
            showSuccess('Histórico do chat limpo com sucesso');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorMessage =
                    err.response?.data?.message ||
                    'Erro ao limpar histórico';
                showError(errorMessage);
            } else {
                showError('Erro desconhecido ao limpar histórico');
            }
        }
    }, [showSuccess, showError]);

    return {
        messages,
        sendMessage,
        clearHistory,
        isLoading,
        error,
        suggestedPrompts,
    };
}
