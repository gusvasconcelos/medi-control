import { PageProps } from '@/types';
import { UserMenu } from './UserMenu';
import { NotificationDropdown } from './NotificationDropdown';

interface TopbarProps {
    auth?: PageProps['auth'];
    onLogout?: () => void;
}

export function Topbar({ auth, onLogout }: TopbarProps) {
    if (!auth?.user || !onLogout) {
        return null;
    }

    return (
        <header className="hidden lg:flex items-center justify-end gap-4 px-6 py-4 bg-base-100 border-b border-base-200 sticky top-0 z-30">
            <div className="flex items-center gap-6">
                <NotificationDropdown />
                <UserMenu user={auth.user} onLogout={onLogout} />
            </div>
        </header>
    );
}

