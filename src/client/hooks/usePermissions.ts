/**
 * Permissions Hook
 * Hook for checking user permissions
 */

'use client';

import { useMemo } from 'react';
import { createPermissionService, Permission, Role } from '@/client/utils/permissions';

interface User {
    role: Role;
    customPermissions?: Permission[];
}

export function usePermissions(user: User | null) {
    const permissionService = useMemo(() => {
        if (!user) return null;
        return createPermissionService(user.role, user.customPermissions);
    }, [user]);

    const hasPermission = (permission: Permission): boolean => {
        if (!permissionService) return false;
        return permissionService.hasPermission(permission);
    };

    const hasAllPermissions = (permissions: Permission[]): boolean => {
        if (!permissionService) return false;
        return permissionService.hasAllPermissions(permissions);
    };

    const hasAnyPermission = (permissions: Permission[]): boolean => {
        if (!permissionService) return false;
        return permissionService.hasAnyPermission(permissions);
    };

    const can = (action: string, resource: string): boolean => {
        if (!permissionService) return false;
        return permissionService.can(action, resource);
    };

    const getAllPermissions = (): Permission[] => {
        if (!permissionService) return [];
        return permissionService.getAllPermissions();
    };

    return {
        hasPermission,
        hasAllPermissions,
        hasAnyPermission,
        can,
        getAllPermissions,
    };
}
