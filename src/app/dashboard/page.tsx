'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Memuat Dashboard');

    useEffect(() => {
        // Animated progress bar
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 100);

        // Animated text changes
        const textInterval = setInterval(() => {
            const texts = [
                'Memuat Dashboard',
                'Menyiapkan Data',
                'Mengonfigurasi Akun',
                'Hampir Siap'
            ];
            setLoadingText(texts[Math.floor(Math.random() * texts.length)]);
        }, 1000);

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log('Checking user role:', user.role);
            const role = user.role ? user.role.toUpperCase() : '';

            // Add delay for smooth animation experience
            setTimeout(() => {
                setProgress(100);

                setTimeout(() => {
                    // Redirect based on role
                    switch (role) {
                        case 'ADMIN':
                            router.push('/dashboard/admin');
                            break;
                        case 'AKUNTAN':
                        case 'ACCOUNTANT':
                            router.push('/dashboard/akuntan');
                            break;
                        case 'KLIEN':
                        case 'CLIENT':
                            router.push('/dashboard/klien');
                            break;
                        default:
                            console.log('Unknown role, redirecting to login:', role);
                            router.push('/login');
                    }
                }, 300);
            }, 1500);
        } else {
            router.push('/login');
        }

        return () => {
            clearInterval(progressInterval);
            clearInterval(textInterval);
        };
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Gradient Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]"
                />

                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -50, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Main Loading Content */}
            <div className="relative z-10 flex flex-col items-center gap-8 px-6">
                {/* Logo with Advanced Animation */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                    }}
                    className="relative"
                >
                    <motion.div
                        animate={{
                            boxShadow: [
                                "0 0 20px rgba(59, 130, 246, 0.5)",
                                "0 0 60px rgba(147, 51, 234, 0.8)",
                                "0 0 20px rgba(236, 72, 153, 0.5)",
                                "0 0 60px rgba(59, 130, 246, 0.8)",
                            ],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                        }}
                        className="w-32 h-32 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 relative overflow-hidden"
                    >
                        {/* Shine effect */}
                        <motion.div
                            animate={{
                                x: ['-100%', '200%'],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                                repeatDelay: 1
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />

                        <img
                            src="/logo-risabur.png"
                            alt="RISA BUR"
                            className="w-full h-full object-contain relative z-10"
                        />
                    </motion.div>

                    {/* Rotating Ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute inset-0 -m-4"
                    >
                        <div className="w-full h-full border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full" />
                    </motion.div>

                    {/* Sparkles */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                        className="absolute -top-2 -right-2"
                    >
                        <Sparkles className="w-6 h-6 text-yellow-400" fill="currentColor" />
                    </motion.div>
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [360, 180, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 1
                        }}
                        className="absolute -bottom-2 -left-2"
                    >
                        <Zap className="w-6 h-6 text-blue-400" fill="currentColor" />
                    </motion.div>
                </motion.div>

                {/* Brand Name */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                            RISA BUR
                        </span>
                    </h1>
                    <p className="text-gray-400 text-sm">Kantor Jasa Akuntan Profesional</p>
                </motion.div>

                {/* Loading Text */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={loadingText}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                    >
                        <p className="text-white font-medium text-lg">{loadingText}</p>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Bar */}
                <div className="w-80 max-w-full">
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
                        >
                            {/* Shimmer effect */}
                            <motion.div
                                animate={{
                                    x: ['-100%', '200%'],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            />
                        </motion.div>
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-sm text-gray-400 mt-2"
                    >
                        {progress}%
                    </motion.p>
                </div>

                {/* Pulsing Dots */}
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                            className="w-2 h-2 bg-white/50 rounded-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}