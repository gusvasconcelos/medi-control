import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AuthCard } from '@/Components/Auth/AuthCard';
import { InputField } from '@/Components/Auth/InputField';
import type { PageProps, ForgotPasswordData } from '@/types';
import { login } from '@/routes';
import password from '@/routes/password';

export default function ForgotPassword({ }: PageProps) {
    const { data, setData, post, processing, errors, wasSuccessful, reset } = useForm<ForgotPasswordData>({
        email: '',
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(password.email.url(), {
            onSuccess: () => {
                reset('email');
            },
        });
    };

    return (
        <>
            <Head title="Esqueci Minha Senha" />

            <AuthCard
                title="Esqueceu a senha?"
                subtitle="Sem problemas! Vamos te ajudar a recuperar 🔐"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {wasSuccessful && (
                        <div className="alert alert-success">
                            <span>Link de recuperação enviado! Verifique seu email.</span>
                        </div>
                    )}

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

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Enviando...
                            </>
                        ) : (
                            'Enviar Link de Recuperação'
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link href={login.url()} className="link link-primary text-sm">
                        Voltar para o login
                    </Link>
                </div>
            </AuthCard>
        </>
    );
}
