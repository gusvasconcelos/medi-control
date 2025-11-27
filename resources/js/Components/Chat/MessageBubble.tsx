import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Stethoscope, User } from 'lucide-react';
import type { ChatMessage } from '@/types/chat';
import { ToolExecutionResult } from './ToolExecutionResult';
import { StatusBadge } from './StatusBadge';
import ReactMarkdown from 'react-markdown';

export interface MessageBubbleProps {
    message: ChatMessage;
}

const markdownComponents = {
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props} className="mb-4 last:mb-0 leading-relaxed text-[15px]" />,
    strong: (props: React.HTMLAttributes<HTMLElement>) => <strong {...props} className="font-bold" />,
    em: (props: React.HTMLAttributes<HTMLElement>) => <em {...props} className="italic" />,
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul {...props} className="list-disc pl-6 space-y-2 my-3" />,
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol {...props} className="list-decimal pl-6 space-y-2 my-3" />,
    li: (props: React.HTMLAttributes<HTMLLIElement>) => <li {...props} className="leading-relaxed text-[15px]" />,
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...props} className="text-xl font-bold mt-4 mb-2" />,
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 {...props} className="text-lg font-bold mt-3 mb-2" />,
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 {...props} className="text-base font-bold mt-2 mb-1" />,
    code: (props: React.HTMLAttributes<HTMLElement> & { className?: string }) => {
        const { className, ...rest } = props;
        const isInline = !className;
        return isInline ? (
            <code {...rest} className="bg-base-300 px-1.5 py-0.5 rounded text-sm" />
        ) : (
            <code {...rest} className={className} />
        );
    },
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => <pre {...props} className="bg-base-300 p-3 rounded-lg overflow-x-auto my-3 text-sm" />,
    blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => <blockquote {...props} className="border-l-4 border-base-300 pl-4 italic my-3" />,
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} className="underline hover:opacity-80" target="_blank" rel="noopener noreferrer" />,
    hr: () => <hr className="my-4 border-base-300" />,
};

export function MessageBubble({ message }: MessageBubbleProps) {
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
                            : 'bg-blue-600 text-white shadow-md'
                    }`}
                >
                    {isUser ? (
                        <User className="w-5 h-5" />
                    ) : (
                        <Stethoscope className="w-5 h-5" />
                    )}
                </div>
            </div>
            <div className="chat-header mb-1 flex items-center gap-2">
                <span className="text-sm text-base-content/70">
                    {isUser ? 'Você' : 'Hermes'}
                </span>
                <time className="text-xs opacity-50">{formattedTime}</time>
                {!isUser && message.metadata?.tool_calls && message.metadata.tool_calls.length > 0 && (
                    <StatusBadge type="tool_executed" text="Ferramenta usada" />
                )}
            </div>
            <div
                className={`chat-bubble ${
                    isUser
                        ? 'chat-bubble-primary'
                        : 'chat-bubble-secondary'
                } prose prose-sm max-w-none leading-relaxed py-3 px-4`}
            >
                {!isUser && !message.content.trim() ? (
                    // Show loading dots inside the bubble when content is empty
                    <div className="flex items-center gap-2">
                        <span className="loading loading-dots loading-sm"></span>
                    </div>
                ) : message.metadata?.tool_execution ? (
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
        </div>
    );
}
