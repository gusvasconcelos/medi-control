import { ReactNode, useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft, LogOut } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { OptimizedImage } from '@/Components/Common/OptimizedImage';

export interface NavItem {
    label: string;
    href?: string;
    icon?: ReactNode;
    active?: boolean;
    section?: boolean;
    children?: NavItem[];
    roles?: string[];
    external?: boolean;
}

interface SidebarProps {
    navItems: NavItem[];
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
    onLogout?: () => void;
    user?: {
        name: string;
        email: string;
    };
}

interface SidebarItemProps {
    item: NavItem;
    level: number;
    isCollapsed: boolean;
}

function SidebarItem({ item, level, isCollapsed }: SidebarItemProps) {
    const [isExpanded, setIsExpanded] = useState(item.active || false);
    const hasChildren = item.children && item.children.length > 0;
    const isSection = item.section;

    if (isSection) {
        if (isCollapsed) {
            return null;
        }
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
                                isCollapsed={isCollapsed}
                            />
                        ))}
                    </ul>
                )}
            </li>
        );
    }

    if (hasChildren && !item.href) {
        if (isCollapsed) {
            return null;
        }
        return (
            <li>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
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
                                isCollapsed={isCollapsed}
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
            ${isCollapsed ? 'justify-center' : ''}
        `;

        if (item.external) {
            return (
                <li>
                    <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClassName}
                        title={isCollapsed ? item.label : undefined}
                    >
                        {item.icon && (
                            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                {item.icon}
                            </span>
                        )}
                        {!isCollapsed && <span className="flex-1">{item.label}</span>}
                    </a>
                </li>
            );
        }

        return (
            <li>
                <Link
                    href={item.href}
                    className={linkClassName}
                    aria-current={item.active ? 'page' : undefined}
                    title={isCollapsed ? item.label : undefined}
                >
                    {item.icon && (
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                            {item.icon}
                        </span>
                    )}
                    {!isCollapsed && <span className="flex-1">{item.label}</span>}
                </Link>
            </li>
        );
    }

    return null;
}

interface CollapsedNavItemProps {
    item: NavItem;
}

interface CollapsedNavItemWithSubmenuProps {
    item: NavItem;
}

function CollapsedNavItemWithSubmenu({ item }: CollapsedNavItemWithSubmenuProps) {
    const [showSubmenu, setShowSubmenu] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const submenuRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (showSubmenu && buttonRef.current && submenuRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const submenu = submenuRef.current;

            // Posiciona o submenu à direita do botão
            submenu.style.left = `${buttonRect.right + 8}px`;
            submenu.style.top = `${buttonRect.top}px`;
        }
    }, [showSubmenu]);

    useEffect(() => {
        if (showTooltip && !showSubmenu && buttonRef.current && tooltipRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const tooltip = tooltipRef.current;

            // Posiciona o tooltip à direita do botão
            tooltip.style.left = `${buttonRect.right + 8}px`;
            tooltip.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
            tooltip.style.transform = 'translateY(-50%)';
        }
    }, [showTooltip, showSubmenu]);

    // Fecha o submenu quando clica fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                submenuRef.current &&
                !submenuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setShowSubmenu(false);
            }
        };

        if (showSubmenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSubmenu]);

    if (!item.children || item.children.length === 0) {
        return null;
    }

    return (
        <li
            className="flex justify-center"
            style={{ position: 'relative' }}
        >
            <button
                ref={buttonRef}
                onClick={() => setShowSubmenu(!showSubmenu)}
                onMouseEnter={() => !showSubmenu && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`
                    flex items-center justify-center w-12 h-12 rounded-lg
                    transition-all duration-200
                    hover:bg-base-200
                    ${item.active ? 'bg-primary/10 text-primary font-medium' : 'text-base-content'}
                `}
                aria-label={item.label}
                aria-expanded={showSubmenu}
            >
                {item.icon && (
                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        {item.icon}
                    </span>
                )}
            </button>
            {showTooltip && !showSubmenu && (
                <div
                    ref={tooltipRef}
                    className="fixed z-[100] bg-base-content text-base-100 text-xs font-medium px-3 py-1.5 rounded shadow-lg pointer-events-none whitespace-nowrap"
                    style={{
                        left: 0,
                        top: 0,
                    }}
                >
                    {item.label}
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-base-content"
                        style={{ left: '-4px' }}
                    />
                </div>
            )}
            {showSubmenu && (
                <div
                    ref={submenuRef}
                    className="fixed z-[100] bg-base-100 border border-base-300 rounded-lg shadow-xl py-2 min-w-[200px]"
                    style={{
                        left: 0,
                        top: 0,
                    }}
                    onMouseLeave={() => setShowSubmenu(false)}
                >
                    <div className="px-3 py-2 border-b border-base-300">
                        <span className="text-xs font-semibold text-base-content/60 uppercase">
                            {item.label}
                        </span>
                    </div>
                    <ul className="menu menu-compact">
                        {item.children.map((child, index) => (
                            <li key={child.href || `${child.label}-${index}`}>
                                {child.href ? (
                                    <Link
                                        href={child.href}
                                        className={`
                                            flex items-center gap-3 px-4 py-2
                                            transition-all duration-200
                                            hover:bg-base-200
                                            ${child.active ? 'bg-primary/10 text-primary font-medium' : 'text-base-content'}
                                        `}
                                        onClick={() => setShowSubmenu(false)}
                                    >
                                        {child.icon && (
                                            <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                                                {child.icon}
                                            </span>
                                        )}
                                        <span className="text-sm">{child.label}</span>
                                    </Link>
                                ) : (
                                    <span className="px-4 py-2 text-sm text-base-content/60">
                                        {child.label}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </li>
    );
}

function CollapsedNavItem({ item }: CollapsedNavItemProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const linkRef = useRef<HTMLAnchorElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (showTooltip && linkRef.current && tooltipRef.current) {
            const linkRect = linkRef.current.getBoundingClientRect();
            const tooltip = tooltipRef.current;

            // Posiciona o tooltip à direita do link
            tooltip.style.left = `${linkRect.right + 8}px`;
            tooltip.style.top = `${linkRect.top + linkRect.height / 2}px`;
            tooltip.style.transform = 'translateY(-50%)';
        }
    }, [showTooltip]);

    return (
        <li
            className="flex justify-center"
            style={{ position: 'relative' }}
        >
            <Link
                ref={linkRef}
                href={item.href!}
                className={`
                    flex items-center justify-center w-12 h-12 rounded-lg
                    transition-all duration-200
                    hover:bg-base-200
                    ${item.active ? 'bg-primary/10 text-primary font-medium' : 'text-base-content'}
                `}
                aria-current={item.active ? 'page' : undefined}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                {item.icon && (
                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        {item.icon}
                    </span>
                )}
            </Link>
            {showTooltip && (
                <div
                    ref={tooltipRef}
                    className="fixed z-[100] bg-base-content text-base-100 text-xs font-medium px-3 py-1.5 rounded shadow-lg pointer-events-none whitespace-nowrap"
                    style={{
                        left: 0,
                        top: 0,
                    }}
                >
                    {item.label}
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-base-content"
                        style={{ left: '-4px' }}
                    />
                </div>
            )}
        </li>
    );
}

export function Sidebar({ navItems, isMobileOpen = false, onMobileClose, onLogout, user }: SidebarProps) {
    // Recupera o estado do localStorage ou usa expandido como padrão
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const savedState = localStorage.getItem('sidebar-collapsed');
        return savedState === 'true';
    });

    // Salva o estado no localStorage sempre que mudar
    const handleToggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebar-collapsed', String(newState));
    };

    // Bloqueia o scroll do body quando a sidebar estiver expandida
    useEffect(() => {
        if (!isCollapsed) {
            // Salva o scroll atual antes de bloquear
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            // Restaura o scroll quando a sidebar for colapsada
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        // Cleanup: restaura o scroll quando o componente for desmontado
        return () => {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        };
    }, [isCollapsed]);

    // Fecha o drawer mobile ao clicar em um link
    const handleLinkClick = () => {
        if (onMobileClose) {
            onMobileClose();
        }
    };

    // Processa nav items para a view colapsada
    // Separa itens com href direto e itens com submenus
    const processNavItemsForCollapsed = (items: NavItem[]): {
        directItems: NavItem[];
        submenuItems: NavItem[];
    } => {
        const directItems: NavItem[] = [];
        const submenuItems: NavItem[] = [];

        items.forEach(item => {
            if (item.section && item.children) {
                item.children.forEach(child => {
                    if (child.href && (!child.children || child.children.length === 0)) {
                        // Item com href direto, sem submenus
                        directItems.push(child);
                    } else if (child.children && child.children.length > 0) {
                        // Item com submenus
                        submenuItems.push(child);
                    }
                });
            } else if (item.href && (!item.children || item.children.length === 0)) {
                directItems.push(item);
            } else if (item.children && item.children.length > 0) {
                submenuItems.push(item);
            }
        });

        return { directItems, submenuItems };
    };

    const { directItems, submenuItems } = processNavItemsForCollapsed(navItems);

    // Sidebar content component (reusable for both desktop and mobile)
    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <>
            {/* Header */}
            {isMobile && user ? (
                <div>
                    <div className="flex items-center p-4">
                        <div className="flex flex-col text-left">
                            <span className="font-semibold text-base-content text-sm">
                                {user.name}
                            </span>
                            <span className="text-base-content/60 text-xs">
                                {user.email}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                // Desktop: Logo and Toggle Button
                <div className={`flex items-center p-6 ${isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'}`}>
                    <Link
                        href="/dashboard"
                        className="hover:opacity-80 transition-opacity"
                        aria-label="Ir para Dashboard"
                    >
                        <OptimizedImage
                            src={isCollapsed ? "/storage/icon.svg" : "/storage/logo.svg"}
                            alt="Logo do MediControl"
                            className="h-8 w-auto"
                            lazy={false}
                        />
                    </Link>
                    {!isCollapsed && (
                        <button
                            onClick={handleToggleCollapse}
                            className="btn btn-ghost btn-sm btn-circle"
                            aria-label="Colapsar sidebar"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}

            {/* Toggle Button when collapsed (desktop only) */}
            {isCollapsed && !isMobile && (
                <div className="px-4 pb-2 flex justify-center">
                    <button
                        onClick={handleToggleCollapse}
                        className="btn btn-ghost btn-sm btn-circle"
                        aria-label="Expandir sidebar"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Navigation Menu */}
            <nav className={`flex-1 py-3 overflow-y-auto ${isCollapsed && !isMobile ? 'px-2' : 'px-4 overflow-x-hidden'}`}>
                {isCollapsed && !isMobile ? (
                    <ul className="menu menu-compact space-y-1">
                        {directItems.map((item, index) => (
                            <CollapsedNavItem key={item.href || `${item.label}-${index}`} item={item} />
                        ))}
                        {submenuItems.map((item, index) => (
                            <CollapsedNavItemWithSubmenu key={`${item.label}-${index}`} item={item} />
                        ))}
                    </ul>
                ) : (
                    <ul className="menu menu-compact space-y-1" onClick={isMobile ? handleLinkClick : undefined}>
                        {navItems.map((item, index) => (
                            <SidebarItem
                                key={item.href || `${item.label}-${index}`}
                                item={item}
                                level={0}
                                isCollapsed={isCollapsed && !isMobile}
                            />
                        ))}
                    </ul>
                )}
            </nav>
            {onLogout && isMobile && (
                <div className="px-4 pb-4 mt-auto mb-4">
                    <button
                        onClick={onLogout}
                        className="btn btn-error btn-sm w-full gap-2"
                        aria-label="Sair"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair
                    </button>
                </div>
            )}
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex bg-base-100 border-r border-base-200 sticky top-0 h-screen flex-col transition-all duration-300 ${
                    isCollapsed ? 'w-20' : 'w-72'
                }`}
                style={isCollapsed ? { overflowY: 'auto', overflowX: 'visible', zIndex: 40 } : {}}
                aria-label="Main navigation"
            >
                <SidebarContent />
            </aside>

            {/* Mobile Drawer */}
            <div className="lg:hidden">
                {/* Overlay */}
                <div
                    className={`fixed inset-0 bg-base-content/50 z-[60] transition-opacity duration-300 ${
                        isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                    onClick={onMobileClose}
                    aria-label="Fechar menu"
                    style={{ top: '4rem' }}
                />

                {/* Drawer */}
                <aside
                    className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-base-100 z-[70] flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out ${
                        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                    aria-label="Main navigation"
                >
                    <SidebarContent isMobile />
                </aside>
            </div>
        </>
    );
}
