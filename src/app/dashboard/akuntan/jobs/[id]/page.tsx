'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, Download, ArrowLeft, CheckCircle, Clock, AlertCircle, Play, Upload, User, RefreshCw } from 'lucide-react';
import { ConfirmModal, AlertModal } from '@/client/components/Modal';
import LoadingSpinner from '@/client/components/LoadingSpinner';

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [startModal, setStartModal] = useState(false);
    const [alertModal, setAlertModal] = useState<{ show: boolean; type: 'success' | 'error'; title: string; message: string }>({ show: false, type: 'success', title: '', message: '' });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchJob(params.id as string);
        }
    }, [params.id]);

    const fetchJob = async (id: string) => {
        try {
            const res = await axios.get(`/api/orders/${id}`);
            setJob(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (doc: any) => {
        window.open(doc.fileUrl, '_blank');
    };

    const handleStartJob = async () => {
        setStartModal(true);
    };

    const confirmStartJob = async () => {
        setProcessing(true);
        try {
            await axios.put(`/api/orders/${job.id}/status`, { status: 'IN_PROGRESS' });
            setJob({ ...job, status: 'IN_PROGRESS' });
            setStartModal(false);
        } catch (error) {
            setStartModal(false);
            setAlertModal({ show: true, type: 'error', title: 'Gagal!', message: 'Gagal update status. Silakan coba lagi.' });
        } finally {
            setProcessing(false);
        }
    };

    const handleFinishJob = async () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');

                // Real upload
                const formData = new FormData();
                formData.append('file', file);
                formData.append('type', 'result');

                const uploadRes = await axios.post('/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const fileUrl = uploadRes.data.url;

                await axios.post('/api/documents', {
                    fileName: file.name,
                    fileUrl: fileUrl,
                    fileType: file.type || 'application/pdf',
                    isResult: true,
                    orderId: job.id,
                    uploaderId: user.id
                });

                await axios.put(`/api/orders/${job.id}/status`, { status: 'COMPLETED' });
                setJob({ ...job, status: 'COMPLETED' });
                setAlertModal({ show: true, type: 'success', title: 'Berhasil!', message: 'Pekerjaan selesai & laporan terkirim ke klien!' });
                fetchJob(job.id);
            } catch (error) {
                console.error(error);
                setAlertModal({ show: true, type: 'error', title: 'Gagal!', message: 'Gagal menyelesaikan pekerjaan. Silakan coba lagi.' });
            }
        };
        fileInput.click();
    };

    if (loading) return <LoadingSpinner message="Memuat Detail Pekerjaan..." fullScreen={false} />;
    if (!job) return <div className="p-8 text-center">Pekerjaan tidak ditemukan</div>;

    const clientDocs = job.documents?.filter((d: any) => !d.isResult) || [];
    const resultDocs = job.documents?.filter((d: any) => d.isResult) || [];

    const statusConfig = (status: string) => {
        switch (status) {
            case 'PAID':
                return { color: 'blue', bgColor: 'bg-blue-500/10', textColor: 'text-blue-600 dark:text-blue-400', borderColor: 'border-blue-200 dark:border-blue-500/30', icon: CheckCircle, label: 'Siap Dikerjakan' };
            case 'COMPLETED':
                return { color: 'green', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-600 dark:text-emerald-400', borderColor: 'border-emerald-200 dark:border-emerald-500/30', icon: CheckCircle, label: 'Selesai' };
            case 'IN_PROGRESS':
                return { color: 'yellow', bgColor: 'bg-yellow-500/10', textColor: 'text-yellow-600 dark:text-yellow-400', borderColor: 'border-yellow-200 dark:border-yellow-500/30', icon: Clock, label: 'Sedang Dikerjakan' };
            default:
                return { color: 'gray', bgColor: 'bg-gray-500/10', textColor: 'text-gray-600', borderColor: 'border-gray-200', icon: AlertCircle, label: 'Status Lain' };
        }
    };

    const status = statusConfig(job.status);
    const StatusIcon = status.icon;

    return (
        <div className="max-w-5xl mx-auto">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition">
                <ArrowLeft size={20} /> Kembali
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Job Info & Client Docs */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{job.service?.name}</h1>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <User size={16} />
                                    <span>Klien: {job.client?.fullName}</span>
                                </div>
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.bgColor} border ${status.borderColor}`}>
                                <StatusIcon size={16} className={status.textColor} />
                                <span className={`text-sm font-bold ${status.textColor}`}>{status.label}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Deskripsi Layanan</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{job.service?.description}</p>
                        </div>

                        {job.notes && (
                            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Catatan Klien:</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{job.notes}</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Client Documents Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
                    >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <FileText className="text-emerald-500" />
                            Dokumen dari Klien
                        </h3>

                        {clientDocs.length > 0 ? (
                            <div className="space-y-3">
                                {clientDocs.map((doc: any) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                                                <FileText className="text-gray-500 dark:text-gray-400" size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{doc.fileName}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Diupload: {new Date(doc.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDownload(doc)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-semibold transition shadow-sm"
                                        >
                                            <Download size={16} />
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                                <p className="text-gray-500 dark:text-gray-400">Klien belum mengupload dokumen.</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Revisions Section - Sync with Client */}
                    {job.revisions && job.revisions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <RefreshCw className="text-orange-500" />
                                    Permintaan Revisi dari Klien
                                </h3>
                                <span className="text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full font-medium">
                                    {job.revisions.filter((r: any) => r.status === 'PENDING').length} menunggu
                                </span>
                            </div>

                            <div className="space-y-4">
                                {job.revisions.map((revision: any) => {
                                    const revStatusConfig: Record<string, { bg: string; text: string; label: string }> = {
                                        'PENDING': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', label: 'Menunggu' },
                                        'IN_PROGRESS': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: 'Diproses' },
                                        'COMPLETED': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: 'Selesai' },
                                        'REJECTED': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', label: 'Ditolak' },
                                    };
                                    const revConfig = revStatusConfig[revision.status] || revStatusConfig['PENDING'];

                                    return (
                                        <div key={revision.id} className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">{revision.title}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{revision.description}</p>
                                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <User size={12} />
                                                            {revision.requester?.fullName || 'Klien'}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={12} />
                                                            {new Date(revision.createdAt).toLocaleDateString('id-ID')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${revConfig.bg} ${revConfig.text}`}>
                                                    {revConfig.label}
                                                </span>
                                            </div>

                                            {/* Action Buttons for Revision */}
                                            <div className="flex gap-2 mt-3 pt-3 border-t border-orange-200 dark:border-orange-800">
                                                {revision.status === 'PENDING' && (
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                const user = JSON.parse(localStorage.getItem('user') || '{}');
                                                                await axios.patch(`/api/revisions/${revision.id}`, {
                                                                    status: 'IN_PROGRESS',
                                                                    assignedTo: user.id,
                                                                });
                                                                setAlertModal({ show: true, type: 'success', title: 'Berhasil!', message: 'Revisi mulai diproses. Klien akan mendapat notifikasi.' });
                                                                fetchJob(job.id);
                                                            } catch (error) {
                                                                console.error(error);
                                                                setAlertModal({ show: true, type: 'error', title: 'Gagal!', message: 'Gagal memproses revisi.' });
                                                            }
                                                        }}
                                                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                                                    >
                                                        <Play size={14} /> Mulai Kerjakan
                                                    </button>
                                                )}
                                                {revision.status === 'IN_PROGRESS' && (
                                                    <button
                                                        onClick={async () => {
                                                            // Create file input for uploading revision result
                                                            const fileInput = document.createElement('input');
                                                            fileInput.type = 'file';
                                                            fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar';
                                                            fileInput.onchange = async (e: any) => {
                                                                const file = e.target.files[0];
                                                                if (!file) return;

                                                                try {
                                                                    const user = JSON.parse(localStorage.getItem('user') || '{}');

                                                                    // Upload file
                                                                    const formData = new FormData();
                                                                    formData.append('file', file);
                                                                    formData.append('type', 'revision');

                                                                    const uploadRes = await axios.post('/api/upload', formData, {
                                                                        headers: { 'Content-Type': 'multipart/form-data' }
                                                                    });

                                                                    const fileUrl = uploadRes.data.url;

                                                                    // Save document as revision result
                                                                    await axios.post('/api/documents', {
                                                                        fileName: `[REVISI] ${file.name}`,
                                                                        fileUrl: fileUrl,
                                                                        fileType: file.type || 'application/pdf',
                                                                        isResult: true,
                                                                        orderId: job.id,
                                                                        uploaderId: user.id
                                                                    });

                                                                    // Update revision status to COMPLETED
                                                                    await axios.patch(`/api/revisions/${revision.id}`, {
                                                                        status: 'COMPLETED',
                                                                    });

                                                                    setAlertModal({ show: true, type: 'success', title: 'Berhasil!', message: 'Dokumen revisi berhasil diupload! Klien akan mendapat notifikasi.' });
                                                                    fetchJob(job.id);
                                                                } catch (error) {
                                                                    console.error(error);
                                                                    setAlertModal({ show: true, type: 'error', title: 'Gagal!', message: 'Gagal mengupload dokumen revisi. Silakan coba lagi.' });
                                                                }
                                                            };
                                                            fileInput.click();
                                                        }}
                                                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                                                    >
                                                        <Upload size={14} /> Upload & Selesaikan Revisi
                                                    </button>
                                                )}
                                                {revision.status === 'COMPLETED' && (
                                                    <div className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                                                        <CheckCircle size={14} /> Sudah Selesai
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-24"
                    >
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Aksi Pekerjaan</h3>

                        <div className="space-y-3">
                            {job.status === 'PAID' && (
                                <button
                                    onClick={handleStartJob}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/30"
                                >
                                    <Play size={18} /> Mulai Kerjakan
                                </button>
                            )}

                            {job.status === 'IN_PROGRESS' && (
                                <button
                                    onClick={handleFinishJob}
                                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/30"
                                >
                                    <Upload size={18} /> Upload Hasil & Selesai
                                </button>
                            )}

                            {job.status === 'COMPLETED' && (
                                <div className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl font-bold flex items-center justify-center gap-2">
                                    <CheckCircle size={18} /> Pekerjaan Selesai
                                </div>
                            )}
                        </div>

                        {/* Result Docs Preview */}
                        {resultDocs.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Hasil Pekerjaan:</h4>
                                <div className="space-y-2">
                                    {resultDocs.map((doc: any) => (
                                        <div key={doc.id} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <CheckCircle size={14} className="text-green-500" />
                                            <span className="truncate">{doc.fileName}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Start Job Confirmation Modal */}
            <ConfirmModal
                isOpen={startModal}
                onClose={() => setStartModal(false)}
                onConfirm={confirmStartJob}
                title="Mulai Kerjakan Tugas?"
                message="Anda akan memulai tugas ini. Status akan berubah menjadi 'Sedang Dikerjakan'."
                confirmText="Mulai"
                cancelText="Batal"
                type="info"
                loading={processing}
            />

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
