import {
    Home,
    Calendar,
    Pill,
    Settings,
    Bell,
    FileText,
    Users,
    Activity,
    Plus,
    List,
    Clock,
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

export function getNavigationItems(currentPath: string = '/dashboard'): NavItem[] {
    return setActiveRoute(mainNavigationItems, currentPath);
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
        children: [
            {
                label: 'Usuários',
                href: '/users',
                icon: <Users className="w-5 h-5" />,
                active: false,
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
