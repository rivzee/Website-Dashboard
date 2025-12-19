/**
 * User Preferences Hook
 * Hook for managing user preferences and settings
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
    // Appearance
    theme: 'light' | 'dark' | 'auto';
    compactMode: boolean;
    fontSize: 'small' | 'medium' | 'large';

    // Notifications
    emailNotifications: boolean;
    pushNotifications: boolean;
    notificationSound: boolean;

    // Dashboard
    defaultView: 'grid' | 'list';
    itemsPerPage: number;
    showWelcomeMessage: boolean;

    // Language & Region
    language: 'id' | 'en';
    timezone: string;
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';

    // Privacy
    analyticsEnabled: boolean;
    shareUsageData: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    compactMode: false,
    fontSize: 'medium',
    emailNotifications: true,
    pushNotifications: true,
    notificationSound: true,
    defaultView: 'grid',
    itemsPerPage: 10,
    showWelcomeMessage: true,
    language: 'id',
    timezone: 'Asia/Jakarta',
    dateFormat: 'DD/MM/YYYY',
    analyticsEnabled: true,
    shareUsageData: false,
};

const STORAGE_KEY = 'user-preferences';

export function usePreferences() {
    const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
    const [isLoading, setIsLoading] = useState(true);

    // Load preferences from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
            }
        } catch (error: any) {
            console.error('Failed to load preferences:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Save preferences to localStorage
    const savePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
        setPreferences((prev) => {
            const updated = { ...prev, ...newPreferences };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch (error: any) {
                console.error('Failed to save preferences:', error);
            }
            return updated;
        });
    }, []);

    // Update single preference
    const updatePreference = useCallback(<K extends keyof UserPreferences>(
        key: K,
        value: UserPreferences[K]
    ) => {
        savePreferences({ [key]: value });
    }, [savePreferences]);

    // Reset to defaults
    const resetPreferences = useCallback(() => {
        setPreferences(DEFAULT_PREFERENCES);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error: any) {
            console.error('Failed to reset preferences:', error);
        }
    }, []);

    // Apply theme
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const applyTheme = () => {
            let isDark = false;

            if (preferences.theme === 'dark') {
                isDark = true;
            } else if (preferences.theme === 'auto') {
                isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }

            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        applyTheme();

        // Listen for system theme changes
        if (preferences.theme === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = () => applyTheme();
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        }
    }, [preferences.theme]);

    // Apply font size
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const fontSizes = {
            small: '14px',
            medium: '16px',
            large: '18px',
        };

        document.documentElement.style.fontSize = fontSizes[preferences.fontSize];
    }, [preferences.fontSize]);

    return {
        preferences,
        isLoading,
        updatePreference,
        savePreferences,
        resetPreferences,
    };
}
