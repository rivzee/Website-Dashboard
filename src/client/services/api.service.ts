/**
 * API Service
 * Centralized API service with error handling, interceptors, and retry logic
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/client/config/api.config';

// Custom error class
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if exists
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            if (user) {
                try {
                    const userData = JSON.parse(user);
                    if (userData.token) {
                        config.headers.Authorization = `Bearer ${userData.token}`;
                    }
                } catch (e) {
                    console.error('Failed to parse user data:', e);
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear user data and redirect to login
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                window.location.href = '/login';
            }

            return Promise.reject(new ApiError('Unauthorized', 401));
        }

        // Handle network errors
        if (!error.response) {
            return Promise.reject(
                new ApiError('Network error. Please check your connection.', 0)
            );
        }

        // Handle other errors
        const message = error.response?.data?.message || error.message || 'An error occurred';
        const statusCode = error.response?.status;
        const data = error.response?.data;

        return Promise.reject(new ApiError(message, statusCode, data));
    }
);

// API Service methods
export const apiService = {
    // Generic methods
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await apiClient.get<T>(url, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await apiClient.post<T>(url, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await apiClient.put<T>(url, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await apiClient.patch<T>(url, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await apiClient.delete<T>(url, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    // Specific API methods
    auth: {
        login: (email: string, password: string) =>
            apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, { email, password }),

        register: (data: any) =>
            apiService.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data),

        logout: () =>
            apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT),
    },

    users: {
        getAll: () => {
            console.log('🔵 Fetching all users...');
            return apiService.get<any[]>(API_CONFIG.ENDPOINTS.USERS);
        },
        getById: (id: string) => {
            console.log('🔵 Fetching user:', id);
            return apiService.get(`${API_CONFIG.ENDPOINTS.USERS}/${id}`);
        },
        create: (data: any) => {
            console.log('🔵 Creating user:', data);
            return apiService.post(API_CONFIG.ENDPOINTS.USERS, data);
        },
        update: (id: string, data: any) => {
            console.log('🔵 Updating user:', id, data);
            return apiService.put(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, data);
        },
        delete: (id: string) => {
            console.log('🔵 Deleting user:', id);
            return apiService.delete(`${API_CONFIG.ENDPOINTS.USERS}/${id}`);
        },
    },

    services: {
        getAll: () => {
            console.log('🔵 Fetching all services...');
            return apiService.get<any[]>(API_CONFIG.ENDPOINTS.SERVICES);
        },
        getById: (id: string) => {
            console.log('🔵 Fetching service:', id);
            return apiService.get(`${API_CONFIG.ENDPOINTS.SERVICES}/${id}`);
        },
        create: (data: any) => {
            console.log('🔵 Creating service:', data);
            return apiService.post(API_CONFIG.ENDPOINTS.SERVICES, data);
        },
        update: (id: string, data: any) => {
            console.log('🔵 Updating service:', id, data);
            return apiService.put(`${API_CONFIG.ENDPOINTS.SERVICES}/${id}`, data);
        },
        delete: (id: string) => {
            console.log('🔵 Deleting service:', id);
            return apiService.delete(`${API_CONFIG.ENDPOINTS.SERVICES}/${id}`);
        },
    },

    orders: {
        getAll: () => apiService.get<any[]>(API_CONFIG.ENDPOINTS.ORDERS),
        getById: (id: string) => apiService.get(`${API_CONFIG.ENDPOINTS.ORDERS}/${id}`),
        create: (data: any) => apiService.post(API_CONFIG.ENDPOINTS.ORDERS, data),
        update: (id: string, data: any) => apiService.put(`${API_CONFIG.ENDPOINTS.ORDERS}/${id}`, data),
        delete: (id: string) => apiService.delete(`${API_CONFIG.ENDPOINTS.ORDERS}/${id}`),
    },

    payments: {
        getAll: () => apiService.get(API_CONFIG.ENDPOINTS.PAYMENTS),
        getById: (id: string) => apiService.get(`${API_CONFIG.ENDPOINTS.PAYMENTS}/${id}`),
        create: (data: any) => apiService.post(API_CONFIG.ENDPOINTS.PAYMENTS, data),
    },

    notifications: {
        getAll: () => apiService.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS),
        markAsRead: (id: string) => apiService.patch(`${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/${id}/read`),
        markAllAsRead: () => apiService.patch(`${API_CONFIG.ENDPOINTS.NOTIFICATIONS}/read-all`),
    },

    // Error handler
    handleError(error: unknown): ApiError {
        if (error instanceof ApiError) {
            return error;
        }

        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message || 'An error occurred';
            const statusCode = error.response?.status;
            const data = error.response?.data;
            return new ApiError(message, statusCode, data);
        }

        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return new ApiError(errorMessage);
    },
};

export default apiService;
