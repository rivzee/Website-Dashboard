'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, X, AlertCircle, User, Calendar, DollarSign, Package } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { CompactLoading } from '@/client/components/LoadingSpinner';

export default function UploadResultPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;

    const [user, setUser] = useState<any>(null);
    const [order, setOrder] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchOrderDetail();
    }, []);

    const fetchOrderDetail = async () => {
        try {
            const res = await axios.get(`/api/orders/${orderId}`);
            setOrder(res.data);
        } catch (error) {
            toast.error('Gagal memuat detail pesanan');
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            toast.success('File berhasil dipilih!');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        },
        maxFiles: 1,
    });

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !user) {
            toast.error('Pilih file terlebih dahulu');
            return;
        }

        setUploading(true);
        const uploadToast = toast.loading('Mengupload hasil pekerjaan...');

        try {
            const fileUrl = `/uploads/results/${file.name}`;

            await axios.post('/api/documents', {
                fileName: file.name,
                fileUrl: fileUrl,
                fileType: file.type,
                isResult: true,
                orderId: orderId,
                uploaderId: user.id,
            });

            await axios.put(`/api/orders/${orderId}/status`, {
                status: 'COMPLETED',
            });

            toast.success('Hasil pekerjaan berhasil diupload!', { id: uploadToast });
            setTimeout(() => router.push('/dashboard/jobs'), 1500);
        } catch (error) {
            toast.error('Gagal upload hasil pekerjaan', { id: uploadToast });
        } finally {
            setUploading(false);
        }
    };

    if (!order) {
        return <CompactLoading message="Memuat detail pesanan..." />;
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Upload Hasil Pekerjaan</h1>
                <p className="text-gray-600 dark:text-gray-400">Upload hasil untuk diserahkan kepada klien</p>
            </motion.div>

            {/* Order Detail Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
            >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Detail Pesanan</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Klien</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{order.client?.fullName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.client?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                            <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Layanan</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{order.service?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Pembayaran</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                Rp {Number(order.totalAmount).toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl">
                            <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Order</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {new Date(order.createdAt).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Upload Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
            >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Upload File Hasil</h3>

                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer ${isDragActive
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400'
                        }`}
                >
                    <input {...getInputProps()} />
                    <motion.div
                        animate={{ y: isDragActive ? -10 : 0 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6"
                    >
                        <Upload size={40} className="text-white" />
                    </motion.div>

                    {isDragActive ? (
                        <p className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                            Lepaskan file di sini...
                        </p>
                    ) : (
                        <>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Drag & drop file atau klik untuk browse
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Mendukung PDF dan Excel (max 10MB)
                            </p>
                        </>
                    )}

                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {['PDF', 'XLS', 'XLSX'].map((type) => (
                            <span
                                key={type}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium"
                            >
                                {type}
                            </span>
                        ))}
                    </div>
                </div>

                {/* File Preview */}
                {file && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-500/30"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                    <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{file.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition text-red-600 dark:text-red-400"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Checklist */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="backdrop-blur-xl bg-green-50/60 dark:bg-green-900/20 rounded-3xl p-6 border border-green-200/50 dark:border-green-500/30"
            >
                <div className="flex gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-green-900 dark:text-green-300 mb-3">Hasil yang Harus Diupload:</h4>
                        <ul className="space-y-2 text-green-800 dark:text-green-400">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                                Laporan Laba Rugi
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                                Neraca
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                                SPT Tahunan (jika applicable)
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                                Laporan keuangan lengkap
                            </li>
                        </ul>
                    </div>
                </div>
            </motion.div>

            {/* Warning */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-xl bg-orange-50/60 dark:bg-orange-900/20 rounded-3xl p-6 border border-orange-200/50 dark:border-orange-500/30"
            >
                <div className="flex gap-3">
                    <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-1">Perhatian</h4>
                        <p className="text-sm text-orange-800 dark:text-orange-400">
                            Setelah upload, status pesanan akan otomatis berubah menjadi <strong>COMPLETED</strong> dan klien akan dapat mengunduh hasil pekerjaan.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4"
            >
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                    Batal
                </button>
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {uploading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Mengupload...
                        </>
                    ) : (
                        <>
                            <CheckCircle size={20} />
                            Upload & Selesaikan Pesanan
                        </>
                    )}
                </button>
            </motion.div>
        </div>
    );
}
