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

const markdownComponents = {
    p: ({ children }: { children: React.ReactNode }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
    strong: ({ children }: { children: React.ReactNode }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: { children: React.ReactNode }) => <em className="italic">{children}</em>,
    ul: ({ children }: { children: React.ReactNode }) => <ul className="list-disc pl-6 space-y-2 my-3">{children}</ul>,
    ol: ({ children }: { children: React.ReactNode }) => <ol className="list-decimal pl-6 space-y-2 my-3">{children}</ol>,
    li: ({ children }: { children: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
    h1: ({ children }: { children: React.ReactNode }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
    h2: ({ children }: { children: React.ReactNode }) => <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>,
    h3: ({ children }: { children: React.ReactNode }) => <h3 className="text-base font-bold mt-2 mb-1">{children}</h3>,
    code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
        const isInline = !className;
        return isInline ? (
            <code className="bg-base-300 px-1.5 py-0.5 rounded text-sm">{children}</code>
        ) : (
            <code className={className}>{children}</code>
        );
    },
    pre: ({ children }: { children: React.ReactNode }) => <pre className="bg-base-300 p-3 rounded-lg overflow-x-auto my-3 text-sm">{children}</pre>,
    blockquote: ({ children }: { children: React.ReactNode }) => <blockquote className="border-l-4 border-base-300 pl-4 italic my-3">{children}</blockquote>,
    a: ({ children, href }: { children: React.ReactNode; href?: string }) => <a href={href} className="underline hover:opacity-80" target="_blank" rel="noopener noreferrer">{children}</a>,
    hr: () => <hr className="my-4 border-base-300" />,
};

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
                } prose prose-sm max-w-none`}
            >
                {message.metadata?.tool_execution ? (
                    <div>
                        <ReactMarkdown components={markdownComponents}>
                            {message.content}
                        </ReactMarkdown>
                        <ToolExecutionResult toolExecution={message.metadata.tool_execution} />
                    </div>
                ) : (
                    <ReactMarkdown components={markdownComponents}>
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
