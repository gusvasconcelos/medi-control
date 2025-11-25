import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bot, User } from 'lucide-react';
import type { ChatMessage } from '@/types/chat';
import { ToolExecutionResult } from './ToolExecutionResult';
import ReactMarkdown from 'react-markdown';

export interface MessageBubbleProps {
    message: ChatMessage;
    isLatest?: boolean;
}

export function MessageBubble({ message, isLatest = false }: MessageBubbleProps) {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    const formattedTime = format(new Date(message.created_at), 'HH:mm', {
        locale: ptBR,
    });

    // System messages are centered and styled differently
    if (isSystem) {
        return (
            <div className="flex justify-center my-4">
                <div className="alert alert-info max-w-md">
                    <span className="text-sm">{message.content}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`chat ${isUser ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
                <div
                    className={`w-10 rounded-full flex items-center justify-center ${
                        isUser
                            ? 'bg-primary text-primary-content'
                            : 'bg-secondary text-secondary-content'
                    }`}
                >
                    {isUser ? (
                        <User className="w-5 h-5" />
                    ) : (
                        <Bot className="w-5 h-5" />
                    )}
                </div>
            </div>
            <div className="chat-header mb-1">
                <span className="text-sm text-base-content/70">
                    {isUser ? 'Você' : 'Hermes'}
                </span>
                <time className="text-xs opacity-50 ml-2">{formattedTime}</time>
            </div>
            <div
                className={`chat-bubble ${
                    isUser
                        ? 'chat-bubble-primary'
                        : 'chat-bubble-secondary'
                } ${message.metadata?.tool_execution ? '' : 'whitespace-pre-wrap'}`}
            >
                {message.metadata?.tool_execution ? (
                    <div>
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                        <ToolExecutionResult toolExecution={message.metadata.tool_execution} />
                    </div>
                ) : (
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                )}
            </div>
            {isLatest && !isUser && message.metadata?.tokens_used && (
                <div className="chat-footer opacity-50 text-xs mt-1">
                    {message.metadata.tokens_used} tokens
                </div>
            )}
        </div>
    );
}
