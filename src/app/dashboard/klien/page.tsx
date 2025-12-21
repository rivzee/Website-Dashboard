'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Clock, CheckCircle, Package, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import { EnhancedPieChart } from '@/client/components/EnhancedCharts';
import { useAutoSync } from '@/client/hooks/useAutoSync';
import Link from 'next/link';
import LoadingSpinner from '@/client/components/LoadingSpinner';

export default function KlienDashboard() {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({
        totalOrders: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Auto-sync every 30 seconds to keep data fresh
    const { sync } = useAutoSync({
        interval: 30000, // 30 seconds
        onSync: () => user && fetchStats(user.id),
        enabled: !!user // Only sync when user is loaded
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            fetchStats(userData.id);
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchStats = async (clientId: string) => {
        setIsLoading(true);
        try {
            const orders = await axios.get(`/api/orders/my/${clientId}`);
            const data = orders.data;

            setRecentOrders(data.slice(0, 4)); // Get 4 recent orders

            setStats({
                totalOrders: data.length,
                pending: data.filter((o: any) => o.status === 'PENDING_PAYMENT').length,
                inProgress: data.filter((o: any) => o.status === 'PAID' || o.status === 'IN_PROGRESS').length,
                completed: data.filter((o: any) => o.status === 'COMPLETED').length,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Pesanan', value: stats.totalOrders, icon: ShoppingCart, color: 'blue', gradient: 'from-blue-500 to-indigo-500' },
        { label: 'Menunggu Pembayaran', value: stats.pending, icon: Clock, color: 'orange', gradient: 'from-orange-500 to-red-500' },
        { label: 'Sedang Diproses', value: stats.inProgress, icon: Package, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
        { label: 'Selesai', value: stats.completed, icon: CheckCircle, color: 'emerald', gradient: 'from-emerald-500 to-teal-500' },
    ];

    const chartData = [
        { name: 'Menunggu', value: stats.pending },
        { name: 'Diproses', value: stats.inProgress },
        { name: 'Selesai', value: stats.completed },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    // Show modern loading animation
    if (isLoading) {
        return <LoadingSpinner message="Memuat Data Dashboard..." fullScreen={false} />;
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Modern Header Section */}
            <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-1 shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-[22px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 bg-white rounded-2xl p-3 shadow-lg flex-shrink-0">
                            <img src="/logo-risabur.png" alt="RISA BUR Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/10 backdrop-blur-md">
                                    Dashboard Klien
                                </span>
                                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{user?.fullName || 'Partner'}</span>! 👋
                            </h1>
                            <p className="text-gray-400 max-w-xl">
                                RISA BUR - Kantor Jasa Akuntan. Pantau status pesanan dan laporan keuangan Anda secara real-time.
                            </p>
                        </div>
                    </div>
                    <Link href="/dashboard/order">
                        <button className="group relative px-6 py-3 bg-white text-gray-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 overflow-hidden">
                            <span className="relative z-10">Buat Pesanan Baru</span>
                            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </Link>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={idx}
                            variants={item}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="relative group overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300"
                        >

                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-${stat.color}-500/30`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <motion.div
                    variants={item}
                    className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-xl flex flex-col"
                >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <div className="w-1 h-6 bg-blue-500 rounded-full" />
                        Status Pesanan
                    </h3>
                    <div className="flex-1 flex items-center justify-center min-h-[300px]">
                        <EnhancedPieChart data={chartData} title="" />
                    </div>
                </motion.div>

                {/* Recent Orders Section */}
                <motion.div
                    variants={item}
                    className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <div className="w-1 h-6 bg-purple-500 rounded-full" />
                            Aktivitas Terbaru
                        </h3>
                        <Link href="/dashboard/my-orders" className="text-sm text-purple-600 dark:text-purple-400 font-medium hover:underline">
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order: any, i) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-purple-100 dark:hover:border-purple-500/30 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                            order.status === 'PAID' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                                'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                                            }`}>
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                {order.service?.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                                <Clock size={12} />
                                                {new Date(order.createdAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' :
                                            order.status === 'PAID' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                                                'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
                                            }`}>
                                            {order.status === 'PAID' ? 'Menunggu Verifikasi' :
                                                order.status === 'PENDING_PAYMENT' ? 'Menunggu Pembayaran' :
                                                    order.status === 'IN_PROGRESS' ? 'Sedang Dikerjakan' :
                                                        order.status === 'COMPLETED' ? 'Selesai' : order.status}
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 transition-colors" />
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-600">
                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada pesanan terbaru.</p>
                                <Link href="/dashboard/order" className="text-sm text-purple-600 hover:underline mt-2 inline-block">
                                    Buat pesanan sekarang
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
