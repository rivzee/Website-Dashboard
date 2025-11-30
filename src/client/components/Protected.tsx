/**
 * Protected Component
 * Component wrapper for permission-based rendering
 */

'use client';

import { ReactNode } from 'react';
import { Permission } from '@/utils/permissions';
import { usePermissions } from '@/hooks/usePermissions';

interface ProtectedProps {
    children: ReactNode;
    permission?: Permission;
    permissions?: Permission[];
    requireAll?: boolean;
    fallback?: ReactNode;
    user: any;
}

export function Protected({
    children,
    permission,
    permissions,
    requireAll = false,
    fallback = null,
    user,
}: ProtectedProps) {
    const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions(user);

    // Single permission check
    if (permission && !hasPermission(permission)) {
        return <>{fallback}</>;
    }

    // Multiple permissions check
    if (permissions) {
        const hasAccess = requireAll
            ? hasAllPermissions(permissions)
            : hasAnyPermission(permissions);

        if (!hasAccess) {
            return <>{fallback}</>;
        }
    }

    return <>{children}</>;
}

// Higher-order component for protecting routes
export function withPermission(
    Component: React.ComponentType<any>,
    permission: Permission,
    fallback?: ReactNode
) {
    return function ProtectedComponent(props: any) {
        return (
            <Protected permission={permission} fallback={fallback} user={props.user}>
                <Component {...props} />
            </Protected>
        );
    };
}
