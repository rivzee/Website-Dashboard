'use client';

import { useState } from 'react';
import LoadingAnimation from '@/client/components/LoadingAnimation';
import PageLoader from '@/client/components/PageLoader';
import { motion } from 'framer-motion';

export default function LoadingDemo() {
    const [showPageLoader, setShowPageLoader] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<'spinner' | 'dots' | 'pulse' | 'bars' | 'logo'>('logo');

    const variants: Array<'spinner' | 'dots' | 'pulse' | 'bars' | 'logo'> = ['spinner', 'dots', 'pulse', 'bars', 'logo'];

    const handleShowPageLoader = (variant: typeof selectedVariant) => {
        setSelectedVariant(variant);
        setShowPageLoader(true);
        setTimeout(() => setShowPageLoader(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
            <PageLoader isLoading={showPageLoader} variant={selectedVariant} text="Demo Loading..." />

            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Loading Animation Demo
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Berbagai variasi loading animation untuk RISA BUR Dashboard
                    </p>
                </motion.div>

                {/* Variants Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {variants.map((variant, index) => (
                        <motion.div
                            key={variant}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 capitalize">
                                {variant}
                            </h3>

                            {/* Small Size */}
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Small</p>
                                    <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                        <LoadingAnimation variant={variant} size="sm" text="" />
                                    </div>
                                </div>

                                {/* Medium Size */}
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Medium</p>
                                    <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                        <LoadingAnimation variant={variant} size="md" text="" />
                                    </div>
                                </div>

                                {/* Large Size */}
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Large</p>
                                    <div className="flex justify-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                        <LoadingAnimation variant={variant} size="lg" text="Loading..." />
                                    </div>
                                </div>

                                {/* Full Page Demo Button */}
                                <button
                                    onClick={() => handleShowPageLoader(variant)}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                                >
                                    Demo Full Page
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Usage Example */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Cara Penggunaan
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Inline Loading:</p>
                            <code className="text-sm text-blue-600 dark:text-blue-400">
                                {`<LoadingAnimation variant="spinner" size="md" text="Loading..." />`}
                            </code>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Full Page Loading:</p>
                            <code className="text-sm text-blue-600 dark:text-blue-400">
                                {`<PageLoader isLoading={true} variant="logo" text="Memuat..." />`}
                            </code>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Auto Loading (Next.js):</p>
                            <code className="text-sm text-blue-600 dark:text-blue-400">
                                {`// Create loading.tsx in your route folder
export default function Loading() {
  return <LoadingSpinner />;
}`}
                            </code>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
