import { Wrench, Shield, Info } from 'lucide-react';

interface StatusBadgeProps {
    type: 'tool_available' | 'tool_executed' | 'restricted';
    text: string;
}

export function StatusBadge({ type, text }: StatusBadgeProps) {
    const styles = {
        tool_available: 'badge-info',
        tool_executed: 'badge-success',
        restricted: 'badge-warning',
    };

    const icons = {
        tool_available: Wrench,
        tool_executed: Shield,
        restricted: Info,
    };

    const Icon = icons[type];

    return (
        <div className={`badge badge-sm ${styles[type]} gap-1`}>
            <Icon className="w-3 h-3" />
            <span className="text-xs">{text}</span>
        </div>
    );
}
