import { Link } from '@inertiajs/react';
import { UserCircle, LogOut } from 'lucide-react';
import { User } from '@/types';
import { Avatar } from '@/Components/Common/Avatar';

interface UserMenuProps {
    user: User;
    onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar placeholder"
                aria-label="Menu do usuário"
            >
                <Avatar
                    src={user.profile_photo_url}
                    alt={user.name}
                    name={user.name}
                    size="lg"
                />
            </div>
            <ul
                tabIndex={0}
                className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-64 p-3 shadow-lg border border-base-300"
            >
                <li className="menu-title">
                    <span className="text-base-content">{user.name}</span>
                    <span className="text-base-content/60 text-xs font-normal">
                        {user.email}
                    </span>
                </li>
                <div className="divider my-1" />
                <li>
                    <Link href="/profile" className="flex items-center gap-2">
                        <UserCircle className="w-4 h-4" />
                        Meu Perfil
                    </Link>
                </li>
                <li>
                    <button onClick={onLogout} className="text-error flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Sair
                    </button>
                </li>
            </ul>
        </div>
    );
}
