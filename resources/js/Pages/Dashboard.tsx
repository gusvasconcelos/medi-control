import { Head } from '@inertiajs/react';
import { useAuth } from '@/hooks/useAuth';
import type { PageProps } from '@/types';

export default function Dashboard({ }: PageProps) {
    const { user, logout, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-base-200">
                <div className="navbar bg-base-100 shadow-lg">
                    <div className="flex-1">
                        <a className="btn btn-ghost text-xl">Medi Control</a>
                    </div>
                    <div className="flex-none gap-2">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                                <div className="bg-primary text-primary-content rounded-full w-10">
                                    <span className="text-xl">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                            </div>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                <li className="menu-title">
                                    <span>{user?.name}</span>
                                </li>
                                <li className="menu-title">
                                    <span className="text-xs opacity-60">{user?.email}</span>
                                </li>
                                <li><a>Perfil</a></li>
                                <li><a>Configurações</a></li>
                                <li><a onClick={logout}>Sair</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto p-4 md:p-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">
                            Bem-vindo, {user?.name}!
                        </h1>
                        <p className="text-base-content/70">
                            Este é seu painel de controle de medicamentos.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Medicamentos</h2>
                                <p>Gerencie seus medicamentos</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary btn-sm">Ver todos</button>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Lembretes</h2>
                                <p>Configure lembretes de medicação</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary btn-sm">Configurar</button>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Relatórios</h2>
                                <p>Visualize seus relatórios</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary btn-sm">Acessar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Próximos passos</h2>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Adicione seus primeiros medicamentos</li>
                                <li>Configure lembretes para não esquecer de tomar seus remédios</li>
                                <li>Explore as funcionalidades do sistema</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
