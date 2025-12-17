/**
 * Shared Constants
 * Used by both server and client
 */

// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
    TIMEOUT: 30000,
    VERSION: 'v1',
};

// Application Routes
export const ROUTES = {
    // Auth
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',

    // Dashboard
    DASHBOARD: '/dashboard',
    ADMIN_DASHBOARD: '/dashboard/admin',
    AKUNTAN_DASHBOARD: '/dashboard/akuntan',
    KLIEN_DASHBOARD: '/dashboard/klien',

    // Features
    CLIENTS: '/dashboard/clients',
    SERVICES: '/dashboard/services',
    PAYMENTS: '/dashboard/payments',
    ACCOUNTS: '/dashboard/accounts',
};

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        GOOGLE: '/api/auth/google',
        PROFILE: '/api/auth/profile',
    },

    // Users
    USERS: {
        BASE: '/api/users',
        BY_ID: (id: number) => `/api/users/${id}`,
    },

    // Clients
    CLIENTS: {
        BASE: '/api/orders/clients',
        BY_ID: (id: number) => `/api/orders/clients/${id}`,
    },

    // Services
    SERVICES: {
        BASE: '/api/services',
        BY_ID: (id: number) => `/api/services/${id}`,
        BY_CLIENT: (clientId: number) => `/api/services/client/${clientId}`,
    },

    // Payments
    PAYMENTS: {
        BASE: '/api/payments',
        BY_ID: (id: number) => `/api/payments/${id}`,
        BY_CLIENT: (clientId: number) => `/api/payments/client/${clientId}`,
    },
};

// Pagination Defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};

// Date Formats
export const DATE_FORMATS = {
    DISPLAY: 'dd MMM yyyy',
    DISPLAY_WITH_TIME: 'dd MMM yyyy HH:mm',
    API: 'yyyy-MM-dd',
    API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss",
};

// Status Colors
export const STATUS_COLORS = {
    PENDING: '#FFA500',
    PAID: '#4CAF50',
    CANCELLED: '#F44336',
};

// Role Permissions
export const ROLE_PERMISSIONS = {
    ADMIN: ['*'], // All permissions
    AKUNTAN: [
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
    KLIEN: [
        'services:read',
        'payments:read',
    ],
};
