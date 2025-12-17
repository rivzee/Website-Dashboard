/**
 * PWA Install Prompt Component
 * Shows install prompt for PWA
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { usePWA } from '@/client/hooks/usePWA';

export function PWAInstallPrompt() {
    const { isInstallable, promptInstall } = usePWA();
    const [showPrompt, setShowPrompt] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if user has dismissed the prompt before
        const isDismissed = localStorage.getItem('pwa-prompt-dismissed');
        if (isDismissed) {
            setDismissed(true);
            return;
        }

        // Show prompt after 30 seconds if installable
        const timer = setTimeout(() => {
            if (isInstallable && !dismissed) {
                setShowPrompt(true);
            }
        }, 30000);

        return () => clearTimeout(timer);
    }, [isInstallable, dismissed]);

    const handleInstall = async () => {
        const installed = await promptInstall();
        if (installed) {
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        setDismissed(true);
        localStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    if (!isInstallable || dismissed) return null;

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-4 right-4 z-50 max-w-sm"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                                <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                    Install RISA BUR App
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Install our app for a better experience with offline access and faster performance.
                                </p>

                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleInstall}
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                                    >
                                        Install
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleDismiss}
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-medium transition-colors"
                                    >
                                        Not now
                                    </motion.button>
                                </div>
                            </div>

                            <button
                                onClick={handleDismiss}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X size={18} className="text-gray-500" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
