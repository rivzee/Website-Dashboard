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

    useEffect(() => {
        if (!enabled || !onSync) return;

        // Initial sync
        onSync();

        // Setup interval
        intervalRef.current = setInterval(() => {
            onSync();
        }, interval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [interval, onSync, enabled]);

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
