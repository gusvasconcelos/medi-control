import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AuthCard } from '@/Components/Auth/AuthCard';
import { InputField } from '@/Components/Auth/InputField';
import type { PageProps, ResetPasswordData } from '@/types';
import { login } from '@/routes';
import password from '@/routes/password';

interface ResetPasswordProps extends PageProps {
    token: string;
    email?: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm<ResetPasswordData>({
        email: email || '',
        password: '',
        password_confirmation: '',
        token: token,
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(password.update.url());
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
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                        placeholder="seu@email.com"
                    />

                    <InputField
                        label="Nova Senha"
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        required
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        placeholder="••••••••"
                    />

                    <InputField
                        label="Confirmar Nova Senha"
                        type="password"
                        name="password_confirmation"
                        autoComplete="new-password"
                        required
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={errors.password_confirmation}
                        placeholder="••••••••"
                    />

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={processing}
                    >
                        {processing ? (
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
                    <Link href={login.url()} className="link link-primary text-sm">
                        Voltar para o login
                    </Link>
                </div>
            </AuthCard>
        </>
    );
}
