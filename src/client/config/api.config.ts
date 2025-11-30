/**
 * API Configuration
 * Centralized configuration for API calls with environment variables
 */

export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),

    // Endpoints
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
            REFRESH: '/auth/refresh',
        },
        USERS: '/users',
        SERVICES: '/services',
        ORDERS: '/orders',
        PAYMENTS: '/payments',
        NOTIFICATIONS: '/notifications',
    },

    // Security
    MAX_FILE_SIZE: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760'), // 10MB
    ALLOWED_FILE_TYPES: (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg,application/pdf').split(','),
};

export const APP_CONFIG = {
    NAME: process.env.NEXT_PUBLIC_APP_NAME || 'RISA BUR',
    VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    ENABLE_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
};
