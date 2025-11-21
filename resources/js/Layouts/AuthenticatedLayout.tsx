import { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { Sidebar, NavItem } from '@/Components/Layout/Sidebar';
import { Navbar } from '@/Components/Layout/Navbar';
import { Toolbar } from '@/Components/Layout/Toolbar';
import { useAuth } from '@/hooks/useAuth';
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

    return (
        <div className="flex min-h-screen">
            {navItems.length > 0 && (
                <div className="hidden lg:block">
                    <Sidebar navItems={navItems} onLogout={logout} />
                </div>
            )}

            <div className="flex flex-col flex-1 min-h-screen">
                {/* Navbar - visible on mobile (hidden on desktop where sidebar shows) */}
                <div className="lg:hidden">
                    <Navbar
                        variant="authenticated"
                        auth={auth}
                        onLogout={logout}
                    />
                </div>

                <main className="flex-1 pb-20 lg:pb-0 bg-base-200">
                    {children}
                </main>

                {navItems.length > 0 && <Toolbar navItems={navItems} />}
            </div>
        </div>
    );
}
