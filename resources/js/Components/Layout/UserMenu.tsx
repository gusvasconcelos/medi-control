import { User } from '@/types';

interface UserMenuProps {
    user: User;
    onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
    const userInitial = user.name.charAt(0).toUpperCase();

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar placeholder"
                aria-label="Menu do usuário"
            >
                <div className="bg-primary text-primary-content w-10 rounded-full">
                    <span className="text-xl">{userInitial}</span>
                </div>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-300"
            >
                <li className="menu-title">
                    <span className="text-base-content">{user.name}</span>
                    <span className="text-base-content/60 text-xs font-normal">
                        {user.email}
                    </span>
                </li>
                <li>
                    <button onClick={onLogout} className="text-error">
                        Sair
                    </button>
                </li>
            </ul>
        </div>
    );
}
