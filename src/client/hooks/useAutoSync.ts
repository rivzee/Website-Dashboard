/**
 * Auto Sync Hook
 * Automatically refetch data at intervals to keep client and admin in sync
 */

import { useEffect, useRef } from 'react';

interface AutoSyncOptions {
    interval?: number; // in milliseconds, default 30s
    onSync?: () => void | Promise<void>;
    enabled?: boolean;
}

export function useAutoSync({ interval = 30000, onSync, enabled = true }: AutoSyncOptions) {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const savedCallback = useRef(onSync);

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = onSync;
    }, [onSync]);

    useEffect(() => {
        if (!enabled) return;

        // Initial sync
        if (savedCallback.current) savedCallback.current();

        // Setup interval
        intervalRef.current = setInterval(() => {
            if (savedCallback.current) savedCallback.current();
        }, interval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [interval, enabled]);

    // Manual sync function
    const sync = () => {
        if (onSync) {
            onSync();
        }
    };

    return { sync };
}

/**
 * Example usage:
 * 
 * const { sync } = useAutoSync({
 *     interval: 30000, // 30 seconds
 *     onSync: fetchData,
 *     enabled: true
 * });
 * 
 * // Manual sync when needed
 * <button onClick={sync}>Refresh</button>
 */
