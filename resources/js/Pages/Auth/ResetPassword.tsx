import { FormEvent, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { AuthCard } from '@/Components/Auth/AuthCard';
import { InputField } from '@/Components/Auth/InputField';
import { useToast } from '@/hooks/useToast';
import type { PageProps, ResetPasswordData } from '@/types';

interface ResetPasswordProps extends PageProps {
    token: string;
    email?: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { showSuccess, showError } = useToast();
    const [formData, setFormData] = useState<ResetPasswordData>({
        email: email || '',
        password: '',
        password_confirmation: '',
        token: token,
    });
    const [errors, setErrors] = useState<Partial<ResetPasswordData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            await axios.post<{ message: string }>('/api/v1/auth/reset-password', formData);
            showSuccess('Senha redefinida com sucesso! Faça login com sua nova senha.');
            setTimeout(() => {
                router.visit('/login');
            }, 1500);
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.details || {});
                showError(error.response.data.message || 'Verifique os campos e tente novamente.');
            } else {
                showError('Ocorreu um erro ao redefinir sua senha. O link pode ter expirado.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Redefinir Senha" />

            <AuthCard title="Redefinir Senha">
                <p className="text-sm text-base-content/70 mb-4">
                    Crie uma nova senha para sua conta.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label="Email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        error={errors.email}
                        placeholder="seu@email.com"
                    />

                    <InputField
                        label="Nova Senha"
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        error={errors.password}
                        placeholder="••••••••"
                    />

                    <InputField
                        label="Confirmar Nova Senha"
                        type="password"
                        name="password_confirmation"
                        autoComplete="new-password"
                        required
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                        error={errors.password_confirmation}
                        placeholder="••••••••"
                    />

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Redefinindo...
                            </>
                        ) : (
                            'Redefinir Senha'
                        )}
                    </button>
                </form>

                <div className="divider">ou</div>

                <div className="text-center">
                    <Link href="/login" className="link link-primary text-sm">
                        Voltar para o login
                    </Link>
                </div>
            </AuthCard>
        </>
    );
}
