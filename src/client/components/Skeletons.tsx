/**
 * Enhanced Loading Skeletons
 * Reusable skeleton components for better loading states
 */

'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
    className = '',
    variant = 'rectangular',
    width,
    height,
    animation = 'pulse',
}: SkeletonProps) {
    const baseClasses = 'bg-gray-200 dark:bg-gray-700';

    const variantClasses = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-none',
        rounded: 'rounded-xl',
    };

    const animationClasses = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
        none: '',
    };

    const style = {
        width: width || '100%',
        height: height || (variant === 'text' ? '1rem' : '100%'),
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
            style={style}
        />
    );
}

// Card Skeleton
export function CardSkeleton({ count = 1 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton variant="circular" width={48} height={48} />
                        <Skeleton variant="rounded" width={60} height={24} />
                    </div>
                    <Skeleton variant="text" className="mb-2" width="40%" />
                    <Skeleton variant="text" width="60%" height={32} />
                </div>
            ))}
        </>
    );
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            {/* Header */}
            <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} variant="text" height={20} />
                ))}
            </div>

            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid gap-4 mb-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton key={colIndex} variant="text" height={16} />
                    ))}
                </div>
            ))}
        </div>
    );
}

// List Skeleton
export function ListSkeleton({ items = 5 }: { items?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl">
                    <Skeleton variant="circular" width={40} height={40} />
                    <div className="flex-1 space-y-2">
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" height={12} />
                    </div>
                    <Skeleton variant="rounded" width={80} height={24} />
                </div>
            ))}
        </div>
    );
}

// Chart Skeleton
export function ChartSkeleton() {
    return (
        <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <Skeleton variant="text" width="30%" height={24} className="mb-6" />
            <div className="h-64 flex items-end justify-between gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton
                        key={i}
                        variant="rounded"
                        className="flex-1"
                        height={`${Math.random() * 60 + 40}%`}
                    />
                ))}
            </div>
        </div>
    );
}

// Dashboard Skeleton
export function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton variant="rounded" width={64} height={64} />
                    <div className="space-y-2">
                        <Skeleton variant="text" width={200} height={32} />
                        <Skeleton variant="text" width={150} height={16} />
                    </div>
                </div>
                <div className="flex gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} variant="rounded" width={120} height={40} />
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <CardSkeleton count={4} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartSkeleton />
                </div>
                <ChartSkeleton />
            </div>

            {/* Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                    <Skeleton variant="text" width="40%" height={24} className="mb-6" />
                    <ListSkeleton items={5} />
                </div>
                <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                    <Skeleton variant="text" width="40%" height={24} className="mb-6" />
                    <ListSkeleton items={5} />
                </div>
            </div>
        </div>
    );
}

// Loading Spinner
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full ${className}`}
        />
    );
}

// Full Page Loading
export function FullPageLoading({ message = 'Memuat...' }: { message?: string }) {
    return (
        <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">{message}</p>
            </div>
        </div>
    );
}

// Button Loading State
export function ButtonLoading({ children, isLoading, ...props }: any) {
    return (
        <button {...props} disabled={isLoading || props.disabled}>
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span>Memuat...</span>
                </span>
            ) : (
                children
            )}
        </button>
    );
}
