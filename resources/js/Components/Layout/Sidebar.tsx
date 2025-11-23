import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { NotificationDropdown } from './NotificationDropdown';

export interface NavItem {
    label: string;
    href?: string;
    icon?: ReactNode;
    active?: boolean;
    section?: boolean;
    children?: NavItem[];
    roles?: string[];
    external?: boolean;
    showInToolbar?: boolean;
}

interface SidebarProps {
    navItems: NavItem[];
    onLogout?: () => void;
}

interface SidebarItemProps {
    item: NavItem;
    level: number;
}

function SidebarItem({ item, level }: SidebarItemProps) {
    const [isExpanded, setIsExpanded] = useState(item.active || false);
    const hasChildren = item.children && item.children.length > 0;
    const isSection = item.section;

    if (isSection) {
        return (
            <li>
                <div className="menu-title text-xs font-semibold text-base-content/60 uppercase tracking-wider px-4 py-2">
                    {item.label}
                </div>
                {hasChildren && (
                    <ul className="mb-2">
                        {item.children!.map((child, index) => (
                            <SidebarItem
                                key={child.href || `${child.label}-${index}`}
                                item={child}
                                level={level + 1}
                            />
                        ))}
                    </ul>
                )}
            </li>
        );
    }

    if (hasChildren && !item.href) {
        return (
            <li>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200
                        hover:bg-base-200
                        ${item.active ? 'bg-primary/10 text-primary font-medium' : 'text-base-content'}
                    `}
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.label} submenu`}
                >
                    {item.icon && (
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                            {item.icon}
                        </span>
                    )}
                    <span className="flex-1 text-left">{item.label}</span>
                    <span className="flex-shrink-0 transition-transform duration-200">
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </span>
                </button>

                {isExpanded && hasChildren && (
                    <ul className="ml-4 mt-1 space-y-1 border-l-2 border-base-300 pl-2">
                        {item.children!.map((child, index) => (
                            <SidebarItem
                                key={child.href || `${child.label}-${index}`}
                                item={child}
                                level={level + 1}
                            />
                        ))}
                    </ul>
                )}
            </li>
        );
    }

    if (item.href) {
        const linkClassName = `
            flex items-center gap-3 px-4 py-3 rounded-lg
            transition-all duration-200
            hover:bg-base-200
            ${item.active ? 'bg-primary/10 text-primary font-medium' : 'text-base-content'}
            ${level > 1 ? 'text-sm' : ''}
        `;

        if (item.external) {
            return (
                <li>
                    <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClassName}
                    >
                        {item.icon && (
                            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                {item.icon}
                            </span>
                        )}
                        <span className="flex-1">{item.label}</span>
                    </a>
                </li>
            );
        }

        return (
            <li>
                <a
                    href={item.href}
                    className={linkClassName}
                    aria-current={item.active ? 'page' : undefined}
                >
                    {item.icon && (
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                            {item.icon}
                        </span>
                    )}
                    <span className="flex-1">{item.label}</span>
                </a>
            </li>
        );
    }

    return null;
}

export function Sidebar({ navItems, onLogout }: SidebarProps) {
    return (
        <aside
            className="bg-base-100 border-r border-base-200 sticky top-0 h-screen flex flex-col w-72"
            aria-label="Main navigation"
        >
            {/* Logo and Notifications */}
            <div className="flex justify-between items-center p-6">
                <Link
                    href="/dashboard"
                    className="hover:opacity-80 transition-opacity"
                    aria-label="Ir para Dashboard"
                >
                    <img
                        src="/storage/logo.svg"
                        alt="Logo do MediControl"
                        className="h-8 w-auto"
                    />
                </Link>
                <NotificationDropdown />
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3">
                <ul className="menu menu-compact space-y-1">
                    {navItems.map((item, index) => (
                        <SidebarItem
                            key={item.href || `${item.label}-${index}`}
                            item={item}
                            level={0}
                        />
                    ))}
                </ul>
            </nav>

            {/* Bottom Section - Logout */}
            <div className="p-4">
                <ul className="menu space-y-1">
                    {onLogout && (
                        <li>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-base-200 text-base-content"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Sair</span>
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </aside>
    );
}
