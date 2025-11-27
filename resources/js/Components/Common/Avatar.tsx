import { useState } from 'react';
import { OptimizedImage } from './OptimizedImage';

interface AvatarProps {
    src?: string | null;
    alt: string;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'w-8 h-8 text-xs min-w-8 min-h-8',
    md: 'w-10 h-10 text-sm min-w-10 min-h-10',
    lg: 'w-12 h-12 text-base min-w-12 min-h-12',
    xl: 'w-24 h-24 sm:w-32 sm:h-32 text-4xl sm:text-5xl min-w-24 min-h-24 sm:min-w-32 sm:min-h-32',
};

/**
 * Componente de avatar otimizado com placeholder e lazy loading
 */
export function Avatar({ src, alt, name, size = 'md', className = '' }: AvatarProps) {
    const [imageError, setImageError] = useState(false);
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Se não houver src ou houver erro, mostrar placeholder com iniciais
    if (!src || imageError) {
        return (
            <div
                className={`bg-primary text-primary-content flex items-center justify-center rounded-full ${sizeClasses[size]} flex-shrink-0 ${className}`}
                style={{ aspectRatio: '1 / 1' }}
            >
                <span>{initials}</span>
            </div>
        );
    }

    return (
        <div
            className={`rounded-full overflow-hidden ${sizeClasses[size]} flex-shrink-0 ${className}`}
            style={{ aspectRatio: '1 / 1' }}
        >
            <OptimizedImage
                src={src}
                alt={alt}
                lazy={true}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
            />
        </div>
    );
}

