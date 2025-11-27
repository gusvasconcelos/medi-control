import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Bell, Moon, Clock, AlertTriangle, Package } from 'lucide-react';

import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { getNavigationItems } from '@/config/navigation';
import { notificationService } from '@/services/notificationService';
import { useToast } from '@/hooks/useToast';
import { PushNotificationToggle } from '@/Components/Notifications/PushNotificationToggle';
import type { PageProps, NotificationPreference } from '@/types';

export default function NotificationPreferencesIndex({ auth }: PageProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const { showSuccess, showError } = useToast();

    const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchPreferences = async () => {
        setIsLoading(true);
        try {
            const data = await notificationService.getPreferences();
            setPreferences(data);
        } catch (error) {
            showError('Erro ao carregar preferências de notificação');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPreferences();
    }, []);

    const handleToggle = async (field: keyof NotificationPreference, value: boolean) => {
        if (!preferences) return;

        const previousValue = preferences[field];
        setPreferences({ ...preferences, [field]: value });

        setIsSaving(true);
        try {
            await notificationService.updatePreferences({ [field]: value });
            showSuccess('Preferência atualizada com sucesso');
        } catch (error) {
            setPreferences({ ...preferences, [field]: previousValue });
            showError('Erro ao atualizar preferência');
        } finally {
            setIsSaving(false);
        }
    };

    const handleQuietHoursChange = async (field: 'quiet_hours_start' | 'quiet_hours_end', value: string) => {
        if (!preferences) return;

        const newValue = value || null;
        setPreferences({ ...preferences, [field]: newValue });
    };

    const handleSaveQuietHours = async () => {
        if (!preferences) return;

        setIsSaving(true);
        try {
            await notificationService.updatePreferences({
                quiet_hours_start: preferences.quiet_hours_start,
                quiet_hours_end: preferences.quiet_hours_end,
            });
            showSuccess('Horário silencioso atualizado com sucesso');
        } catch (error) {
            showError('Erro ao atualizar horário silencioso');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <>
                <Head title="Preferências de Notificação" />
                <AuthenticatedLayout navItems={getNavigationItems('/notifications', userRoles)}>
                    <div className="min-h-screen bg-base-100 flex items-center justify-center">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                </AuthenticatedLayout>
            </>
        );
    }

    return (
        <>
            <Head title="Preferências de Notificação" />

            <AuthenticatedLayout navItems={getNavigationItems('/notifications', userRoles)}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        <div className="mb-6 sm:mb-8">
                            <h1 className="mb-1 text-xl font-bold text-base-content sm:text-2xl md:text-3xl">
                                Preferências de Notificação
                            </h1>
                            <p className="text-xs sm:text-sm text-base-content/60">
                                Configure como e quando você deseja receber notificações
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Push Notification Opt-in */}
                            <div className="card bg-base-200">
                                <div className="card-body">
                                    <h2 className="card-title text-lg flex items-center gap-2">
                                        <Bell className="w-5 h-5" />
                                        Notificações Push
                                    </h2>
                                    <p className="text-sm text-base-content/60 mb-4">
                                        Ative as notificações push para receber alertas em tempo real no seu dispositivo
                                    </p>
                                    <PushNotificationToggle />
                                    <div className="alert alert-info mt-4">
                                        <span className="text-sm">
                                            As notificações push funcionam mesmo quando o aplicativo está fechado.
                                            Você receberá lembretes de medicamentos, alertas de interação e avisos de estoque baixo.
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Notification Types */}
                            <div className="card bg-base-200">
                                <div className="card-body">
                                    <h2 className="card-title text-lg flex items-center gap-2">
                                        <Bell className="w-5 h-5" />
                                        Tipos de Notificação
                                    </h2>
                                    <p className="text-sm text-base-content/60 mb-4">
                                        Escolha quais notificações você deseja receber
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <Clock className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Lembretes de Medicamentos</p>
                                                    <p className="text-xs text-base-content/60">
                                                        Receba lembretes antes e no horário de tomar seus medicamentos
                                                    </p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-primary"
                                                checked={preferences?.medication_reminder ?? true}
                                                onChange={(e) => handleToggle('medication_reminder', e.target.checked)}
                                                disabled={isSaving}
                                            />
                                        </div>

                                        <div className="divider my-0" />

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-warning/10 rounded-lg">
                                                    <AlertTriangle className="w-5 h-5 text-warning" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Alertas de Interação</p>
                                                    <p className="text-xs text-base-content/60">
                                                        Seja notificado sobre interações medicamentosas moderadas ou graves
                                                    </p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-warning"
                                                checked={preferences?.interaction_alert ?? true}
                                                onChange={(e) => handleToggle('interaction_alert', e.target.checked)}
                                                disabled={isSaving}
                                            />
                                        </div>

                                        <div className="divider my-0" />

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-info/10 rounded-lg">
                                                    <Package className="w-5 h-5 text-info" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Alerta de Estoque Baixo</p>
                                                    <p className="text-xs text-base-content/60">
                                                        Receba avisos quando o estoque de medicamentos estiver baixo
                                                    </p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="toggle toggle-info"
                                                checked={preferences?.low_stock_alert ?? true}
                                                onChange={(e) => handleToggle('low_stock_alert', e.target.checked)}
                                                disabled={isSaving}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quiet Hours */}
                            <div className="card bg-base-200">
                                <div className="card-body">
                                    <h2 className="card-title text-lg flex items-center gap-2">
                                        <Moon className="w-5 h-5" />
                                        Horário Silencioso
                                    </h2>
                                    <p className="text-sm text-base-content/60 mb-4">
                                        Defina um período em que você não deseja receber notificações
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Início</span>
                                            </label>
                                            <input
                                                type="time"
                                                className="input input-bordered w-full"
                                                value={preferences?.quiet_hours_start ?? ''}
                                                onChange={(e) => handleQuietHoursChange('quiet_hours_start', e.target.value)}
                                            />
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Fim</span>
                                            </label>
                                            <input
                                                type="time"
                                                className="input input-bordered w-full"
                                                value={preferences?.quiet_hours_end ?? ''}
                                                onChange={(e) => handleQuietHoursChange('quiet_hours_end', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm"
                                            onClick={handleSaveQuietHours}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? (
                                                <>
                                                    <span className="loading loading-spinner loading-xs" />
                                                    Salvando...
                                                </>
                                            ) : (
                                                'Salvar Horário'
                                            )}
                                        </button>
                                    </div>

                                    <div className="alert alert-info mt-4">
                                        <span className="text-sm">
                                            Durante o horário silencioso, as notificações serão agendadas para o próximo horário disponível.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
