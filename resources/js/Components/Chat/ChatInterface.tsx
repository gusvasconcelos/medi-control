import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { SuggestedPrompts } from './SuggestedPrompts';
import { Loader2 } from 'lucide-react';
import type { UIMessage } from '@/types/chat';

interface ChatInterfaceProps {
    initialMessages?: UIMessage[];
    chatId?: string;
    userName?: string;
}

export function ChatInterface({
    initialMessages = [],
    chatId,
    userName,
}: ChatInterfaceProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { messages, sendMessage, isLoading } = useChat({
        api: '/api/v1/chat',
        id: chatId,
        initialMessages,
        body: {
            id: chatId,
        },
        streamProtocol: 'text',
        onError: (error: Error) => {
            console.error('Chat error:', error);
        },
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (text: string) => {
        sendMessage({ text });
    };

    const displayMessages = messages.length > 0 ? messages : initialMessages;
    const showWelcome = displayMessages.length === 0;

    return (
        <div className="flex h-full flex-col">
            {/* Messages Container */}
            <div className="overflow-y-auto py-8">
                {showWelcome ? (
                    <div className="flex h-full flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
                        <div className="w-full max-w-3xl">
                            {/* Greeting */}
                            <div className="mb-8 text-center">
                                <h2 className="mb-2 text-3xl font-bold text-base-content sm:text-4xl">
                                    Olá,{' '}
                                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        {userName || 'usuário'}
                                    </span>
                                </h2>
                                <p className="text-xl text-base-content/70 sm:text-2xl">
                                    O que você gostaria de saber?
                                </p>
                            </div>

                            {/* Instructional Text */}
                            <p className="mb-6 text-center text-sm text-base-content/60 sm:text-base">
                                Use um dos prompts mais comuns abaixo ou crie o
                                seu próprio para começar
                            </p>

                            {/* Suggested Prompts */}
                            <SuggestedPrompts onSelectPrompt={handleSend} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 px-4 py-6">
                        {displayMessages.map((message: UIMessage) => (
                            <MessageBubble
                                key={message.id}
                                message={message}
                            />
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-base-300 text-base-content">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                                <div className="rounded-2xl bg-base-300 px-4 py-2.5">
                                    <p className="text-sm text-base-content/60">
                                        Pensando...
                                    </p>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Container */}
            <div className="bg-base-100 px-4">
                <div className="rounded-2xl bg-base-100">
                    <ChatInput
                        onSend={handleSend}
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}

