'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, Download, ArrowLeft, CheckCircle, Clock, AlertCircle, CreditCard, RefreshCw, AlertTriangle } from 'lucide-react';
import RevisionModal from '@/client/components/RevisionModal';
import { CompactLoading } from '@/client/components/LoadingSpinner';

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showRevisionModal, setShowRevisionModal] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchOrder(params.id as string);
        }
    }, [params.id]);

    const fetchOrder = async (id: string) => {
        try {
            const res = await axios.get(`/api/orders/${id}`);
            setOrder(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (doc: any) => {
        // Open file URL directly - browser will handle download notification
        window.open(doc.fileUrl, '_blank');
    };

    if (loading) return <CompactLoading message="Memuat detail pesanan..." />;
    if (!order) return <div className="p-8 text-center">Order tidak ditemukan</div>;

    const clientDocs = order.documents?.filter((d: any) => !d.isResult) || [];
    const resultDocs = order.documents?.filter((d: any) => d.isResult) || [];

    const statusConfig = (status: string, payment?: any) => {
        // Check if payment is pending approval (already paid but waiting verification)
        const isPendingVerification = payment?.status === 'PENDING_APPROVAL';

        switch (status) {
            case 'PAID':
                return { color: 'blue', bgColor: 'bg-blue-500/10', textColor: 'text-blue-600 dark:text-blue-400', borderColor: 'border-blue-200 dark:border-blue-500/30', icon: CheckCircle, label: 'Menunggu Verifikasi' };
            case 'COMPLETED':
                return { color: 'green', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-600 dark:text-emerald-400', borderColor: 'border-emerald-200 dark:border-emerald-500/30', icon: CheckCircle, label: 'Selesai' };
            case 'IN_PROGRESS':
                return { color: 'yellow', bgColor: 'bg-yellow-500/10', textColor: 'text-yellow-600 dark:text-yellow-400', borderColor: 'border-yellow-200 dark:border-yellow-500/30', icon: Clock, label: 'Sedang Dikerjakan' };
            case 'PENDING_PAYMENT':
                // If payment has proof uploaded, show "Menunggu Verifikasi"
                if (isPendingVerification) {
                    return { color: 'blue', bgColor: 'bg-blue-500/10', textColor: 'text-blue-600 dark:text-blue-400', borderColor: 'border-blue-200 dark:border-blue-500/30', icon: Clock, label: 'Menunggu Verifikasi Admin' };
                }
                return { color: 'orange', bgColor: 'bg-orange-500/10', textColor: 'text-orange-600 dark:text-orange-400', borderColor: 'border-orange-200 dark:border-orange-500/30', icon: AlertCircle, label: 'Menunggu Pembayaran' };
            default:
                return { color: 'orange', bgColor: 'bg-orange-500/10', textColor: 'text-orange-600 dark:text-orange-400', borderColor: 'border-orange-200 dark:border-orange-500/30', icon: AlertCircle, label: 'Menunggu Pembayaran' };
        }
    };

    const status = statusConfig(order.status, order.payment);
    const StatusIcon = status.icon;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition">
                <ArrowLeft size={20} /> Kembali
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Order Info */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{order.service?.name}</h1>
                                <p className="text-gray-500 dark:text-gray-400">Order ID: #{order.id.slice(0, 8)}</p>
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.bgColor} border ${status.borderColor}`}>
                                <StatusIcon size={16} className={status.textColor} />
                                <span className={`text-sm font-bold ${status.textColor}`}>{status.label}</span>
                            </div>
                        </div>

                        {/* Progress Timeline */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Progress Pesanan</h3>
                            <div className="flex items-center justify-between relative">
                                {/* Progress Line Background */}
                                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

                                {/* Progress Line Active */}
                                <div
                                    className="absolute top-5 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                    style={{
                                        width: order.status === 'PENDING_PAYMENT' ? '0%' :
                                            order.status === 'PAID' ? '33%' :
                                                order.status === 'IN_PROGRESS' ? '66%' :
                                                    order.status === 'COMPLETED' ? '100%' : '0%'
                                    }}
                                ></div>

                                {/* Step 1: Menunggu Pembayaran */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status !== 'PENDING_PAYMENT'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-orange-500 text-white animate-pulse'
                                        }`}>
                                        {order.status !== 'PENDING_PAYMENT' ? <CheckCircle size={20} /> : <CreditCard size={20} />}
                                    </div>
                                    <span className="text-xs mt-2 text-center font-medium text-gray-600 dark:text-gray-400 max-w-[80px]">
                                        Sedang Diverifikasi Admin
                                    </span>
                                </div>

                                {/* Step 2: Verifikasi Admin */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'IN_PROGRESS' || order.status === 'COMPLETED'
                                        ? 'bg-green-500 text-white'
                                        : order.status === 'PAID'
                                            ? 'bg-blue-500 text-white animate-pulse'
                                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                                        }`}>
                                        {order.status === 'IN_PROGRESS' || order.status === 'COMPLETED' ? <CheckCircle size={20} /> : <Clock size={20} />}
                                    </div>
                                    <span className="text-xs mt-2 text-center font-medium text-gray-600 dark:text-gray-400 max-w-[80px]">
                                        Verifikasi Admin
                                    </span>
                                </div>

                                {/* Step 3: Sedang Dikerjakan */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'COMPLETED'
                                        ? 'bg-green-500 text-white'
                                        : order.status === 'IN_PROGRESS'
                                            ? 'bg-yellow-500 text-white animate-pulse'
                                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                                        }`}>
                                        {order.status === 'COMPLETED' ? <CheckCircle size={20} /> : <Clock size={20} />}
                                    </div>
                                    <span className="text-xs mt-2 text-center font-medium text-gray-600 dark:text-gray-400 max-w-[80px]">
                                        Sedang Dikerjakan
                                    </span>
                                </div>

                                {/* Step 4: Selesai */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'COMPLETED'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                                        }`}>
                                        <CheckCircle size={20} />
                                    </div>
                                    <span className="text-xs mt-2 text-center font-medium text-gray-600 dark:text-gray-400 max-w-[80px]">
                                        Selesai
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Detail Layanan</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{order.service?.description}</p>
                        </div>
                    </motion.div>

                    {/* Result Documents (Reports) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
                    >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <FileText className="text-blue-500" />
                            Laporan Hasil Kerja
                        </h3>

                        {resultDocs.length > 0 ? (
                            <div className="space-y-3">
                                {resultDocs.map((doc: any) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                                                <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{doc.fileName}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Diupdate oleh {doc.uploader?.fullName}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDownload(doc)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-md"
                                        >
                                            <Download size={16} />
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                                <p className="text-gray-500 dark:text-gray-400">Belum ada laporan yang tersedia.</p>
                                <p className="text-xs text-gray-400 mt-1">Laporan akan muncul setelah akuntan menyelesaikan pekerjaan.</p>
                            </div>
                        )}

                        {/* Revision Section - Only for COMPLETED orders */}
                        {order.status === 'COMPLETED' && (
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <RefreshCw size={18} className="text-orange-500" />
                                        Ajukan Revisi
                                    </h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Sisa: {2 - (order.revisions?.length || 0)}x dari 2x
                                    </span>
                                </div>

                                {(order.revisions?.length || 0) >= 2 ? (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-sm font-medium text-red-700 dark:text-red-400">Kuota revisi habis</p>
                                                <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                                                    Anda telah menggunakan 2x kesempatan revisi. Untuk revisi tambahan, silakan hubungi customer service.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            Tidak puas dengan hasil? Anda dapat mengajukan revisi maksimal 2 kali.
                                        </p>
                                        <button
                                            onClick={() => setShowRevisionModal(true)}
                                            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            <RefreshCw size={18} />
                                            Ajukan Revisi ({2 - (order.revisions?.length || 0)}x tersisa)
                                        </button>
                                    </>
                                )}

                                {/* Revision History */}
                                {order.revisions && order.revisions.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Riwayat Revisi:</p>
                                        {order.revisions.map((rev: any, idx: number) => (
                                            <div key={rev.id || idx} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{rev.title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{rev.description}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${rev.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : rev.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                                                        {rev.status === 'COMPLETED' ? 'Selesai' : rev.status === 'IN_PROGRESS' ? 'Diproses' : 'Menunggu'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Right Column: Sidebar Info */}
                <div className="space-y-6">
                    {/* Payment Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700"
                    >
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <CreditCard size={20} className="text-purple-500" />
                            Informasi Pembayaran
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">Total Tagihan</span>
                                <span className="font-bold text-lg text-gray-900 dark:text-white">Rp {Number(order.totalAmount).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.bgColor} ${status.textColor}`}>
                                    {status.label}
                                </span>
                            </div>
                            {order.payment && (
                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 mb-1">Metode Pembayaran</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{order.payment.paymentMethod}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Client Documents */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <FileText size={20} className="text-emerald-500" />
                                Dokumen Anda
                            </h3>
                            {(order.status === 'PAID' || order.status === 'IN_PROGRESS') && (
                                <button
                                    onClick={() => router.push(`/dashboard/my-orders/${order.id}/upload`)}
                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                                >
                                    + Upload
                                </button>
                            )}
                        </div>

                        {clientDocs.length > 0 ? (
                            <div className="space-y-3">
                                {clientDocs.map((doc: any) => (
                                    <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <FileText size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{doc.fileName}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">Belum ada dokumen yang diupload.</p>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Revision Modal */}
            <RevisionModal
                isOpen={showRevisionModal}
                onClose={() => setShowRevisionModal(false)}
                orderId={order.id}
                orderTitle={order.service?.name || 'Pesanan'}
                currentRevisionCount={order.revisions?.length || 0}
                onSuccess={() => fetchOrder(order.id)}
            />
        </div>
    );
}
