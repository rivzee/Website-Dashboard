'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CreditCard, Upload, ArrowLeft, CheckCircle, Clock, Shield } from 'lucide-react';
import { AlertModal } from '@/client/components/Modal';
import LoadingSpinner from '@/client/components/LoadingSpinner';

export default function PaymentPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [alertModal, setAlertModal] = useState<{ show: boolean; type: 'error' | 'warning'; title: string; message: string }>({ show: false, type: 'error', title: '', message: '' });

    useEffect(() => {
        if (params.id) {
            fetchOrder(params.id as string);
        }
    }, [params.id]);

    const fetchOrder = async (id: string) => {
        try {
            // In a real app, we might need a specific endpoint or just filter from my-orders
            // For now, let's assume we can get it from the list or a detail endpoint
            // Since we don't have a direct single order endpoint for client (only by user), 
            // we might need to fetch all and find, or use the admin one if accessible (unlikely).
            // Let's try the admin/general one if it's not protected, or just fetch all my orders.
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const res = await axios.get(`/api/orders/my/${user.id}`);
            const found = res.data.find((o: any) => o.id === id);
            setOrder(found);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setAlertModal({ show: true, type: 'warning', title: 'File Kosong', message: 'Mohon upload bukti transfer terlebih dahulu.' });
            return;
        }

        setUploading(true);

        try {
            // REAL UPLOAD - Send file to server
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'payment');

            const uploadRes = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const proofUrl = uploadRes.data.url;

            // Create payment record with the uploaded proof URL
            await axios.post('/api/payments', {
                amount: Number(order.totalAmount),
                paymentMethod: 'TRANSFER_BCA',
                proofUrl: proofUrl,
                orderId: order.id
            });

            // Show success modal instead of alert
            setShowSuccess(true);
        } catch (error: any) {
            console.error(error);
            setAlertModal({ show: true, type: 'error', title: 'Gagal!', message: error.response?.data?.error || 'Gagal mengirim pembayaran. Silakan coba lagi.' });
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <LoadingSpinner message="Memuat Halaman Pembayaran..." fullScreen={false} />;
    if (!order) return <div className="p-8 text-center">Order tidak ditemukan</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition">
                <ArrowLeft size={20} /> Kembali
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pembayaran Pesanan</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Selesaikan pembayaran untuk memulai layanan</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500 dark:text-gray-400">Layanan</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{order.service?.name}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-500 dark:text-gray-400">Total Tagihan</span>
                        <span className="font-bold text-xl text-blue-600 dark:text-blue-400">Rp {Number(order.totalAmount).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Transfer ke Rekening BCA:</p>
                        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                            <span className="font-mono text-lg">123 456 7890</span>
                            <span className="text-sm text-gray-500">a.n. PT Akuntansi Mitra</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Upload Bukti Transfer
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 transition cursor-pointer bg-gray-50 dark:bg-gray-800/50">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const selectedFile = e.target.files?.[0] || null;
                                    setFile(selectedFile);
                                    if (selectedFile) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setPreview(reader.result as string);
                                        };
                                        reader.readAsDataURL(selectedFile);
                                    } else {
                                        setPreview(null);
                                    }
                                }}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                {preview ? (
                                    <div className="space-y-3">
                                        <img
                                            src={preview}
                                            alt="Preview Bukti Pembayaran"
                                            className="max-h-48 rounded-lg mx-auto shadow-lg"
                                        />
                                        <div className="flex items-center justify-center gap-2 text-green-500">
                                            <CheckCircle className="w-5 h-5" />
                                            <span className="text-sm font-medium">{file?.name}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">Klik untuk ganti gambar</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Klik untuk upload gambar (JPG, PNG)</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading || !file}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            'Konfirmasi Pembayaran'
                        )}
                    </button>
                </form>
            </motion.div>

            {/* Success Modal */}
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
                    >
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            Pembayaran Berhasil Dikirim!
                        </h2>

                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400 mb-2">
                                <Clock className="w-5 h-5" />
                                <span className="font-semibold">Menunggu Verifikasi</span>
                            </div>
                            <p className="text-sm text-orange-700 dark:text-orange-300">
                                Bukti pembayaran Anda sedang ditinjau oleh Admin. Anda akan mendapat notifikasi setelah diverifikasi.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-6">
                            <Shield className="w-4 h-4" />
                            <span>Proses verifikasi 1x24 jam kerja</span>
                        </div>

                        <button
                            onClick={() => router.push('/dashboard/my-orders')}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
                        >
                            Lihat Pesanan Saya
                        </button>
                    </motion.div>
                </motion.div>
            )}

            {/* Alert Modal */}
            <AlertModal
                isOpen={alertModal.show}
                onClose={() => setAlertModal({ ...alertModal, show: false })}
                title={alertModal.title}
                message={alertModal.message}
                type={alertModal.type}
            />
        </div>
    );
}
