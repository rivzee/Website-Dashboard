'use client';

import { motion } from 'framer-motion';

interface LoadingAnimationProps {
    variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'logo';
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

export default function LoadingAnimation({
    variant = 'spinner',
    size = 'md',
    text = 'Memuat...'
}: LoadingAnimationProps) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    const dotSizes = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    };

    // Spinner Animation
    if (variant === 'spinner') {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <motion.div
                    className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                {text && (
                    <motion.p
                        className="text-sm text-gray-600 dark:text-gray-400 font-medium"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        {text}
                    </motion.p>
                )}
            </div>
        );
    }

    // Dots Animation
    if (variant === 'dots') {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex gap-2">
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            className={`${dotSizes[size]} bg-gradient-to-r from-blue-600 to-purple-600 rounded-full`}
                            animate={{
                                y: [0, -20, 0],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: index * 0.15,
                                ease: 'easeInOut'
                            }}
                        />
                    ))}
                </div>
                {text && (
                    <motion.p
                        className="text-sm text-gray-600 dark:text-gray-400 font-medium"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        {text}
                    </motion.p>
                )}
            </div>
        );
    }

    // Pulse Animation
    if (variant === 'pulse') {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative">
                    <motion.div
                        className={`${sizeClasses[size]} bg-gradient-to-r from-blue-600 to-purple-600 rounded-full`}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.8, 1]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />
                    <motion.div
                        className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-r from-blue-600 to-purple-600 rounded-full`}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />
                </div>
                {text && (
                    <motion.p
                        className="text-sm text-gray-600 dark:text-gray-400 font-medium"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        {text}
                    </motion.p>
                )}
            </div>
        );
    }

    // Bars Animation
    if (variant === 'bars') {
        const barHeights = size === 'sm' ? 'h-8' : size === 'md' ? 'h-12' : 'h-16';
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex items-end gap-1">
                    {[0, 1, 2, 3, 4].map((index) => (
                        <motion.div
                            key={index}
                            className={`w-2 ${barHeights} bg-gradient-to-t from-blue-600 to-purple-600 rounded-full`}
                            animate={{
                                scaleY: [0.3, 1, 0.3]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: index * 0.1,
                                ease: 'easeInOut'
                            }}
                            style={{ originY: 1 }}
                        />
                    ))}
                </div>
                {text && (
                    <motion.p
                        className="text-sm text-gray-600 dark:text-gray-400 font-medium"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        {text}
                    </motion.p>
                )}
            </div>
        );
    }

    // Logo Animation (RISA BUR)
    if (variant === 'logo') {
        return (
            <div className="flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    {/* Outer ring */}
                    <motion.div
                        className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-blue-600 border-r-purple-600 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Inner ring */}
                    <motion.div
                        className="absolute inset-2 w-20 h-20 border-4 border-transparent border-b-blue-400 border-l-purple-400 rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Center logo */}
                    <motion.div
                        className="relative w-24 h-24 flex items-center justify-center"
                        animate={{
                            scale: [1, 1.05, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        <div className="text-center">
                            <motion.div
                                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                                animate={{
                                    opacity: [0.7, 1, 0.7]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                            >
                                RISA
                            </motion.div>
                            <motion.div
                                className="text-xs font-semibold text-gray-600 dark:text-gray-400"
                                animate={{
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: 0.3
                                }}
                            >
                                BUR
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {text && (
                    <motion.p
                        className="text-sm text-gray-600 dark:text-gray-400 font-medium"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        {text}
                    </motion.p>
                )}
            </div>
        );
    }

    return null;
}
