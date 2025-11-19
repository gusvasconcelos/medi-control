import { FormEvent, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { AuthCard } from '@/Components/Auth/AuthCard';
import { InputField } from '@/Components/Auth/InputField';
import { useAuth } from '@/hooks/useAuth';
import type { PageProps, RegisterData, AuthResponse } from '@/types';

export default function Register({ }: PageProps) {
    const { saveAuthData } = useAuth();
    const [formData, setFormData] = useState<RegisterData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState<Partial<RegisterData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generalError, setGeneralError] = useState<string>('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setGeneralError('');
        setIsSubmitting(true);

        try {
            const response = await axios.post<AuthResponse>('/register', formData);
            saveAuthData(response.data);
            router.visit('/dashboard');
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.details || {});
                setGeneralError(error.response.data.message);
            } else {
                setGeneralError('Ocorreu um erro ao criar sua conta. Tente novamente.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Cadastro" />

            <AuthCard
                title="Criar Conta"
                subtitle="Comece sua jornada conosco 🚀"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {generalError && (
                        <div className="alert alert-error">
                            <span>{generalError}</span>
                        </div>
                    )}

                    <InputField
                        label="Nome"
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        error={errors.name}
                        placeholder="Seu nome completo"
                    />

                    <InputField
                        label="Email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        error={errors.email}
                        placeholder="exemplo@email.com"
                    />

                    <InputField
                        label="Senha"
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        error={errors.password}
                        placeholder="Digite sua senha"
                    />

                    <InputField
                        label="Confirmar Senha"
                        type="password"
                        name="password_confirmation"
                        autoComplete="new-password"
                        required
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                        error={errors.password_confirmation}
                        placeholder="Confirme sua senha"
                    />

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Criando conta...
                            </>
                        ) : (
                            'Criar Conta'
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <span className="text-sm text-base-content/70">Já tem uma conta? </span>
                    <Link href="/login" className="link link-primary text-sm font-medium">
                        Fazer login
                    </Link>
                </div>
            </AuthCard>
        </>
    );
}
