/**
 * Enhanced Notification System
 * Real-time notification center with WebSocket simulation
 */

'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2, Settings, Filter } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const toast = useToast();

    // Simulate WebSocket connection
    useEffect(() => {
        // Simulate receiving notifications
        const interval = setInterval(() => {
            // Random chance to receive notification (for demo)
            if (Math.random() > 0.95) {
                const types: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error'];
                const messages = [
                    { title: 'New Order', message: 'You have a new order from John Doe' },
                    { title: 'Payment Received', message: 'Payment of Rp 1,000,000 received' },
                    { title: 'Task Completed', message: 'Your report has been generated' },
                    { title: 'System Update', message: 'System will be updated at midnight' },
                ];

                const randomType = types[Math.floor(Math.random() * types.length)];
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];

                addNotification({
                    type: randomType,
                    title: randomMessage.title,
                    message: randomMessage.message,
                });
            }
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Math.random().toString(36).substring(7),
            timestamp: new Date(),
            read: false,
        };

        setNotifications((prev) => [newNotification, ...prev]);

        // Show toast for new notification
        toast.info(notification.title, notification.message);
    }, [toast]);

    const markAsRead = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    }, []);

    const deleteNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                clearAll,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

// Notification Center Component
export function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const typeColors = {
        info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        success: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
        warning: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
        error: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    };

    return (
        <div className="relative">
            {/* Bell Icon Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <Bell size={20} className="text-gray-600 dark:text-gray-400" />

                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </motion.button>

            {/* Notification Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40 md:hidden"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[600px] flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Notifications
                                    </h3>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <X size={18} className="text-gray-500" />
                                    </button>
                                </div>

                                {/* Filter Tabs */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        All ({notifications.length})
                                    </button>
                                    <button
                                        onClick={() => setFilter('unread')}
                                        className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'unread'
                                                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        Unread ({unreadCount})
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            {notifications.length > 0 && (
                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex gap-2">
                                    <button
                                        onClick={markAllAsRead}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    >
                                        <Check size={14} />
                                        Mark all read
                                    </button>
                                    <button
                                        onClick={clearAll}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Clear all
                                    </button>
                                </div>
                            )}

                            {/* Notifications List */}
                            <div className="flex-1 overflow-y-auto">
                                {filteredNotifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Bell size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-2">
                                        <AnimatePresence>
                                            {filteredNotifications.map((notification) => (
                                                <motion.div
                                                    key={notification.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className={`p-3 mb-2 rounded-xl cursor-pointer transition-colors ${notification.read
                                                            ? 'bg-gray-50 dark:bg-gray-700/50'
                                                            : 'bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800'
                                                        } hover:bg-gray-100 dark:hover:bg-gray-700`}
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`p-2 rounded-lg ${typeColors[notification.type]}`}>
                                                            <Bell size={16} />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                                                                    {notification.title}
                                                                </h4>
                                                                {!notification.read && (
                                                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                                                                )}
                                                            </div>

                                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                                                {notification.message}
                                                            </p>

                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs text-gray-500 dark:text-gray-500">
                                                                    {formatTimestamp(notification.timestamp)}
                                                                </span>

                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        deleteNotification(notification.id);
                                                                    }}
                                                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                                                                >
                                                                    <Trash2 size={12} className="text-red-500" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function formatTimestamp(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
}
