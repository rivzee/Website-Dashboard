'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, Download, ArrowLeft, CheckCircle, Clock, AlertCircle, Play, Upload, User } from 'lucide-react';

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchJob(params.id as string);
        }
    }, [params.id]);

    const fetchJob = async (id: string) => {
        try {
            const res = await axios.get(`http://localhost:3001/orders/${id}`);
            setJob(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (doc: any) => {
        // Simulate download
        alert(`Mendownload ${doc.fileName}...`);
        window.open(doc.fileUrl, '_blank');
    };

    const handleStartJob = async () => {
        if (!confirm('Mulai kerjakan tugas ini?')) return;
        try {
            await axios.put(`http://localhost:3001/orders/${job.id}/status`, { status: 'IN_PROGRESS' });
            setJob({ ...job, status: 'IN_PROGRESS' });
        } catch (error) {
            alert('Gagal update status');
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
                // Simulate upload
                await new Promise(resolve => setTimeout(resolve, 1000));
                const fakeUrl = `https://storage.example.com/results/${file.name}`;

                await axios.post('http://localhost:3001/documents', {
                    fileName: file.name,
                    fileUrl: fakeUrl,
                    fileType: file.type || 'application/pdf',
                    isResult: true,
                    orderId: job.id,
                    uploaderId: user.id
                });

                await axios.put(`http://localhost:3001/orders/${job.id}/status`, { status: 'COMPLETED' });
                setJob({ ...job, status: 'COMPLETED' });
                alert('Pekerjaan selesai & laporan terkirim!');
                fetchJob(job.id); // Refresh to see new doc
            } catch (error) {
                console.error(error);
                alert('Gagal menyelesaikan pekerjaan');
            }
        };
        fileInput.click();
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
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
        </div>
    );
}
