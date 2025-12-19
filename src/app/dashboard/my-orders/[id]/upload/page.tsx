'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, Upload, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { AlertModal } from '@/client/components/Modal';

export default function UploadPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [alertModal, setAlertModal] = useState<{ show: boolean; type: 'success' | 'error' | 'warning'; title: string; message: string }>({ show: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        if (params.id) {
            fetchOrder(params.id as string);
        }
    }, [params.id]);

    const fetchOrder = async (id: string) => {
        try {
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

    const handleUpload = async () => {
        if (files.length === 0) {
            setAlertModal({ show: true, type: 'warning', title: 'File Kosong', message: 'Pilih file terlebih dahulu sebelum upload.' });
            return;
        }
        setUploading(true);

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            // Process each file with real upload
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('type', 'document');

                const uploadRes = await axios.post('/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const fileUrl = uploadRes.data.url;

                await axios.post('/api/documents', {
                    fileName: file.name,
                    fileUrl: fileUrl,
                    fileType: file.type || 'application/pdf',
                    isResult: false,
                    orderId: order.id,
                    uploaderId: user.id
                });
            }

            setAlertModal({
                show: true,
                type: 'success',
                title: 'Berhasil!',
                message: `${files.length} dokumen berhasil diupload. Tim akuntan akan segera memprosesnya.`
            });
            setFiles([]);
        } catch (error) {
            console.error(error);
            setAlertModal({ show: true, type: 'error', title: 'Gagal!', message: 'Gagal mengupload dokumen. Silakan coba lagi.' });
        } finally {
            setUploading(false);
        }
    };

    const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleAlertClose = () => {
        setAlertModal({ ...alertModal, show: false });
        if (alertModal.type === 'success') {
            router.push('/dashboard/my-orders');
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
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Dokumen Pendukung</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Upload data yang diperlukan untuk pengerjaan layanan</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-8">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Dokumen yang biasanya diperlukan:</p>
                    <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 space-y-1">
                        <li>Rekening Koran (3 bulan terakhir)</li>
                        <li>Bukti Transaksi / Invoice</li>
                        <li>Data Aset & Inventaris</li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-emerald-500 transition cursor-pointer bg-gray-50 dark:bg-gray-800/50 relative">
                        <input
                            type="file"
                            multiple
                            onChange={addFiles}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="w-10 h-10 text-gray-400 mb-2 mx-auto" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">Drag & Drop atau Klik untuk upload</span>
                        <p className="text-xs text-gray-400 mt-1">PDF, Excel, JPG (Max 10MB)</p>
                    </div>

                    {files.length > 0 && (
                        <div className="space-y-2">
                            {files.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileText size={18} className="text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[200px]">{file.name}</span>
                                    </div>
                                    <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700">
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={uploading || files.length === 0}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Mengupload {files.length} file...
                            </>
                        ) : (
                            'Upload Dokumen'
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Alert Modal */}
            <AlertModal
                isOpen={alertModal.show}
                onClose={handleAlertClose}
                title={alertModal.title}
                message={alertModal.message}
                type={alertModal.type}
            />
        </div>
    );
}
