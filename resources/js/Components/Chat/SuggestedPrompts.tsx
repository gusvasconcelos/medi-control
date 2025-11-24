import { Sparkles } from 'lucide-react';

interface SuggestedPrompt {
    id: string;
    title: string;
    description?: string;
}

interface SuggestedPromptsProps {
    onSelectPrompt: (prompt: string) => void;
}

const suggestedPrompts: SuggestedPrompt[] = [
    {
        id: 'interactions',
        title: 'Verificar interações medicamentosas',
        description: 'Analise possíveis interações entre meus medicamentos',
    },
    {
        id: 'schedule',
        title: 'Organizar horários de medicação',
        description: 'Crie um cronograma otimizado para seus medicamentos',
    },
    {
        id: 'dosage',
        title: 'Esclarecer dúvidas sobre dosagem',
        description: 'Tire dúvidas sobre como tomar seus medicamentos corretamente',
    },
    {
        id: 'side-effects',
        title: 'Informações sobre efeitos colaterais',
        description: 'Saiba mais sobre possíveis efeitos colaterais dos medicamentos',
    },
];

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
    const PromptCard = ({ prompt }: { prompt: SuggestedPrompt }) => (
        <button
            type="button"
            onClick={() => onSelectPrompt(prompt.title)}
            className="group relative w-full overflow-hidden rounded-xl border border-base-300 bg-base-100 p-4 text-left transition-all hover:border-primary/50 hover:shadow-md"
        >
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base-content transition-colors group-hover:text-primary">
                        {prompt.title}
                    </h3>
                    {prompt.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-base-content/60">
                            {prompt.description}
                        </p>
                    )}
                </div>
            </div>
        </button>
    );

    return (
        <div className="relative">
            <div className="grid grid-cols-2 gap-3">
                {suggestedPrompts.map((prompt) => (
                    <PromptCard key={prompt.id} prompt={prompt} />
                ))}
            </div>
        </div>
    );
}
