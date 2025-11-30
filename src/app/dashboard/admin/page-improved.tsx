'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Package,
    FileText,
    DollarSign,
    TrendingUp,
    ArrowRight,
    Plus,
    UserPlus,
    Settings,
    Activity,
    CheckCircle,
    Clock,
    Star
} from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import {
    ResponsiveCard,
    ResponsiveGrid,
    StatCard,
    ResponsiveButton,
    ResponsiveBadge
} from '@/components/ResponsiveComponents';
import { EnhancedLineChart, EnhancedPieChart } from '@/components/EnhancedCharts';

export default function ImprovedAdminDashboard() {
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const [users, services, orders] = await Promise.all([
                axios.get('http://localhost:3001/users'),
                axios.get('http://localhost:3001/services'),
                axios.get('http://localhost:3001/orders'),
            ]);

            setRecentOrders(orders.data.slice(0, 5));
            setRecentUsers(users.data.slice(-5).reverse());

            // Calculate top services
            const serviceCounts: any = {};
            orders.data.forEach((order: any) => {
                const serviceName = order.service?.name || 'Unknown';
                serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
            });
            const topServicesArray = Object.entries(serviceCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a: any, b: any) => b.count - a.count)
                .slice(0, 5);
            setTopServices(topServicesArray);

            // Calculate revenue
            const totalRevenue = orders.data
                .filter((o: any) => o.status === 'COMPLETED')
                .reduce((sum: number, o: any) => sum + (o.service?.price || 0), 0);

            setStats({
                totalUsers: users.data.length,
                totalServices: services.data.length,
                totalOrders: orders.data.length,
                completedOrders: orders.data.filter((o: any) => o.status === 'COMPLETED').length,
                pendingOrders: orders.data.filter((o: any) => o.status === 'PENDING_PAYMENT').length,
                revenue: totalRevenue,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 300 },
        { name: 'Mar', value: 600 },
        { name: 'Apr', value: 800 },
        { name: 'May', value: 500 },
        { name: 'Jun', value: 900 },
    ];

    const orderStatusData = [
        { name: 'Completed', value: stats.completedOrders },
        { name: 'Pending', value: stats.pendingOrders },
        { name: 'In Progress', value: stats.totalOrders - stats.completedOrders - stats.pendingOrders },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-lg border border-gray-200 dark:border-gray-700">
                        <img src="/logo-risabur.png" alt="RISA BUR Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text-blue mb-1">
                            Admin Dashboard
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">RISA BUR - Kantor Jasa Akuntan</p>
                    </div>
                </div>

                {/* Quick Actions - Mobile Optimized */}
                <div className="flex flex-wrap gap-2">
                    <Link href="/dashboard/users">
                        <ResponsiveButton variant="primary" size="sm" icon={UserPlus}>
                            Add User
                        </ResponsiveButton>
                    </Link>
                    <Link href="/dashboard/services">
                        <ResponsiveButton variant="secondary" size="sm" icon={Plus}>
                            Add Service
                        </ResponsiveButton>
                    </Link>
                    <Link href="/dashboard/admin/orders">
                        <ResponsiveButton variant="ghost" size="sm" icon={FileText}>
                            Orders
                        </ResponsiveButton>
                    </Link>
                </div>
            </div>

            {/* Stats Grid - Responsive */}
            <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 4 }} gap={4}>
                <StatCard
                    icon={Users}
                    label="Total Users"
                    value={stats.totalUsers}
                    trend="+12%"
                    gradient="from-purple-500 to-pink-500"
                    delay={0}
                />
                <StatCard
                    icon={Package}
                    label="Total Services"
                    value={stats.totalServices}
                    trend="+5%"
                    gradient="from-blue-500 to-cyan-500"
                    delay={0.1}
                />
                <StatCard
                    icon={FileText}
                    label="Total Orders"
                    value={stats.totalOrders}
                    trend="+23%"
                    gradient="from-emerald-500 to-teal-500"
                    delay={0.2}
                />
                <StatCard
                    icon={DollarSign}
                    label="Revenue"
                    value={`Rp ${stats.revenue.toLocaleString()}`}
                    trend="+18%"
                    gradient="from-orange-500 to-red-500"
                    delay={0.3}
                />
            </ResponsiveGrid>

            {/* Charts Row - Responsive */}
            <ResponsiveGrid cols={{ default: 1, lg: 3 }} gap={6}>
                <div className="lg:col-span-2">
                    <ResponsiveCard>
                        <EnhancedLineChart data={chartData} title="Revenue Trends" />
                    </ResponsiveCard>
                </div>
                <ResponsiveCard>
                    <EnhancedPieChart data={orderStatusData} title="Order Status" />
                </ResponsiveCard>
            </ResponsiveGrid>

            {/* Recent Activity - Responsive */}
            <ResponsiveGrid cols={{ default: 1, lg: 2 }} gap={6}>
                {/* Recent Orders */}
                <ResponsiveCard>
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <div className="w-1 h-5 sm:h-6 bg-purple-500 rounded-full" />
                            Recent Orders
                        </h3>
                        <Link href="/dashboard/admin/orders" className="text-xs sm:text-sm text-purple-600 hover:underline flex items-center gap-1">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order: any) => (
                                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors">
                                    <div className={`p-2 rounded-lg self-start ${order.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                                            order.status === 'PENDING_PAYMENT' ? 'bg-orange-100 dark:bg-orange-900/30' :
                                                'bg-blue-100 dark:bg-blue-900/30'
                                        }`}>
                                        {order.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" /> :
                                            order.status === 'PENDING_PAYMENT' ? <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" /> :
                                                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                                            {order.service?.name}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                                            by {order.client?.fullName} • {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <ResponsiveBadge
                                        variant={
                                            order.status === 'COMPLETED' ? 'success' :
                                                order.status === 'PENDING_PAYMENT' ? 'warning' : 'info'
                                        }
                                        size="sm"
                                    >
                                        {order.status.replace('_', ' ')}
                                    </ResponsiveBadge>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8 text-sm">No recent orders.</p>
                        )}
                    </div>
                </ResponsiveCard>

                {/* Recent Users */}
                <ResponsiveCard>
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <div className="w-1 h-5 sm:h-6 bg-blue-500 rounded-full" />
                            Recent Users
                        </h3>
                        <Link href="/dashboard/users" className="text-xs sm:text-sm text-blue-600 hover:underline flex items-center gap-1">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                        {recentUsers.length > 0 ? (
                            recentUsers.map((user: any) => (
                                <div key={user.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg flex-shrink-0">
                                        {user.fullName.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                                            {user.fullName}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    <ResponsiveBadge
                                        variant={
                                            user.role === 'ADMIN' ? 'primary' :
                                                user.role === 'ACCOUNTANT' ? 'info' : 'success'
                                        }
                                        size="sm"
                                    >
                                        {user.role}
                                    </ResponsiveBadge>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8 text-sm">No recent users.</p>
                        )}
                    </div>
                </ResponsiveCard>
            </ResponsiveGrid>

            {/* Top Services - Responsive */}
            <ResponsiveCard>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="w-1 h-5 sm:h-6 bg-emerald-500 rounded-full" />
                        Top Services
                    </h3>
                    <Link href="/dashboard/services" className="text-xs sm:text-sm text-emerald-600 hover:underline flex items-center gap-1">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>
                <ResponsiveGrid cols={{ default: 1, sm: 2, md: 3, lg: 5 }} gap={4}>
                    {topServices.length > 0 ? (
                        topServices.map((service: any, idx) => (
                            <div key={idx} className="p-3 sm:p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="currentColor" />
                                    <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{service.count}</span>
                                </div>
                                <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                                    {service.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">orders</p>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500 py-8 text-sm">No services data.</p>
                    )}
                </ResponsiveGrid>
            </ResponsiveCard>
        </div>
    );
}
