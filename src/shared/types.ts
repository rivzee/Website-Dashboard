/**
 * Shared Types & Interfaces
 * Used by both server and client
 */

// User Roles
export enum UserRole {
    ADMIN = 'ADMIN',
    AKUNTAN = 'AKUNTAN',
    KLIEN = 'KLIEN',
}

// User Interface
export interface User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

// Auth Interfaces
export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

// Client Interface
export interface Client {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

// Service Interface
export interface Service {
    id: number;
    name: string;
    description?: string;
    price: number;
    clientId: number;
    createdAt: Date;
    updatedAt: Date;
}

// Payment Status
export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
}

// Payment Interface
export interface Payment {
    id: number;
    amount: number;
    status: PaymentStatus;
    serviceId: number;
    clientId: number;
    dueDate?: Date;
    paidDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// API Response Interface
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Pagination Interface
export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
