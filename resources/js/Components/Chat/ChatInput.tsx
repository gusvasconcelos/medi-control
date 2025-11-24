import { Send } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({
    onSend,
    disabled = false,
    placeholder = 'Digite sua mensagem ou use um dos prompts acima...',
}: ChatInputProps) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input.trim());
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="input input-bordered flex-1 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary py-6"
            />
            <button
                type="submit"
                disabled={disabled || !input.trim()}
                className="btn btn-primary btn-circle shrink-0"
                aria-label="Enviar mensagem"
            >
                <Send className="h-5 w-5" />
            </button>
        </form>
    );
}

