import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function useAuthInit() {
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        const cleanup = initialize();
        return cleanup;
    }, [initialize]);
}
