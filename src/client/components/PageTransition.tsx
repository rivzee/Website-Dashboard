'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Page transition wrapper component
export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Navigation progress component - Pure CSS/Framer Motion implementation (no nprogress)
export function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState(false);
    const [progress, setProgress] = useState(0);

    // Reset progress when navigation completes
    useEffect(() => {
        setIsNavigating(false);
        setProgress(0);
    }, [pathname, searchParams]);

    // Handle navigation start
    useEffect(() => {
        let progressInterval: NodeJS.Timeout;

        const handleStart = () => {
            setIsNavigating(true);
            setProgress(0);

            // Simulate progress
            progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + Math.random() * 10;
                });
            }, 200);
        };

        // Listen for navigation events
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');
            if (anchor && anchor.href && anchor.href.startsWith(window.location.origin) && !anchor.target) {
                handleStart();
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
            if (progressInterval) clearInterval(progressInterval);
        };
    }, []);

    return (
        <>
            {/* Top progress bar */}
            <AnimatePresence>
                {isNavigating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 right-0 z-[99999] h-1"
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-r-full"
                            style={{
                                width: `${progress}%`,
                                boxShadow: '0 0 10px rgba(139, 92, 246, 0.5), 0 0 5px rgba(236, 72, 153, 0.5)'
                            }}
                            initial={{ width: '0%' }}
                            animate={{ width: `${Math.min(progress, 90)}%` }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Optional: Loading overlay */}
            <AnimatePresence>
                {isNavigating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9998] pointer-events-none"
                    >
                        {/* Subtle overlay during navigation */}
                        <div className="absolute inset-0 bg-white/5 dark:bg-black/5" />

                        {/* Loading indicator in center */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                            <div className="relative w-12 h-12">
                                <motion.div
                                    className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                />
                                <motion.div
                                    className="absolute inset-1 border-4 border-transparent border-b-pink-400 border-l-indigo-400 rounded-full"
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Simple loading overlay for content areas
export function ContentLoadingOverlay({ show }: { show: boolean }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl"
                >
                    <div className="relative w-10 h-10">
                        <motion.div
                            className="absolute inset-0 border-3 border-transparent border-t-blue-500 border-r-purple-500 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
