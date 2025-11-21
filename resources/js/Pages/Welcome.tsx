import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Navbar } from '@/Components/Layout/Navbar';

export default function Welcome({ auth }: PageProps) {
    // If authenticated, redirect to dashboard
    if (auth?.user) {
        router.visit('/dashboard');
        return null;
    }

    return (
        <>
            <Head title="Bem-vindo" />

            <div className="min-h-screen bg-base-100">
                <Navbar variant="public" auth={auth} />

                {/* Hero Section */}
                <div className="hero min-h-[70vh] bg-base-200">
                    <div className="hero-content text-center">
                        <div className="max-w-4xl">
                            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                                Gerencie seus medicamentos com{' '}
                                <span className="text-primary">inteligência</span> e{' '}
                                <span className="text-primary">segurança</span>
                            </h1>
                            <p className="py-6 text-xl lg:text-2xl text-base-content/80">
                                Uma solução completa para organizar tratamentos, receber alertas
                                personalizados e garantir a adesão ao seu tratamento medicamentoso.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="/register"
                                    className="btn btn-primary btn-lg"
                                >
                                    Começar agora
                                </a>
                                <a
                                    href="/login"
                                    className="btn btn-outline btn-lg"
                                >
                                    Já tenho conta
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <section className="py-16 lg:py-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
                            Por que escolher o MediControl?
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="card bg-base-200 shadow-xl">
                                <figure className="px-10 pt-10">
                                    <img
                                        src="/storage/calendar.png"
                                        alt="Ícone de calendário"
                                        className="w-16 h-16"
                                    />
                                </figure>
                                <div className="card-body items-center text-center">
                                    <h3 className="card-title text-2xl">
                                        Organização Eficiente
                                    </h3>
                                    <p className="text-lg text-base-content/80">
                                        Mantenha todos os seus medicamentos organizados em um só lugar.
                                        Visualize horários, dosagens e duração do tratamento com clareza.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="card bg-base-200 shadow-xl">
                                <figure className="px-10 pt-10">
                                    <img
                                        src="/storage/warning.png"
                                        alt="Ícone de alerta"
                                        className="w-16 h-16"
                                    />
                                </figure>
                                <div className="card-body items-center text-center">
                                    <h3 className="card-title text-2xl">
                                        Alertas Inteligentes
                                    </h3>
                                    <p className="text-lg text-base-content/80">
                                        Receba notificações sobre possíveis interações medicamentosas
                                        verificadas por inteligência artificial.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="card bg-base-200 shadow-xl">
                                <figure className="px-10 pt-10">
                                    <img
                                        src="/storage/caregiver.png"
                                        alt="Ícone de cuidador com o paciente"
                                        className="w-16 h-16"
                                    />
                                </figure>
                                <div className="card-body items-center text-center">
                                    <h3 className="card-title text-2xl">
                                        Gestão de Cuidadores
                                    </h3>
                                    <p className="text-lg text-base-content/80">
                                        Permita que familiares e cuidadores acompanhem seu tratamento
                                        de forma segura e colaborativa.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 4 */}
                            <div className="card bg-base-200 shadow-xl">
                                <figure className="px-10 pt-10">
                                    <img
                                        src="/storage/analytics.png"
                                        alt="Ícone de gráfico"
                                        className="w-16 h-16"
                                    />
                                </figure>
                                <div className="card-body items-center text-center">
                                    <h3 className="card-title text-2xl">
                                        Acompanhamento de Adesão
                                    </h3>
                                    <p className="text-lg text-base-content/80">
                                        Monitore sua adesão ao tratamento com relatórios visuais
                                        e indicadores de progresso.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 5 */}
                            <div className="card bg-base-200 shadow-xl">
                                <figure className="px-10 pt-10">
                                    <img
                                        src="/storage/lock.png"
                                        alt="Ícone de cadeado"
                                        className="w-16 h-16"
                                    />
                                </figure>
                                <div className="card-body items-center text-center">
                                    <h3 className="card-title text-2xl">
                                        Segurança e Privacidade
                                    </h3>
                                    <p className="text-lg text-base-content/80">
                                        Seus dados de saúde protegidos com as melhores práticas
                                        de segurança e criptografia.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 6 */}
                            <div className="card bg-base-200 shadow-xl">
                                <figure className="px-10 pt-10">
                                    <img
                                        src="/storage/robot.png"
                                        alt="Ícone de robô"
                                        className="w-16 h-16"
                                    />
                                </figure>
                                <div className="card-body items-center text-center">
                                    <h3 className="card-title text-2xl">
                                        Assistência por IA
                                    </h3>
                                    <p className="text-lg text-base-content/80">
                                        Conte com inteligência artificial para verificar interações
                                        medicamentosas e oferecer suporte personalizado.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-16 lg:py-24 bg-base-200 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
                            Como funciona
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="badge badge-primary badge-lg text-2xl font-bold mb-4 w-16 h-16">
                                    1
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">
                                    Cadastre-se
                                </h3>
                                <p className="text-lg text-base-content/80">
                                    Crie sua conta gratuitamente em poucos segundos.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="badge badge-primary badge-lg text-2xl font-bold mb-4 w-16 h-16">
                                    2
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">
                                    Adicione seus medicamentos
                                </h3>
                                <p className="text-lg text-base-content/80">
                                    Registre seus medicamentos com horários e dosagens.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="badge badge-primary badge-lg text-2xl font-bold mb-4 w-16 h-16">
                                    3
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">
                                    Receba alertas
                                </h3>
                                <p className="text-lg text-base-content/80">
                                    Mantenha-se informado sobre seu tratamento automaticamente.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <div className="hero py-16 lg:py-24 bg-base-100">
                    <div className="hero-content text-center">
                        <div className="max-w-4xl">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                                Pronto para começar?
                            </h2>
                            <p className="text-xl lg:text-2xl mb-8 text-base-content/80">
                                Comece a gerenciar seus medicamentos de forma inteligente hoje mesmo.
                            </p>
                            <a
                                href="/register"
                                className="btn btn-primary btn-lg"
                            >
                                Criar conta gratuita
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="footer footer-center p-10 bg-base-200 text-base-content">
                    <aside>
                        <p className="font-bold text-lg">MediControl</p>
                        <p>Gestão inteligente de medicamentos</p>
                    </aside>
                    <aside>
                        <p className="text-sm text-base-content/60">
                            © {new Date().getFullYear()} MediControl. Todos os direitos reservados.
                        </p>
                    </aside>
                </footer>
            </div>
        </>
    );
}
