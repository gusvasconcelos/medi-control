import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useToast } from '@/hooks/useToast';
import type { PageProps } from '@/types';

export const FlashMessages: React.FC = () => {
    const { flash } = usePage<PageProps>().props;
    const { showSuccess, showError, showWarning, showInfo } = useToast();

    useEffect(() => {
        if (flash?.success) {
            showSuccess(flash.success);
        }
        if (flash?.error) {
            showError(flash.error);
        }
        if (flash?.warning) {
            showWarning(flash.warning);
        }
        if (flash?.info) {
            showInfo(flash.info);
        }
    }, [flash, showSuccess, showError, showWarning, showInfo]);

    return null;
};
