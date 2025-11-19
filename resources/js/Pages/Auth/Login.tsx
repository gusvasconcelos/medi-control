import { FormEvent, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { AuthCard } from '@/Components/Auth/AuthCard';
import { InputField } from '@/Components/Auth/InputField';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import type { PageProps, LoginCredentials, AuthResponse } from '@/types';

export default function Login({ }: PageProps) {
    const { saveAuthData } = useAuth();
    const { showError } = useToast();
    const [formData, setFormData] = useState<LoginCredentials>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            const response = await axios.post<AuthResponse>('/login', formData);
            saveAuthData(response.data);
            router.visit('/dashboard');
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.details || {});
                showError(error.response.data.message);
            } else if (error.response?.status === 401) {
                showError('Email ou senha inválidos.');
            } else {
                showError('Ocorreu um erro ao fazer login. Tente novamente.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Login" />

            <AuthCard
                title="Login"
                subtitle="Olá, bem-vindo de volta 👋"
            >
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
                            placeholder="exemplo@email.com"
                        />

                        <InputField
                            label="Senha"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            error={errors.password}
                            placeholder="Digite sua senha"
                        />

                        <div className="flex items-center justify-between">
                            <label className="label cursor-pointer gap-2 p-0">
                                <input type="checkbox" className="checkbox checkbox-sm" />
                                <span className="label-text">Lembrar-me</span>
                            </label>
                            <Link
                                href="/forgot-password"
                                className="link link-primary text-sm"
                            >
                                Esqueceu sua senha?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Entrando...
                                </>
                            ) : (
                                'Login'
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <span className="text-sm text-base-content/70">Não tem uma conta? </span>
                    <Link href="/register" className="link link-primary text-sm font-medium">
                        Criar uma conta
                    </Link>
                </div>
            </AuthCard>
        </>
    );
}
