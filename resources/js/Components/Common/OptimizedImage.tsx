import { useState, useEffect, ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
    src: string;
    alt: string;
    placeholder?: string;
    lazy?: boolean;
    blurDataURL?: string;
}

/**
 * Componente de imagem otimizado com lazy loading, placeholder e tratamento de erros
 */
export function OptimizedImage({
    src,
    alt,
    placeholder,
    lazy = true,
    blurDataURL,
    className = '',
    onError,
    ...props
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // Se não for lazy, carregar imediatamente
        if (!lazy) {
            setIsLoaded(true);
            return;
        }

        // Preload da imagem real apenas se for lazy
        const img = new Image();
        img.src = src;

        img.onload = () => {
            setIsLoaded(true);
        };

        img.onerror = () => {
            setHasError(true);
        };

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src, lazy]);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setHasError(true);
        if (onError) {
            onError(e);
        }
    };

    // Se houver erro e não houver placeholder, mostrar fallback
    if (hasError && !placeholder && !blurDataURL) {
        return (
            <div className={`bg-base-300 flex items-center justify-center ${className}`}>
                <span className="text-base-content/40 text-xs">Imagem não disponível</span>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Placeholder/Blur enquanto carrega */}
            {!isLoaded && blurDataURL && (
                <img
                    src={blurDataURL}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
                    aria-hidden="true"
                />
            )}
            {!isLoaded && placeholder && !blurDataURL && (
                <div className="absolute inset-0 bg-base-300 flex items-center justify-center">
                    <span className="text-base-content/40 text-xs">Carregando...</span>
                </div>
            )}
            {/* Imagem real */}
            <img
                src={src}
                alt={alt}
                loading={lazy ? 'lazy' : 'eager'}
                decoding="async"
                className={`transition-opacity duration-300 ${
                    isLoaded || !lazy ? 'opacity-100' : 'opacity-0'
                } ${className}`}
                onLoad={() => setIsLoaded(true)}
                onError={handleError}
                {...props}
            />
        </div>
    );
}

