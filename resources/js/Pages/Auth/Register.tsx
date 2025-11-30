import { FormEvent, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { AuthCard } from '@/Components/Auth/AuthCard';
import { InputField } from '@/Components/Auth/InputField';
import type { PageProps, RegisterData } from '@/types';
import { login, register, dashboard } from '@/routes';

export default function Register({ auth }: PageProps) {
    // If already authenticated, redirect to dashboard
    if (auth?.user) {
        router.visit(dashboard.url());
        return null;
    }

    const { data, setData, post, processing, errors } = useForm<RegisterData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(register.url());
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
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        placeholder="Seu nome completo"
                    />

                    <InputField
                        label="Email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                        placeholder="exemplo@email.com"
                    />

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium">Senha</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                autoComplete="new-password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Digite sua senha"
                                className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content transition-colors"
                                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.password}</span>
                            </label>
                        )}
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium">Confirmar Senha</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswordConfirmation ? 'text' : 'password'}
                                name="password_confirmation"
                                autoComplete="new-password"
                                required
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirme sua senha"
                                className={`input input-bordered w-full pr-10 ${errors.password_confirmation ? 'input-error' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content transition-colors"
                                aria-label={showPasswordConfirmation ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {showPasswordConfirmation ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.password_confirmation && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.password_confirmation}</span>
                            </label>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={processing}
                    >
                        {processing ? (
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
                    <Link href={login.url()} className="link link-primary text-sm font-medium">
                        Fazer login
                    </Link>
                </div>
            </AuthCard>
        </>
    );
}
