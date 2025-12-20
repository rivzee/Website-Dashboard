'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Play, CheckCircle, Upload, FileText, Clock, RefreshCw } from 'lucide-react';
import { ConfirmModal, AlertModal } from '@/client/components/Modal';

export default function AkuntanJobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [startModal, setStartModal] = useState<{ show: boolean; jobId: string | null }>({ show: false, jobId: null });
    const [alertModal, setAlertModal] = useState<{ show: boolean; type: 'success' | 'error'; title: string; message: string }>({ show: false, type: 'success', title: '', message: '' });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get('/api/orders');
            setJobs(res.data.filter((o: any) => ['PAID', 'IN_PROGRESS', 'COMPLETED'].includes(o.status)));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartJob = async (jobId: string) => {
        setStartModal({ show: true, jobId });
    };

    const confirmStartJob = async () => {
        if (!startModal.jobId) return;
        setProcessing(true);

        try {
            await axios.put(`/api/orders/${startModal.jobId}/status`, { status: 'IN_PROGRESS' });
            setJobs(jobs.map(j => j.id === startModal.jobId ? { ...j, status: 'IN_PROGRESS' } : j));
            setStartModal({ show: false, jobId: null });
        } catch (error) {
            setStartModal({ show: false, jobId: null });
            setAlertModal({ show: true, type: 'error', title: 'Gagal!', message: 'Gagal update status. Silakan coba lagi.' });
        } finally {
            setProcessing(false);
        }
    };

    const handleFinishJob = async (jobId: string) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');

                // Real upload using FormData
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
                    orderId: jobId,
                    uploaderId: user.id
                });

                await axios.put(`/api/orders/${jobId}/status`, { status: 'COMPLETED' });

                setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'COMPLETED' } : j));
                setAlertModal({ show: true, type: 'success', title: 'Berhasil!', message: 'Pekerjaan selesai & laporan terkirim ke klien!' });
            } catch (error) {
                console.error(error);
                setAlertModal({ show: true, type: 'error', title: 'Gagal!', message: 'Gagal menyelesaikan pekerjaan. Silakan coba lagi.' });
            }
        };
        fileInput.click();
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-blue-100 text-blue-700';
            case 'COMPLETED': return 'bg-green-100 text-green-700';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Daftar Pekerjaan</h1>
                <p className="text-gray-500">Ambil dan selesaikan tugas yang tersedia</p>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p>Loading...</p>
                ) : jobs.length === 0 ? (
                    <p>Belum ada pekerjaan tersedia.</p>
                ) : (
                    jobs.map((job) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                        <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(job.status)}`}>
                                        {job.status === 'PAID' ? 'SIAP DIKERJAKAN' :
                                            job.status === 'IN_PROGRESS' ? 'SEDANG DIKERJAKAN' :
                                                job.status === 'COMPLETED' ? 'SELESAI' : job.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{job.service?.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    Klien: {job.client?.fullName}
                                </p>

                                {/* Revision Indicator */}
                                {job.revisions && job.revisions.filter((r: any) => r.status === 'PENDING').length > 0 && (
                                    <div className="flex items-center gap-2 mb-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                        <RefreshCw size={14} className="text-orange-500" />
                                        <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                                            {job.revisions.filter((r: any) => r.status === 'PENDING').length} revisi menunggu
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                                    <Clock size={14} />
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                                <a
                                    href={`/dashboard/akuntan/jobs/${job.id}`}
                                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition flex items-center justify-center gap-2"
                                >
                                    <FileText size={16} /> Lihat Detail & Dokumen
                                </a>

                                {job.status === 'PAID' && (
                                    <button
                                        onClick={() => handleStartJob(job.id)}
                                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                                    >
                                        <Play size={16} /> Mulai Kerjakan
                                    </button>
                                )}
                                {job.status === 'IN_PROGRESS' && (
                                    <button
                                        onClick={() => handleFinishJob(job.id)}
                                        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                                    >
                                        <Upload size={16} /> Upload Hasil & Selesai
                                    </button>
                                )}
                                {job.status === 'COMPLETED' && (
                                    <button disabled className="w-full py-2 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700">
                                        <CheckCircle size={16} /> Selesai
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Start Job Confirmation Modal */}
            <ConfirmModal
                isOpen={startModal.show}
                onClose={() => setStartModal({ show: false, jobId: null })}
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
