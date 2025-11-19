import { ReactNode } from 'react';

interface AuthCardProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
    return (
        <>
            {/* Navigation */}
            <nav className="navbar px-4 lg:px-8 border-b border-base-300">
                <div className="navbar-start">
                    <a href="/">
                        <img
                            src="/storage/logo.svg"
                            alt="MediControl"
                            className="w-40 h-16"
                        />
                    </a>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-[calc(100vh-128px)] p-4">
                <div className="w-full max-w-md">
                    {/* Title */}
                    <h1 className="text-3xl font-bold mb-2">{title}</h1>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className="text-base-content/70 mb-6">{subtitle}</p>
                    )}

                    {/* Content */}
                    {children}
                </div>
            </div>
        </>
    );
}
