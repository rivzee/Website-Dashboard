'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, FileText, CreditCard, Package, TrendingUp, Calendar } from 'lucide-react';

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const u = JSON.parse(storedUser);
            setUser(u);
            fetchMyOrders(u.id);
        }
    }, []);

    const fetchMyOrders = async (clientId: string) => {
        try {
            const res = await axios.get(`http://localhost:3001/orders/my/${clientId}`);
            setOrders(res.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const statusConfig = (status: string) => {
        switch (status) {
            case 'PAID':
                return { color: 'blue', bgColor: 'bg-blue-500/10', textColor: 'text-blue-600 dark:text-blue-400', borderColor: 'border-blue-200 dark:border-blue-500/30', icon: CheckCircle, label: 'Menunggu Verifikasi' };
            case 'COMPLETED':
                return { color: 'green', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-600 dark:text-emerald-400', borderColor: 'border-emerald-200 dark:border-emerald-500/30', icon: CheckCircle, label: 'Selesai' };
            case 'IN_PROGRESS':
                return { color: 'yellow', bgColor: 'bg-yellow-500/10', textColor: 'text-yellow-600 dark:text-yellow-400', borderColor: 'border-yellow-200 dark:border-yellow-500/30', icon: Clock, label: 'Sedang Dikerjakan' };
            default:
                return { color: 'orange', bgColor: 'bg-orange-500/10', textColor: 'text-orange-600 dark:text-orange-400', borderColor: 'border-orange-200 dark:border-orange-500/30', icon: AlertCircle, label: 'Menunggu Pembayaran' };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Pesanan Saya</h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Kelola dan pantau semua pesanan Anda</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Total Pesanan', value: orders.length, icon: Package, color: 'blue' },
                    { label: 'Selesai', value: orders.filter(o => o.status === 'COMPLETED').length, icon: CheckCircle, color: 'green' },
                    { label: 'Dalam Proses', value: orders.filter(o => o.status !== 'COMPLETED').length, icon: TrendingUp, color: 'orange' },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-${stat.color}-500/10`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-12 text-center border border-gray-200/50 dark:border-gray-700/50"
                    >
                        <FileText className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={64} />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Belum Ada Pesanan</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Mulai dengan memilih paket layanan yang sesuai</p>
                        <Link
                            href="/dashboard/order"
                            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg"
                        >
                            Lihat Layanan
                        </Link>
                    </motion.div>
                ) : (
                    orders.map((order, idx) => {
                        const status = statusConfig(order.status);
                        const StatusIcon = status.icon;

                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    {/* Left: Order Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                                    {order.service?.name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <Calendar size={16} />
                                                    <span>
                                                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.bgColor} border ${status.borderColor}`}>
                                                <StatusIcon size={16} className={status.textColor} />
                                                <span className={`text-sm font-bold ${status.textColor}`}>{status.label}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-baseline gap-2">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Total:</span>
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                Rp {Number(order.totalAmount).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        {order.status === 'PENDING_PAYMENT' && !order.payment && (
                                            <Link
                                                href={`/dashboard/my-orders/${order.id}/payment`}
                                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg"
                                            >
                                                <CreditCard size={18} />
                                                Bayar Sekarang
                                            </Link>
                                        )}
                                        {(order.status === 'PAID' || order.status === 'IN_PROGRESS') && (
                                            <Link
                                                href={`/dashboard/my-orders/${order.id}/upload`}
                                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg"
                                            >
                                                <FileText size={18} />
                                                Upload Dokumen
                                            </Link>
                                        )}
                                        <Link
                                            href={`/dashboard/my-orders/${order.id}`}
                                            className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                        >
                                            Lihat Detail
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
