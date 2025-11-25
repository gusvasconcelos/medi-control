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
    Zap,
    Shield,
    Key,
    Heart,
    UserCheck,
    MessageCircle,
    User,
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

function extractRoleNames(roles: any[]): string[] {
    if (!Array.isArray(roles)) {
        return [];
    }
    return roles.map(r => typeof r === 'string' ? r : r?.name || r);
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

export function getNavigationItems(currentPath: string = '/dashboard', userRoles?: string[] | any[]): NavItem[] {
    const roleNames = userRoles ? extractRoleNames(userRoles) : undefined;
    const filteredItems = filterByPermissions(mainNavigationItems, roleNames);
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
                showInToolbar: true,
            },
            {
                label: 'Chat',
                href: '/chat',
                icon: <MessageCircle className="w-5 h-5" />,
                active: false,
                showInToolbar: true,
            },
            {
                label: 'Medicamentos',
                href: '/medications',
                icon: <Pill className="w-5 h-5" />,
                active: false,
                roles: ['super-admin', 'admin'],
            },
            {
                label: 'Cuidadores',
                href: '/my-caregivers',
                icon: <Heart className="w-5 h-5" />,
                active: false,
                roles: ['super-admin', 'patient'],
                showInToolbar: true,
            },
            {
                label: 'Pacientes',
                href: '/my-patients',
                icon: <UserCheck className="w-5 h-5" />,
                active: false,
                roles: ['super-admin', 'caregiver'],
                showInToolbar: true,
            },
            {
                label: 'Relatórios',
                href: '/reports',
                icon: <FileText className="w-5 h-5" />,
                active: false,
                showInToolbar: true,
            },
        ],
    },
    {
        label: 'Sistema',
        section: true,
        children: [
            {
                label: 'Usuários',
                href: '/users',
                icon: <Users className="w-5 h-5" />,
                roles: ['super-admin'],
                active: false,
            },
            {
                label: 'Métricas',
                href: '/metrics/overview',
                icon: <Activity className="w-5 h-5" />,
                roles: ['super-admin'],
                active: false,
            },
            {
                label: 'Monitoramento',
                icon: <Monitor className="w-5 h-5" />,
                roles: ['super-admin'],
                active: false,
                children: [
                    {
                        label: 'Pulse',
                        href: '/monitoring/pulse',
                        icon: <Zap className="w-5 h-5" />,
                        roles: ['super-admin'],
                        active: false,
                    },
                    {
                        label: 'Horizon',
                        href: '/monitoring/horizon',
                        icon: <Gauge className="w-5 h-5" />,
                        roles: ['super-admin'],
                        active: false,
                    },
                ],
            },
            {
                label: 'Configurações',
                icon: <Settings className="w-5 h-5" />,
                active: false,
                children: [
                    {
                        label: 'Notificações',
                        href: '/settings/notifications',
                        icon: <Bell className="w-5 h-5" />,
                        active: false,
                    },
                    {
                        label: 'Perfil',
                        href: '/settings/profile',
                        icon: <User className="w-5 h-5" />,
                        active: false,
                        roles: ['super-admin', 'admin', 'patient', 'caregiver'],
                        showInToolbar: true,
                    },
                    {
                        label: 'Permissões',
                        href: '/settings/permissions',
                        icon: <Shield className="w-5 h-5" />,
                        active: false,
                        roles: ['super-admin'],
                    },
                    {
                        label: 'Cargos',
                        href: '/settings/roles',
                        icon: <Key className="w-5 h-5" />,
                        active: false,
                        roles: ['super-admin'],
                    },
                ],
            },
        ],
    },
];
