'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Search,
    User,
    Settings,
    LogOut,
    ChevronDown,
    Moon,
    Sun
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NotificationCenter } from './NotificationSystem';


interface TopbarProps {
    user: any;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export default function Topbar({ user, isDarkMode, toggleDarkMode }: TopbarProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
            <div className="px-4 md:px-6 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                            />
                        </div>
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center gap-3">

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <Sun size={20} className="text-yellow-500" />
                            ) : (
                                <Moon size={20} className="text-gray-600" />
                            )}
                        </button>

                        {/* Notifications */}
                        <NotificationCenter />

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                    {user?.fullName?.charAt(0) || 'U'}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {user?.fullName || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {user?.role || 'Role'}
                                    </p>
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                                    >
                                        {/* User Info */}
                                        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold">
                                                    {user?.fullName?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{user?.fullName}</p>
                                                    <p className="text-xs text-white/80">{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="p-2">
                                            <Link href="/dashboard/profile">
                                                <button
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                                                >
                                                    <User size={18} className="text-gray-600 dark:text-gray-400" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Profil Saya</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Lihat dan edit profil</p>
                                                    </div>
                                                </button>
                                            </Link>

                                            {/* Settings - Admin Only */}
                                            {user?.role === 'ADMIN' && (
                                                <Link href="/dashboard/settings">
                                                    <button
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                                                    >
                                                        <Settings size={18} className="text-gray-600 dark:text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Pengaturan</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Preferensi</p>
                                                        </div>
                                                    </button>
                                                </Link>
                                            )}

                                            <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left group"
                                            >
                                                <LogOut size={18} className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">Keluar</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Keluar dari akun</p>
                                                </div>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
