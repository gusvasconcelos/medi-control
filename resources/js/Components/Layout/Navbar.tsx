import { PageProps } from '@/types';
import { NotificationDropdown } from './NotificationDropdown';
import { UserMenu } from './UserMenu';
import { Avatar } from '@/Components/Common/Avatar';
import { OptimizedImage } from '@/Components/Common/OptimizedImage';

export interface NavbarProps {
    variant: 'public' | 'auth' | 'authenticated';
    auth?: PageProps['auth'];
    onLogout?: () => void;
    onMenuClick?: () => void;
}

export function Navbar({ variant, auth, onLogout, onMenuClick }: NavbarProps) {
    const logoHref = variant === 'authenticated' ? '/dashboard' : '/';
    const logoPosition = variant === 'authenticated' ? 'center' : 'start';

    const profilePhotoUrl = auth?.user?.profile_photo_url;

    return (
        <nav className="navbar bg-base-100 border-b border-base-300 px-4 lg:px-8 fixed top-0 left-0 right-0 z-[9999]">
            <div className="navbar-start">
                {variant === 'authenticated' && onMenuClick && auth?.user && (
                    <button
                        onClick={onMenuClick}
                        className="btn btn-ghost btn-circle avatar lg:hidden"
                        aria-label="Abrir menu"
                    >
                        <Avatar
                            src={profilePhotoUrl}
                            alt={auth.user.name}
                            name={auth.user.name}
                            size="md"
                        />
                    </button>
                )}
                {variant !== 'authenticated' && (
                    <a href={logoHref}>
                        <OptimizedImage
                            src="/storage/logo.svg"
                            alt="Logo do MediControl"
                            className="h-8 w-auto hover:opacity-80 transition-opacity"
                            lazy={false}
                        />
                    </a>
                )}
            </div>

            {variant === 'authenticated' && (
                <div className={`navbar-${logoPosition}`}>
                    <a href={logoHref}>
                        <OptimizedImage
                            src="/storage/logo.svg"
                            alt="Logo do MediControl"
                            className="h-12 w-auto hover:opacity-80 transition-opacity"
                            lazy={false}
                        />
                    </a>
                </div>
            )}
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
                    <div className="flex items-center gap-4">
                        <NotificationDropdown />
                        <div className="hidden lg:block">
                            <UserMenu user={auth.user} onLogout={onLogout} />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
