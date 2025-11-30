/**
 * Permissions System
 * Advanced role-based access control (RBAC)
 */

export type Permission =
    // User permissions
    | 'users:view'
    | 'users:create'
    | 'users:edit'
    | 'users:delete'
    // Order permissions
    | 'orders:view'
    | 'orders:create'
    | 'orders:edit'
    | 'orders:delete'
    | 'orders:approve'
    // Service permissions
    | 'services:view'
    | 'services:create'
    | 'services:edit'
    | 'services:delete'
    // Payment permissions
    | 'payments:view'
    | 'payments:create'
    | 'payments:approve'
    // Report permissions
    | 'reports:view'
    | 'reports:export'
    | 'reports:create'
    // Settings permissions
    | 'settings:view'
    | 'settings:edit'
    // Analytics permissions
    | 'analytics:view'
    | 'analytics:export';

export type Role = 'ADMIN' | 'AKUNTAN' | 'KLIEN' | 'SUPER_ADMIN';

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    SUPER_ADMIN: [
        // All permissions
        'users:view',
        'users:create',
        'users:edit',
        'users:delete',
        'orders:view',
        'orders:create',
        'orders:edit',
        'orders:delete',
        'orders:approve',
        'services:view',
        'services:create',
        'services:edit',
        'services:delete',
        'payments:view',
        'payments:create',
        'payments:approve',
        'reports:view',
        'reports:export',
        'reports:create',
        'settings:view',
        'settings:edit',
        'analytics:view',
        'analytics:export',
    ],
    ADMIN: [
        'users:view',
        'users:create',
        'users:edit',
        'orders:view',
        'orders:create',
        'orders:edit',
        'orders:delete',
        'orders:approve',
        'services:view',
        'services:create',
        'services:edit',
        'services:delete',
        'payments:view',
        'payments:create',
        'payments:approve',
        'reports:view',
        'reports:export',
        'reports:create',
        'settings:view',
        'analytics:view',
        'analytics:export',
    ],
    AKUNTAN: [
        'orders:view',
        'orders:edit',
        'services:view',
        'payments:view',
        'reports:view',
        'reports:export',
        'reports:create',
    ],
    KLIEN: [
        'orders:view',
        'orders:create',
        'services:view',
        'payments:view',
        'payments:create',
    ],
};

export class PermissionService {
    private userRole: Role;
    private customPermissions: Permission[];

    constructor(role: Role, customPermissions: Permission[] = []) {
        this.userRole = role;
        this.customPermissions = customPermissions;
    }

    /**
     * Check if user has a specific permission
     */
    hasPermission(permission: Permission): boolean {
        const rolePermissions = ROLE_PERMISSIONS[this.userRole] || [];
        return rolePermissions.includes(permission) || this.customPermissions.includes(permission);
    }

    /**
     * Check if user has all of the specified permissions
     */
    hasAllPermissions(permissions: Permission[]): boolean {
        return permissions.every((permission) => this.hasPermission(permission));
    }

    /**
     * Check if user has any of the specified permissions
     */
    hasAnyPermission(permissions: Permission[]): boolean {
        return permissions.some((permission) => this.hasPermission(permission));
    }

    /**
     * Get all permissions for the user
     */
    getAllPermissions(): Permission[] {
        const rolePermissions = ROLE_PERMISSIONS[this.userRole] || [];
        return [...new Set([...rolePermissions, ...this.customPermissions])];
    }

    /**
     * Check if user can perform an action on a resource
     */
    can(action: string, resource: string): boolean {
        const permission = `${resource}:${action}` as Permission;
        return this.hasPermission(permission);
    }
}

/**
 * Create permission service instance
 */
export function createPermissionService(role: Role, customPermissions: Permission[] = []): PermissionService {
    return new PermissionService(role, customPermissions);
}
