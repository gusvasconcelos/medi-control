import { FormEvent, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { AuthCard } from '@/Components/Auth/AuthCard';
import { InputField } from '@/Components/Auth/InputField';
import { useToast } from '@/hooks/useToast';
import type { PageProps, RegisterData } from '@/types';

export default function Register({ auth }: PageProps) {
    const { showError, showSuccess } = useToast();

    // If already authenticated, redirect to dashboard
    if (auth?.user) {
        router.visit('/dashboard');
        return null;
    }

    const [formData, setFormData] = useState<RegisterData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState<Partial<RegisterData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            await axios.post('/register', formData);
            showSuccess('Conta criada com sucesso!');
            router.visit('/dashboard');
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 422) {
                    setErrors(error.response.data.details || {});
                    showError(error.response.data.message);
                } else {
                    showError('Ocorreu um erro ao criar sua conta. Tente novamente.');
                }
            } else {
                showError('Ocorreu um erro ao criar sua conta. Tente novamente.');
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
                subtitle="Comece sua jornada conosco"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
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
