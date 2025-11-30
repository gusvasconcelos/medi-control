import { FormEvent, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { AuthCard } from '@/Components/Auth/AuthCard';
import { InputField } from '@/Components/Auth/InputField';
import type { PageProps, LoginCredentials } from '@/types';
import { login, register, dashboard } from '@/routes';
import password from '@/routes/password';

export default function Login({ auth }: PageProps) {
    // If already authenticated, redirect to dashboard
    if (auth?.user) {
        router.visit(dashboard.url());
        return null;
    }

    const { data, setData, post, processing, errors } = useForm<LoginCredentials>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(login.url());
    };

    return (
        <>
            <Head title="Login" />

            <AuthCard
                title="Login"
                subtitle="Olá, bem-vindo de volta"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
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
                                    autoComplete="current-password"
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

                        <div className="flex items-center justify-between">
                            <label className="label cursor-pointer gap-2 p-0">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-sm"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="label-text">Lembrar-me</span>
                            </label>
                            <Link
                                href={password.request.url()}
                                className="link link-primary text-sm"
                            >
                                Esqueceu sua senha?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={processing}
                        >
                            {processing ? (
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
                    <Link href={register.url()} className="link link-primary text-sm font-medium">
                        Criar uma conta
                    </Link>
                </div>
            </AuthCard>
        </>
    );
}
