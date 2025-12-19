'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    FileText,
    User,
    Download,
} from 'lucide-react';
import axios from 'axios';

interface PendingPayment {
    id: string;
    amount: number;
    paymentMethod: string;
    proofUrl: string;
    createdAt: string;
    order: {
        id: string;
        service: {
            name: string;
        };
        client: {
            fullName: string;
            email: string;
        };
    };
}

export default function PendingPaymentsPage() {
    const [payments, setPayments] = useState<PendingPayment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProof, setSelectedProof] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const fetchPendingPayments = async () => {
        try {
            const response = await axios.get('/api/payments?status=PENDING_APPROVAL');
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (paymentId: string) => {
        if (!confirm('Setujui pembayaran ini?')) return;

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            await axios.patch(`/api/payments/${paymentId}/approve`, {
                adminId: user.id,
                action: 'approve',
            });
            alert('Pembayaran berhasil disetujui!');
            fetchPendingPayments();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Gagal menyetujui pembayaran');
        }
    };

    const handleReject = async (paymentId: string) => {
        if (!confirm('Tolak pembayaran ini?')) return;

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            await axios.patch(`/api/payments/${paymentId}/approve`, {
                adminId: user.id,
                action: 'reject',
            });
            alert('Pembayaran ditolak');
            fetchPendingPayments();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Gagal menolak pembayaran');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Persetujuan Pembayaran
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Tinjau dan setujui bukti pembayaran dari klien
                </p>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3">
                    <Clock size={32} />
                    <div>
                        <p className="text-white/80 text-sm">Menunggu Persetujuan</p>
                        <p className="text-3xl font-bold">{payments.length}</p>
                    </div>
                </div>
            </div>

            {/* Payments List */}
            <div className="grid gap-4">
                {payments.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                            Tidak ada pembayaran yang menunggu persetujuan
                        </p>
                    </div>
                ) : (
                    payments.map((payment) => (
                        <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Info */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                            {payment.order.service.name}
                                        </h3>
                                        <p className="text-2xl font-bold text-blue-600">
                                            Rp {payment.amount.toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Klien</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {payment.order.client.fullName}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Metode</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {payment.paymentMethod}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Tanggal Upload</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {new Date(payment.createdAt).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Proof */}
                                <div className="lg:w-80">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Bukti Pembayaran
                                    </p>
                                    <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                                        {payment.proofUrl ? (
                                            <img
                                                src={payment.proofUrl}
                                                alt="Bukti Pembayaran"
                                                className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition"
                                                onClick={() => setSelectedProof(payment.proofUrl)}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <FileText size={48} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    {/* Download Button */}
                                    {payment.proofUrl && (
                                        <a
                                            href={payment.proofUrl}
                                            download={`bukti-pembayaran-${payment.id}.jpg`}
                                            className="flex items-center justify-center gap-2 mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition w-full"
                                        >
                                            <Download size={16} />
                                            Download Bukti
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => handleApprove(payment.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition"
                                >
                                    <CheckCircle size={20} />
                                    Setujui Pembayaran
                                </button>
                                <button
                                    onClick={() => handleReject(payment.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition"
                                >
                                    <XCircle size={20} />
                                    Tolak
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Image Modal */}
            {selectedProof && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedProof(null)}
                >
                    <div className="relative max-w-4xl w-full">
                        <img
                            src={selectedProof}
                            alt="Bukti Pembayaran"
                            className="w-full h-auto rounded-lg"
                        />
                        <button
                            onClick={() => setSelectedProof(null)}
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                        >
                            <XCircle size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
