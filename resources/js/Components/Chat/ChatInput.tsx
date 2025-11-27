import { useState, KeyboardEvent, ChangeEvent, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({
    onSend,
    disabled = false,
    placeholder = 'Pergunte o que quiser...',
}: ChatInputProps) {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const maxLength = 2000;
    const currentLength = message.length;

    const handleSend = () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage || disabled) return;

        onSend(trimmedMessage);
        setMessage('');

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 120);
        textarea.style.height = `${newHeight}px`;
    }, [message]);

    return (
        <div className="fixed bottom-0 left-0 right-0 lg:static bg-base-200 p-3 lg:pb-6 lg:p-6 z-40 border-t border-base-300 lg:border-t-0">
            <div className="max-w-4xl mx-auto">
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        maxLength={maxLength}
                        rows={1}
                        className="textarea w-full resize-none overflow-hidden focus:outline-none border-2 border-base-300 focus:border-primary rounded-2xl pr-12 text-base"
                        style={{ minHeight: '48px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={disabled || !message.trim()}
                        className="btn btn-primary btn-circle btn-sm absolute right-2 bottom-2"
                        aria-label="Enviar mensagem"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center justify-end mt-2 sm:mt-3">
                    <div className="flex items-center gap-4">
                        <span className="text-xs sm:text-sm text-base-content/60">
                            {currentLength}/{maxLength}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
