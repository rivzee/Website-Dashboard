'use client';

import { motion, AnimatePresence } from 'framer-motion';
import LoadingAnimation from './LoadingAnimation';

interface PageLoaderProps {
    isLoading: boolean;
    variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'logo';
    text?: string;
    overlay?: boolean;
}

export default function PageLoader({
    isLoading,
    variant = 'logo',
    text = 'Memuat...',
    overlay = true
}: PageLoaderProps) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`fixed inset-0 z-50 flex items-center justify-center ${overlay
                            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm'
                            : 'bg-white dark:bg-gray-900'
                        }`}
                >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"
                            animate={{
                                x: [0, 100, 0],
                                y: [0, 50, 0],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        />
                        <motion.div
                            className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"
                            animate={{
                                x: [0, -100, 0],
                                y: [0, -50, 0],
                                scale: [1, 1.3, 1]
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        />
                    </div>

                    {/* Loading content */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="relative z-10"
                    >
                        <LoadingAnimation variant={variant} size="lg" text={text} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
