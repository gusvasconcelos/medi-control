import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { getNavigationItems } from '@/config/navigation';
import type { PageProps } from '@/types';
import type { HorizonMonitoredTag } from '@/types/horizon';
import {
    RefreshCcw,
    Tag,
    ChevronLeft,
    Plus,
    Trash2,
    Eye,
} from 'lucide-react';

interface HorizonMonitoringIndexProps extends PageProps {
    tags: HorizonMonitoredTag[];
}

const BASE_URL = '/monitoring/horizon';

export default function HorizonMonitoringIndex({ auth, tags }: HorizonMonitoringIndexProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => {
                setIsRefreshing(false);
            },
        });
    };

    const handleAddTag = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newTag.trim()) return;

        setIsSubmitting(true);
        router.post(`${BASE_URL}/monitoring`, { tag: newTag.trim() }, {
            preserveScroll: true,
            onFinish: () => {
                setIsSubmitting(false);
                setNewTag('');
            },
        });
    };

    const handleDeleteTag = (tag: string) => {
        router.delete(`${BASE_URL}/monitoring/${encodeURIComponent(tag)}`, {
            preserveScroll: true,
        });
    };

    const hasTags = tags.length > 0;

    return (
        <>
            <Head title="Monitoramento de Tags" />

            <AuthenticatedLayout navItems={getNavigationItems('/monitoring/horizon', userRoles)}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-[1200px] px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        {/* Header */}
                        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href={BASE_URL}
                                    className="btn btn-ghost btn-sm btn-circle"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-base-content sm:text-3xl flex items-center gap-3">
                                        <Tag className="w-7 h-7 text-primary" />
                                        Monitoramento de Tags
                                    </h1>
                                    <p className="text-sm text-base-content/60 mt-1">
                                        Acompanhe jobs por tags específicas
                                    </p>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary btn-sm sm:btn-md"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                            >
                                <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">
                                    {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                                </span>
                            </button>
                        </div>

                        {/* Add Tag Form */}
                        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 mb-6">
                            <h2 className="font-semibold mb-4">Adicionar Nova Tag</h2>
                            <form onSubmit={handleAddTag} className="flex gap-3">
                                <input
                                    type="text"
                                    className="input input-bordered flex-1"
                                    placeholder="Digite a tag para monitorar..."
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting || !newTag.trim()}
                                >
                                    <Plus className="w-4 h-4" />
                                    Adicionar
                                </button>
                            </form>
                            <p className="text-xs text-base-content/50 mt-2">
                                Ex: user:1, order:123, App\Jobs\ProcessOrder
                            </p>
                        </div>

                        {/* Tags List */}
                        <div className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
                            {hasTags ? (
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Tag</th>
                                                <th className="text-right">Jobs</th>
                                                <th className="text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tags.map((item) => (
                                                <tr key={item.tag} className="hover">
                                                    <td>
                                                        <span className="font-mono">{item.tag}</span>
                                                    </td>
                                                    <td className="text-right">
                                                        <span className="badge badge-ghost">
                                                            {item.count.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                href={`${BASE_URL}/monitoring/${encodeURIComponent(item.tag)}`}
                                                                className="btn btn-ghost btn-xs"
                                                                title="Ver jobs"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                className="btn btn-ghost btn-xs text-error"
                                                                onClick={() => handleDeleteTag(item.tag)}
                                                                title="Remover tag"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-base-content/50">
                                    <Tag className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium">Nenhuma tag monitorada</p>
                                    <p className="text-sm mt-1">
                                        Adicione uma tag acima para começar a monitorar
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
