import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { OptimizedImage } from '@/Components/Common/OptimizedImage';

interface ServerErrorProps extends PageProps {
    status?: number;
}

export default function ServerError({ auth }: ServerErrorProps) {
    const handleGoHome = () => {
        if (auth?.user) {
            router.visit('/dashboard');
        } else {
            router.visit('/');
        }
    };

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <>
            <Head title="Erro no servidor" />

            <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
                <div className="max-w-2xl w-full text-center">
                    <div className="mb-8">
                        <h1 className="text-9xl font-bold text-error">500</h1>
                    </div>

                    <div className="flex items-center justify-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-base-content">
                            Erro interno do servidor
                        </h2>
                        <OptimizedImage src="/storage/warning.webp" alt="Erro interno do servidor" className="w-16 h-16" />
                    </div>

                    <p className="text-lg text-base-content/70 mb-8">
                        Desculpe, algo deu errado em nossos servidores.
                        Nossa equipe já foi notificada e estamos trabalhando para resolver o problema.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleReload}
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
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Tentar novamente
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
