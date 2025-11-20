import { PageProps } from '@/types';
import { UserMenu } from './UserMenu';

export interface NavbarProps {
    variant: 'public' | 'auth' | 'authenticated';
    auth?: PageProps['auth'];
    onLogout?: () => void;
}

export function Navbar({ variant, auth, onLogout }: NavbarProps) {
    const logoHref = variant === 'authenticated' ? '/dashboard' : '/';

    return (
        <nav className="navbar bg-base-100 border-b border-base-300 px-4 lg:px-8 sticky top-0 z-50">
            <div className="navbar-start">
                <a href={logoHref}>
                    <img
                        src="/storage/logo.svg"
                        alt="Logo do MediControl"
                        className="h-8 w-auto hover:opacity-80 transition-opacity"
                    />
                </a>
            </div>

            <div className="navbar-end">
                {variant === 'public' && (
                    <div className="gap-2 flex">
                        <a href="/login" className="btn btn-ghost">
                            Entrar
                        </a>
                        <a href="/register" className="btn btn-primary">
                            Cadastrar
                        </a>
                    </div>
                )}

                {variant === 'authenticated' && auth?.user && onLogout && (
                    <UserMenu user={auth.user} onLogout={onLogout} />
                )}
            </div>
        </nav>
    );
}
