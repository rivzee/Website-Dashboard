'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Plus, FileText, Upload, CreditCard, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QuickActionsMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const actions = [
        {
            icon: Plus,
            label: 'Buat Pesanan Baru',
            description: 'Tambah pesanan untuk klien',
            color: 'from-blue-500 to-blue-600',
            action: () => router.push('/dashboard/order'),
        },
        {
            icon: FileText,
            label: 'Tambah Layanan',
            description: 'Buat paket layanan baru',
            color: 'from-purple-500 to-purple-600',
            action: () => router.push('/dashboard/services'),
        },
        {
            icon: Upload,
            label: 'Upload Dokumen',
            description: 'Upload dokumen pendukung',
            color: 'from-green-500 to-green-600',
            action: () => router.push('/dashboard/my-orders'),
        },
        {
            icon: CreditCard,
            label: 'Proses Pembayaran',
            description: 'Konfirmasi pembayaran',
            color: 'from-orange-500 to-orange-600',
            action: () => router.push('/dashboard/my-orders'),
        },
    ];

    const handleAction = (actionFn: () => void) => {
        actionFn();
        setIsOpen(false);
    };

    return (
        <>
            {/* Quick Actions Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 z-50 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
            >
                <Zap size={24} />
            </motion.button>

            {/* Quick Actions Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="w-full max-w-md backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                                                <Zap size={24} className="text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
                                        </div>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Actions Grid */}
                                <div className="p-6 grid grid-cols-2 gap-4">
                                    {actions.map((action, idx) => {
                                        const Icon = action.icon;
                                        return (
                                            <motion.button
                                                key={idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleAction(action.action)}
                                                className="p-4 bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 text-left group"
                                            >
                                                <div className={`inline-flex p-3 bg-gradient-to-r ${action.color} rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
                                                    <Icon size={24} className="text-white" />
                                                </div>
                                                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                                    {action.label}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {action.description}
                                                </p>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
