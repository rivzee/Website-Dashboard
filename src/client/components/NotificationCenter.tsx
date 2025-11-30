'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';

interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    time: string;
    read: boolean;
}

export function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'success',
            title: 'Pembayaran Diterima',
            message: 'Pembayaran untuk Order #12345 telah dikonfirmasi',
            time: '5 menit lalu',
            read: false,
        },
        {
            id: '2',
            type: 'info',
            title: 'Dokumen Diupload',
            message: 'Klien telah mengupload dokumen pendukung',
            time: '1 jam lalu',
            read: false,
        },
        {
            id: '3',
            type: 'warning',
            title: 'Deadline Mendekat',
            message: 'Order #12344 akan jatuh tempo dalam 2 hari',
            time: '3 jam lalu',
            read: true,
        },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-orange-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <>
            {/* Notification Bell */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
            >
                <Bell size={24} className="text-gray-700 dark:text-gray-300" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                        {unreadCount}
                    </motion.span>
                )}
            </motion.button>

            {/* Notification Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, x: 300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 300 }}
                            className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifikasi</h2>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Tandai semua sudah dibaca
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="overflow-y-auto h-[calc(100%-100px)]">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                        <Bell size={48} className="mb-4 opacity-50" />
                                        <p>Tidak ada notifikasi</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {notifications.map((notif) => (
                                            <motion.div
                                                key={notif.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: 100 }}
                                                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                                    }`}
                                                onClick={() => markAsRead(notif.id)}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="flex-shrink-0 mt-1">{getIcon(notif.type)}</div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                                {notif.title}
                                                            </h3>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteNotification(notif.id);
                                                                }}
                                                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            {notif.message}
                                                        </p>
                                                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-500">
                                                            <Clock size={12} />
                                                            {notif.time}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
