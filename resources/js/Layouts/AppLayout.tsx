import { ReactNode } from 'react';
import { FlashMessages } from '@/Components/FlashMessages';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <>
            <FlashMessages />
            {children}
        </>
    );
}
