'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CreditCard, Upload, ArrowLeft, CheckCircle } from 'lucide-react';

export default function PaymentPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

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
            const res = await axios.get(`http://localhost:3001/orders/my/${user.id}`);
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
        if (!file) return alert('Mohon upload bukti transfer');

        setUploading(true);

        // SIMULATE UPLOAD
        await new Promise(resolve => setTimeout(resolve, 2000));
        const fakeUrl = `https://storage.example.com/proof-${Date.now()}.jpg`;

        try {
            await axios.post('http://localhost:3001/payments', {
                amount: Number(order.totalAmount),
                paymentMethod: 'TRANSFER_BCA',
                proofUrl: fakeUrl,
                orderId: order.id
            });

            alert('Pembayaran Berhasil Dikirim! Menunggu verifikasi admin.');
            router.push('/dashboard/my-orders');
        } catch (error) {
            console.error(error);
            alert('Gagal mengirim pembayaran');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
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
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition cursor-pointer bg-gray-50 dark:bg-gray-800/50">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                {file ? (
                                    <>
                                        <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</span>
                                    </>
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
        </div>
    );
}
