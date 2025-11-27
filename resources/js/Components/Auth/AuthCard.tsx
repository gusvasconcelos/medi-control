import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { OptimizedImage } from '@/Components/Common/OptimizedImage';

interface AuthCardProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
    return (
        <>
            {/* Main Content */}
            <div className="flex items-center justify-center min-h-[calc(100vh-128px)] p-4">
                <div className="w-full max-w-md p-8 rounded-lg">
                    <Link href="/">
                        <OptimizedImage
                            src="/storage/icon.svg"
                            alt="Logo do MediControl"
                            className="w-24 h-auto mb-8 self-start mx-auto hover:opacity-80 transition-opacity"
                            lazy={false}
                        />
                    </Link>
                    {/* Title */}
                    <h1 className="text-3xl font-bold mb-2 text-center">{title}</h1>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className="text-base-content/70 mb-6 text-center">{subtitle}</p>
                    )}

                    {/* Content */}
                    {children}
                </div>
            </div>
        </>
    );
}
