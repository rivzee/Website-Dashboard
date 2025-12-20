'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DataTable } from '@/client/components/DataTable';
import { FileText, DollarSign, Users, TrendingUp, Download } from 'lucide-react';
import axios from 'axios';
import { CompactLoading } from '@/client/components/LoadingSpinner';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            key: 'id',
            label: 'ID Pesanan',
            sortable: true,
            render: (value: any) => (
                <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                    #{value}
                </span>
            )
        },
        {
            key: 'client',
            label: 'Klien',
            sortable: true,
            render: (value: any, row: any) => (
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                        {row.client?.fullName || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {row.client?.email || ''}
                    </p>
                </div>
            )
        },
        {
            key: 'service',
            label: 'Layanan',
            sortable: true,
            render: (value: any, row: any) => (
                <span className="text-gray-900 dark:text-white">
                    {row.service?.name || 'N/A'}
                </span>
            )
        },
        {
            key: 'totalAmount',
            label: 'Total',
            sortable: true,
            render: (value: any) => (
                <span className="font-semibold text-gray-900 dark:text-white">
                    Rp {Number(value || 0).toLocaleString('id-ID')}
                </span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value: any) => {
                const statusColors: any = {
                    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
                    PAID: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                    IN_PROGRESS: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
                    COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                };

                const statusLabels: any = {
                    PENDING_PAYMENT: 'Menunggu Pembayaran',
                    PAID: 'Menunggu Verifikasi',
                    IN_PROGRESS: 'Sedang Dikerjakan',
                    COMPLETED: 'Selesai',
                    CANCELLED: 'Dibatalkan'
                };

                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
                        {statusLabels[value] || value}
                    </span>
                );
            }
        },
        {
            key: 'createdAt',
            label: 'Tanggal',
            sortable: true,
            render: (value: any) => (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {value ? new Date(value).toLocaleDateString('id-ID') : 'N/A'}
                </span>
            )
        }
    ];

    // Calculate stats
    const stats = {
        total: orders.length,
        pending: orders.filter((o: any) => o.status === 'PENDING_PAYMENT').length,
        completed: orders.filter((o: any) => o.status === 'COMPLETED').length,
        revenue: orders
            .filter((o: any) => o.status === 'COMPLETED')
            .reduce((sum: number, o: any) => sum + Number(o.totalAmount || 0), 0)
    };

    if (loading) {
        return <CompactLoading message="Memuat data pesanan..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Manajemen Pesanan
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Kelola dan pantau semua pesanan
                    </p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                    <Download size={18} />
                    Export Laporan
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Pesanan</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats.total}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Menunggu</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats.pending}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                            <TrendingUp className="text-yellow-600 dark:text-yellow-400" size={24} />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Selesai</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats.completed}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <Users className="text-green-600 dark:text-green-400" size={24} />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pendapatan</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                Rp {stats.revenue.toLocaleString('id-ID')}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <DollarSign className="text-purple-600 dark:text-purple-400" size={24} />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Orders Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <DataTable
                    columns={columns}
                    data={orders}
                    searchable={true}
                    filterable={true}
                />
            </motion.div>
        </div>
    );
}
