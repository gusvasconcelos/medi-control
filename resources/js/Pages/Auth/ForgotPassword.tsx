import { FormEvent, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { AuthCard } from '@/Components/Auth/AuthCard';
import { InputField } from '@/Components/Auth/InputField';
import { useToast } from '@/hooks/useToast';
import type { PageProps, ForgotPasswordData } from '@/types';

export default function ForgotPassword({ }: PageProps) {
    const { showSuccess, showError } = useToast();
    const [formData, setFormData] = useState<ForgotPasswordData>({
        email: '',
    });
    const [errors, setErrors] = useState<Partial<ForgotPasswordData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            const response = await axios.post<{ message: string }>('/api/v1/auth/forgot-password', formData);
            showSuccess(response.data.message);
            setFormData({ email: '' });
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
                showError(error.response.data.message);
            } else {
                showError('Ocorreu um erro ao enviar o link de recuperação. Tente novamente.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Esqueci Minha Senha" />

            <AuthCard
                title="Esqueceu a senha?"
                subtitle="Sem problemas! Vamos te ajudar a recuperar 🔐"
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

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
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
                    <Link href="/login" className="link link-primary text-sm">
                        Voltar para o login
                    </Link>
                </div>
            </AuthCard>
        </>
    );
}
