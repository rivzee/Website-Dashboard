'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ message = 'Memuat...', fullScreen = true }: LoadingSpinnerProps) {
  const containerClass = fullScreen
    ? "flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900"
    : "flex items-center justify-center min-h-[400px]";

  return (
    <div className={containerClass}>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <motion.div
            className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"
          />
          <motion.div
            className="absolute inset-0 border-4 border-transparent border-t-blue-600 border-r-blue-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <motion.p
          className="text-base font-medium text-gray-600 dark:text-gray-300"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}

// Compact loading for inline use
export function CompactLoading({ message = 'Memuat...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <div className="relative w-8 h-8">
        <motion.div
          className="absolute inset-0 border-2 border-gray-200 dark:border-gray-700 rounded-full"
        />
        <motion.div
          className="absolute inset-0 border-2 border-transparent border-t-blue-500 border-r-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {message && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {message}
        </span>
      )}
    </div>
  );
}

// Skeleton Card for loading states
export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="animate-pulse">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
}