// hooks/useBackendStatus.ts
import { useState, useEffect } from 'react';

type BackendStatus = 'checking' | 'up' | 'down';

export const useBackendStatus = (backendUrl: string | undefined) => {
    const [status, setStatus] = useState<BackendStatus>('checking');

    useEffect(() => {
        const checkBackend = async () => {
            if (!backendUrl) {
                console.error('Backend URL is not defined');
                setStatus('down');
                return;
            }

            try {
                const response = await fetch(backendUrl);
                setStatus(response.ok || response.status === 404 ? 'up' : 'down');
            } catch (error) {
                console.error('Backend check failed:', error);
                setStatus('down');
            }
        };

        checkBackend();
        const intervalId = setInterval(checkBackend, 30000);
        return () => clearInterval(intervalId);
    }, [backendUrl]);

    return status;
};