import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { OptimizedImage } from '@/Components/Common/OptimizedImage';

interface ForbiddenProps extends PageProps {
    status?: number;
}

export default function Forbidden({ auth }: ForbiddenProps) {
    const handleGoBack = () => {
        window.history.back();
    };

    const handleGoHome = () => {
        if (auth?.user) {
            router.visit('/dashboard');
        } else {
            router.visit('/');
        }
    };

    return (
        <>
            <Head title="Acesso negado" />

            <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
                <div className="max-w-2xl w-full text-center">
                    <div className="mb-8">
                        <h1 className="text-9xl font-bold text-error">403</h1>
                    </div>

                    <div className="flex items-center justify-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-base-content">
                            Acesso negado
                        </h2>
                        <OptimizedImage src="/storage/blocked.webp" alt="Acesso negado" className="w-16 h-16" />
                    </div>


                    <p className="text-lg text-base-content/70 mb-8">
                        Você não tem permissão para acessar esta página.
                        Se você acredita que isso é um erro, entre em contato com o administrador.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleGoBack}
                            className="btn btn-outline btn-lg"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Voltar
                        </button>
                        <button
                            onClick={handleGoHome}
                            className="btn btn-primary btn-lg"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            {auth?.user ? 'Ir para Dashboard' : 'Ir para Início'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
