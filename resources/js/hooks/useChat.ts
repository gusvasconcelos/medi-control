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

            const userMessageId = Date.now();

            const optimisticUserMessage: ChatMessage = {
                id: userMessageId,
                chat_session_id: 0,
                role: 'user',
                content: text,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, optimisticUserMessage]);

            const streamingAssistantMessageId = Date.now() + 1;
            const streamingAssistantMessage: ChatMessage = {
                id: streamingAssistantMessageId,
                chat_session_id: 0,
                role: 'assistant',
                content: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, streamingAssistantMessage]);

            try {
                let actualUserMessageId: number | null = null;
                let actualAssistantMessageId: number | null = null;

                await chatService.sendMessageStream(
                    text,
                    isSuggestion,
                    (chunk) => {
                        if (chunk.type === 'user_message_created') {
                            actualUserMessageId = chunk.userMessageId!;
                            setMessages((prev) =>
                                prev.map((msg) =>
                                    msg.id === userMessageId
                                        ? { ...msg, id: actualUserMessageId!, chat_session_id: chunk.sessionId! }
                                        : msg
                                )
                            );
                        } else if (chunk.type === 'content_delta') {
                            setMessages((prev) =>
                                prev.map((msg) =>
                                    msg.id === streamingAssistantMessageId
                                        ? { ...msg, content: msg.content + chunk.content! }
                                        : msg
                                )
                            );
                        } else if (chunk.type === 'tool_calls') {
                            setMessages((prev) =>
                                prev.map((msg) =>
                                    msg.id === streamingAssistantMessageId
                                        ? {
                                              ...msg,
                                              metadata: {
                                                  ...msg.metadata,
                                                  tool_calls: chunk.tool_calls,
                                              },
                                          }
                                        : msg
                                )
                            );
                        } else if (chunk.type === 'tool_execution') {
                            setMessages((prev) =>
                                prev.map((msg) =>
                                    msg.id === streamingAssistantMessageId
                                        ? {
                                              ...msg,
                                              content: chunk.content!,
                                              metadata: {
                                                  ...msg.metadata,
                                                  tool_execution: chunk.tool_execution,
                                              },
                                          }
                                        : msg
                                )
                            );
                        } else if (chunk.type === 'message_completed') {
                            actualAssistantMessageId = chunk.assistantMessageId!;
                            setMessages((prev) =>
                                prev.map((msg) =>
                                    msg.id === streamingAssistantMessageId
                                        ? { ...msg, id: actualAssistantMessageId! }
                                        : msg
                                )
                            );
                        }
                    }
                );
            } catch (err) {
                setMessages((prev) =>
                    prev.filter(
                        (msg) =>
                            msg.id !== userMessageId &&
                            msg.id !== streamingAssistantMessageId
                    )
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
