import { ReactNode, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Sidebar, NavItem } from '@/Components/Layout/Sidebar';
import { Navbar } from '@/Components/Layout/Navbar';
import { Topbar } from '@/Components/Layout/Topbar';
import { useAuth } from '@/hooks/useAuth';
import { useOneSignal } from '@/hooks/useOneSignal';
import { PageProps } from '@/types';

interface AuthenticatedLayoutProps {
    children: ReactNode;
    navItems?: NavItem[];
}

export function AuthenticatedLayout({
    children,
    navItems = [],
}: AuthenticatedLayoutProps) {
    const { logout } = useAuth();
    const { auth } = usePage<PageProps>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Initialize OneSignal automatically for authenticated users
    useOneSignal({
        enabled: true,
        onSubscribed: (playerId) => {
            console.log('OneSignal subscribed with player ID:', playerId);
        },
        onError: (error) => {
            console.error('OneSignal initialization error:', error);
        },
    });

    const handleMenuClick = () => {
        if (isMobileMenuOpen) {
            // Se o sidebar está aberto, vai para o perfil
            router.visit('/profile');
        } else {
            // Se o sidebar está fechado, abre o sidebar
            setIsMobileMenuOpen(true);
        }
    };

    return (
        <div className="flex min-h-screen">
            {navItems.length > 0 && (
                <Sidebar
                    navItems={navItems}
                    isMobileOpen={isMobileMenuOpen}
                    onMobileClose={() => setIsMobileMenuOpen(false)}
                    onLogout={logout}
                    user={auth?.user}
                />
            )}

            <div className="flex flex-col flex-1 h-screen overflow-hidden">
                {/* Topbar - visible on desktop only */}
                <Topbar auth={auth} onLogout={logout} />

                {/* Navbar - visible on mobile (hidden on desktop where sidebar shows) */}
                <div className="lg:hidden">
                    <Navbar
                        variant="authenticated"
                        auth={auth}
                        onLogout={logout}
                        onMenuClick={handleMenuClick}
                    />
                </div>

                <main className="flex-1 bg-base-200 pt-16 lg:pt-0 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
