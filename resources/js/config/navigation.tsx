import {
    Home,
    Calendar,
    Pill,
    Settings,
    Bell,
    FileText,
    Users,
    Monitor,
    Activity,
    Gauge,
    ExternalLink,
    Zap,
} from 'lucide-react';
import { NavItem } from '@/Components/Layout/Sidebar';

function setActiveRoute(items: NavItem[], currentPath: string): NavItem[] {
    return items.map(item => {
        const isActive = item.href === currentPath;

        if (item.children) {
            return {
                ...item,
                active: isActive,
                children: setActiveRoute(item.children, currentPath)
            };
        }

        return {
            ...item,
            active: isActive
        };
    });
}

function hasPermission(item: NavItem, userRoles?: string[]): boolean {
    if (!item.roles || item.roles.length === 0) {
        return true;
    }

    if (!userRoles || userRoles.length === 0) {
        return false;
    }

    return item.roles.some(role => userRoles.includes(role));
}

function filterByPermissions(items: NavItem[], userRoles?: string[]): NavItem[] {
    return items
        .filter(item => hasPermission(item, userRoles))
        .map(item => {
            if (item.children) {
                const filteredChildren = filterByPermissions(item.children, userRoles);

                if (filteredChildren.length === 0) {
                    return null;
                }

                return {
                    ...item,
                    children: filteredChildren
                };
            }
            return item;
        })
        .filter((item): item is NavItem => item !== null);
}

export function getNavigationItems(currentPath: string = '/dashboard', userRoles?: string[]): NavItem[] {
    const filteredItems = filterByPermissions(mainNavigationItems, userRoles);
    return setActiveRoute(filteredItems, currentPath);
}

export const mainNavigationItems: NavItem[] = [
    {
        label: 'Principal',
        section: true,
        children: [
            {
                label: 'Dashboard',
                href: '/dashboard',
                icon: <Home className="w-5 h-5" />,
                active: true,
            },
            {
                label: 'Medicamentos',
                href: '/medications',
                icon: <Pill className="w-5 h-5" />,
                active: false,
            },
            {
                label: 'Calendário',
                href: '/calendar',
                icon: <Calendar className="w-5 h-5" />,
                active: false,
            },
            {
                label: 'Lembretes',
                href: '/reminders',
                icon: <Bell className="w-5 h-5" />,
                active: false,
            },
            {
                label: 'Relatórios',
                href: '/reports',
                icon: <FileText className="w-5 h-5" />,
                active: false,
            }
        ],
    },
    {
        label: 'Sistema',
        section: true,
        roles: ['super-admin'],
        children: [
            {
                label: 'Usuários',
                href: '/users',
                icon: <Users className="w-5 h-5" />,
                active: false,
            },
            {
                label: 'Métricas',
                href: '/metrics/overview',
                icon: <Activity className="w-5 h-5" />,
                active: false,
            },
            {
                label: 'Monitoramento',
                icon: <Monitor className="w-5 h-5" />,
                active: false,
                children: [
                    {
                        label: 'Pulse',
                        href: '/monitoring/pulse',
                        icon: <Zap className="w-5 h-5" />,
                        active: false,
                    },
                    {
                        label: 'Horizon',
                        href: '/monitoring/horizon',
                        icon: <Gauge className="w-5 h-5" />,
                        active: false,
                    },
                ],
            },
            {
                label: 'Configurações',
                href: '/settings',
                icon: <Settings className="w-5 h-5" />,
                active: false,
            },
        ],
    },
];
