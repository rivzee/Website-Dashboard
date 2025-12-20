'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Package,
    FileText,
    Activity,
    TrendingUp,
    Clock,
    Plus,
    UserPlus,
    Settings,
    Bell,
    Calendar,
    DollarSign,
    CheckCircle,
    XCircle,
    AlertCircle,
    Star,
    ArrowRight
} from 'lucide-react';
import { EnhancedLineChart, EnhancedBarChart, EnhancedPieChart } from '@/client/components/EnhancedCharts';
import Link from 'next/link';
import { useToast } from '@/client/hooks/useToast';
import { useAutoSync } from '@/client/hooks/useAutoSync';
import apiService from '@/client/services/api.service';
import { DashboardSkeleton } from '@/client/components/Skeletons';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalServices: 0,
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        revenue: 0,
    });

    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [topServices, setTopServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState<any[]>([]);
    const toast = useToast();

    // Auto-sync disabled temporarily to fix loop
    // const { sync } = useAutoSync({
    //     interval: 30000,
    //     onSync: () => fetchStats(),
    //     enabled: !isLoading
    // });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const [users, services, orders] = await Promise.all([
                apiService.users.getAll(),
                apiService.services.getAll(),
                apiService.orders.getAll(),
            ]);

            setRecentOrders(orders.slice(0, 5));
            setRecentUsers(users.slice(-5).reverse());

            // Calculate top services
            const serviceCounts: any = {};
            orders.forEach((order: any) => {
                const serviceName = order.service?.name || 'Unknown';
                serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
            });
            const topServicesArray = Object.entries(serviceCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a: any, b: any) => b.count - a.count)
                .slice(0, 5);
            setTopServices(topServicesArray);

            // Calculate revenue
            const totalRevenue = orders
                .filter((o: any) => o.status === 'COMPLETED')
                .reduce((sum: number, o: any) => sum + Number(o.totalAmount || 0), 0);

            setStats({
                totalUsers: users.length,
                totalServices: services.length,
                totalOrders: orders.length,
                completedOrders: orders.filter((o: any) => o.status === 'COMPLETED').length,
                pendingOrders: orders.filter((o: any) => o.status === 'PENDING_PAYMENT').length,
                revenue: totalRevenue,
            });

            // Calculate revenue trend (last 6 months)
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            const today = new Date();
            const last6Months = Array.from({ length: 6 }, (_, i) => {
                const d = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1);
                return {
                    monthIndex: d.getMonth(),
                    year: d.getFullYear(),
                    name: months[d.getMonth()],
                    value: 0
                };
            });

            orders.forEach((order: any) => {
                if (order.status === 'COMPLETED') {
                    const orderDate = new Date(order.createdAt);
                    const monthIndex = orderDate.getMonth();
                    const year = orderDate.getFullYear();

                    const monthData = last6Months.find(m => m.monthIndex === monthIndex && m.year === year);
                    if (monthData) {
                        monthData.value += Number(order.totalAmount || 0);
                    }
                }
            });

            setChartData(last6Months);

            // toast.success('Dashboard berhasil dimuat');
        } catch (error: any) {
            console.error('Error fetching stats:', error);
            // toast.error('Gagal memuat dashboard', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Pengguna', value: stats.totalUsers, icon: Users, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
        { label: 'Total Layanan', value: stats.totalServices, icon: Package, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
        { label: 'Total Pesanan', value: stats.totalOrders, icon: FileText, color: 'green', gradient: 'from-emerald-500 to-teal-500' },
        { label: 'Pendapatan', value: `Rp ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'orange', gradient: 'from-orange-500 to-red-500' },
    ];

    const quickActions = [
        { label: 'Tambah Pengguna', icon: UserPlus, href: '/dashboard/users', color: 'blue' },
        { label: 'Tambah Layanan', icon: Plus, href: '/dashboard/services', color: 'purple' },
        { label: 'Lihat Pesanan', icon: FileText, href: '/dashboard/admin/orders', color: 'green' },
        { label: 'Verifikasi Pembayaran', icon: DollarSign, href: '/dashboard/payments', color: 'orange' },
    ];

    const orderStatusData = [
        { name: 'Selesai', value: stats.completedOrders },
        { name: 'Menunggu', value: stats.pendingOrders },
        { name: 'Diproses', value: stats.totalOrders - stats.completedOrders - stats.pendingOrders },
    ];

    // Show loading skeleton
    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8">
            {/* Header with Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-lg border border-gray-200 dark:border-gray-700">
                        <img src="/logo-risabur.png" alt="RISA BUR Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 whitespace-nowrap">
                            Dashboard Admin
                        </h1>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 md:mt-0 w-full md:w-auto">
                    {quickActions.map((action, idx) => {
                        const Icon = action.icon;
                        const colorClasses: any = {
                            blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
                            purple: 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20',
                            green: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20',
                            orange: 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/20',
                            gray: 'bg-gray-600 hover:bg-gray-700 shadow-gray-500/20'
                        };

                        return (
                            <Link key={idx} href={action.href} className="w-full">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl shadow-lg transition-all w-full ${colorClasses[action.color]}`}
                                >
                                    <Icon size={16} />
                                    <span className="whitespace-nowrap">{action.label}</span>
                                </motion.button>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="relative group overflow-hidden backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500`} />

                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 relative z-10">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white relative z-10">{stat.value}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                >
                    <EnhancedLineChart data={chartData} title="Tren Pendapatan" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                >
                    <EnhancedPieChart data={orderStatusData} title="Status Pesanan" />
                </motion.div>
            </div>

            {/* Second Row - Recent Activity & Top Services */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <div className="w-1 h-6 bg-purple-500 rounded-full" />
                            Pesanan Terbaru
                        </h3>
                        <Link href="/dashboard/admin/orders" className="text-sm text-purple-600 hover:underline flex items-center gap-1">
                            Lihat Semua <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order: any) => (
                                <div key={order.id} className="flex items-center gap-4 p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors">
                                    <div className={`p-2 rounded-lg ${order.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                                        order.status === 'PENDING_PAYMENT' ? 'bg-orange-100 dark:bg-orange-900/30' :
                                            'bg-blue-100 dark:bg-blue-900/30'
                                        }`}>
                                        {order.status === 'COMPLETED' ? <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> :
                                            order.status === 'PENDING_PAYMENT' ? <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" /> :
                                                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                                            {order.service?.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            oleh {order.client?.fullName} • {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                        order.status === 'PENDING_PAYMENT' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                        }`}>
                                        {order.status === 'PAID' ? 'Menunggu Verifikasi' :
                                            order.status === 'PENDING_PAYMENT' ? 'Menunggu Pembayaran' :
                                                order.status === 'IN_PROGRESS' ? 'Sedang Dikerjakan' :
                                                    order.status === 'COMPLETED' ? 'Selesai' : order.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">Tidak ada pesanan terbaru.</p>
                        )}
                    </div>
                </motion.div>

                {/* Recent Users */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <div className="w-1 h-6 bg-blue-500 rounded-full" />
                            Pengguna Terbaru
                        </h3>
                        <Link href="/dashboard/users" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            Lihat Semua <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentUsers.length > 0 ? (
                            recentUsers.map((user: any) => (
                                <div key={user.id} className="flex items-center gap-4 p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                                        {user.fullName.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                                            {user.fullName}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                                        user.role === 'ACCOUNTANT' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                            'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                        }`}>
                                        {user.role === 'ADMIN' ? 'Admin' :
                                            user.role === 'ACCOUNTANT' ? 'Akuntan' :
                                                user.role === 'CLIENT' ? 'Klien' : user.role}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">Tidak ada pengguna terbaru.</p>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Top Services */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                        Layanan Terpopuler
                    </h3>
                    <Link href="/dashboard/services" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
                        Lihat Semua <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {topServices.length > 0 ? (
                        topServices.map((service: any, idx) => (
                            <div key={idx} className="p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{service.count}</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                                    {service.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">pesanan</p>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500 py-8">Tidak ada data layanan.</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
