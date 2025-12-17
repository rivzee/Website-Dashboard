'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';
import axios from 'axios';

interface RevisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    orderTitle: string;
    currentRevisionCount: number;
    onSuccess: () => void;
}

export default function RevisionModal({
    isOpen,
    onClose,
    orderId,
    orderTitle,
    currentRevisionCount,
    onSuccess,
}: RevisionModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            await axios.post('/api/revisions', {
                orderId,
                requestedBy: user.id,
                title: formData.title,
                description: formData.description,
            });

            alert('Permintaan revisi berhasil dikirim!');
            onSuccess();
            onClose();
            setFormData({ title: '', description: '' });
        } catch (error: any) {
            console.error('Error submitting revision:', error);
            alert(error.response?.data?.error || 'Gagal mengirim permintaan revisi');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const remainingRevisions = 2 - currentRevisionCount;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Ajukan Revisi Dokumen
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {orderTitle}
                        </p>
                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                            Sisa kesempatan revisi: {remainingRevisions}x
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Judul Revisi <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Contoh: Perbaikan laporan keuangan bulan Januari"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Detail Revisi <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Jelaskan secara detail apa yang perlu direvisi..."
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Catatan:</strong> Permintaan revisi akan diteruskan ke akuntan yang menangani pesanan Anda.
                            Maksimal revisi adalah 2 kali per pesanan.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Kirim Permintaan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
