import { NavItem } from './Sidebar';

interface ToolbarProps {
    navItems: NavItem[];
}

function flattenNavItems(items: NavItem[]): NavItem[] {
    const flattened: NavItem[] = [];

    items.forEach((item) => {
        if (item.section && item.children) {
            // Flatten section children
            flattened.push(...item.children.filter((child) => child.href));
        } else if (item.href) {
            // Add items with href (non-expandable or direct links)
            flattened.push(item);
        }
    });

    return flattened;
}

export function Toolbar({ navItems }: ToolbarProps) {
    const flattenedItems = flattenNavItems(navItems);

    // Limit to first 5 items for mobile toolbar
    const toolbarItems = flattenedItems.slice(0, 5);

    return (
        <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-50 bg-base-100 border-t border-base-300 safe-area-inset-bottom">
            <div className="flex items-center justify-around h-20 px-2">
                {toolbarItems.map((item, index) => (
                    <a
                        key={item.href || index}
                        href={item.href}
                        className={`
                            flex flex-col items-center justify-center gap-1
                            flex-1 h-full rounded-lg transition-colors
                            ${
                                item.active
                                    ? 'text-primary'
                                    : 'text-base-content/60 hover:text-base-content'
                            }
                        `}
                    >
                        <span className="w-6 h-6 flex items-center justify-center">
                            {item.icon}
                        </span>
                        <span className="text-xs font-medium">
                            {item.label}
                        </span>
                    </a>
                ))}
            </div>
        </nav>
    );
}
