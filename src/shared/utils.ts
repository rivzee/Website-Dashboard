/**
 * Shared Utility Functions
 * Used by both server and client
 */

import { UserRole } from './types';

/**
 * Format currency to IDR
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string, format: string = 'dd MMM yyyy'): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('id-ID', { month: 'short' });
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return format
        .replace('dd', day)
        .replace('MMM', month)
        .replace('yyyy', String(year))
        .replace('HH', hours)
        .replace('mm', minutes);
}

/**
 * Check if user has permission
 */
export function hasPermission(userRole: UserRole, permission: string): boolean {
    if (userRole === UserRole.ADMIN) return true;

    const rolePermissions: Record<UserRole, string[]> = {
        [UserRole.ADMIN]: ['*'],
        [UserRole.AKUNTAN]: [
            'clients:read',
            'clients:create',
            'clients:update',
            'clients:delete',
            'services:read',
            'services:create',
            'services:update',
            'services:delete',
            'payments:read',
            'payments:create',
            'payments:update',
        ],
        [UserRole.KLIEN]: [
            'services:read',
            'payments:read',
        ],
    };

    return rolePermissions[userRole]?.includes(permission) || false;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (Indonesian format)
 */
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Generate random string
 */
export function generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}
