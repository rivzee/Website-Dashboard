'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import { motion, AnimatePresence } from 'framer-motion';

// Configure NProgress
NProgress.configure({
    showSpinner: false,
    speed: 400,
    minimum: 0.1,
    trickleSpeed: 200,
});

// Custom NProgress styles - will be added to global CSS
export const nprogressStyles = `
#nprogress {
    pointer-events: none;
}

#nprogress .bar {
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
    position: fixed;
    z-index: 99999;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    border-radius: 0 2px 2px 0;
    box-shadow: 0 0 10px #8b5cf6, 0 0 5px #8b5cf6;
}

#nprogress .peg {
    display: block;
    position: absolute;
    right: 0px;
    width: 100px;
    height: 100%;
    box-shadow: 0 0 15px #ec4899, 0 0 10px #ec4899;
    opacity: 1;
    transform: rotate(3deg) translate(0px, -4px);
}
`;

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

// Navigation progress component
export function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        // Add NProgress styles to head
        if (typeof window !== 'undefined') {
            const styleId = 'nprogress-custom-styles';
            if (!document.getElementById(styleId)) {
                const styleElement = document.createElement('style');
                styleElement.id = styleId;
                styleElement.textContent = nprogressStyles;
                document.head.appendChild(styleElement);
            }
        }
    }, []);

    useEffect(() => {
        NProgress.done();
        setIsNavigating(false);
    }, [pathname, searchParams]);

    useEffect(() => {
        const handleStart = () => {
            setIsNavigating(true);
            NProgress.start();
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
        };
    }, []);

    return (
        <AnimatePresence>
            {isNavigating && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9998] pointer-events-none"
                >
                    {/* Subtle overlay during navigation */}
                    <div className="absolute inset-0 bg-white/5 dark:bg-black/5 backdrop-blur-[1px]" />

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
