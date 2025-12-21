'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileEdit, Clock, CheckCircle, XCircle, AlertCircle, User, RefreshCw } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import LoadingSpinner from '@/client/components/LoadingSpinner';
import { useAutoSync } from '@/client/hooks/useAutoSync';

interface Revision {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
    order: {
        id: string;
        service: {
            name: string;
        };
    };
    requester: {
        fullName: string;
        email: string;
    };
    assignee: {
        fullName: string;
    } | null;
}

export default function RevisionsPage() {
    const [revisions, setRevisions] = useState<Revision[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');
    const [user, setUser] = useState<any>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        if (userData.id) {
            fetchRevisions(userData);
        }
    }, []);

    // Auto-sync every 15 seconds for real-time updates
    const { sync } = useAutoSync({
        interval: 15000, // 15 seconds
        onSync: () => user && fetchRevisions(user),
        enabled: !!user
    });

    const handleManualRefresh = async () => {
        if (!user) return;
        setIsRefreshing(true);
        await fetchRevisions(user);
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const fetchRevisions = async (userData?: any) => {
        try {
            const currentUser = userData || JSON.parse(localStorage.getItem('user') || '{}');
            const params = new URLSearchParams({
                userId: currentUser.id,
                role: currentUser.role,
            });

            const response = await axios.get(`/api/revisions?${params}`);
            setRevisions(response.data);
        } catch (error) {
            console.error('Error fetching revisions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusConfig = (status: string) => {
        const configs: any = {
            PENDING: {
                label: 'Menunggu',
                color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
                icon: Clock,
            },
            IN_PROGRESS: {
                label: 'Sedang Diproses',
                color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
                icon: AlertCircle,
            },
            COMPLETED: {
                label: 'Selesai',
                color: 'text-green-600 bg-green-100 dark:bg-green-900/30',
                icon: CheckCircle,
            },
            REJECTED: {
                label: 'Ditolak',
                color: 'text-red-600 bg-red-100 dark:bg-red-900/30',
                icon: XCircle,
            },
        };
        return configs[status] || configs.PENDING;
    };

    const filteredRevisions = revisions.filter((rev) => {
        if (filter === 'ALL') return true;
        return rev.status === filter;
    });

    if (isLoading) {
        return <LoadingSpinner message="Memuat Data Revisi..." fullScreen={false} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Revisi</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Daftar permintaan revisi dokumen
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Auto-sync aktif
                    </span>
                    <button
                        onClick={handleManualRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition shadow-md"
                    >
                        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                        {isRefreshing ? 'Menyegarkan...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        {status === 'ALL' ? 'Semua' : getStatusConfig(status).label}
                    </button>
                ))}
            </div>

            {/* Revisions List */}
            <div className="grid gap-4">
                {filteredRevisions.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <FileEdit size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Tidak ada revisi</p>
                    </div>
                ) : (
                    filteredRevisions.map((revision) => {
                        const statusConfig = getStatusConfig(revision.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <motion.div
                                key={revision.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3 mb-2">
                                            <FileEdit className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                                    {revision.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    {revision.order.service.name}
                                                </p>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                                    {revision.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 mt-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <User size={16} />
                                                <span>{revision.requester.fullName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Clock size={16} />
                                                <span>{new Date(revision.createdAt).toLocaleDateString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${statusConfig.color}`}
                                        >
                                            <StatusIcon size={16} />
                                            {statusConfig.label}
                                        </span>
                                        <Link
                                            href={`/dashboard/revisions/${revision.id}`}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Lihat Detail →
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
