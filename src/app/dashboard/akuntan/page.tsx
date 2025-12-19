'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';
import { EnhancedAreaChart } from '@/client/components/EnhancedCharts';
import { useAutoSync } from '@/client/hooks/useAutoSync';

export default function AkuntanDashboard() {
    const [stats, setStats] = useState({
        totalJobs: 0,
        inProgress: 0,
        completed: 0,
        pending: 0,
    });
    const [priorityJobs, setPriorityJobs] = useState<any[]>([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const orders = await axios.get('/api/orders');
            const data = orders.data;

            // Filter jobs that are PAID (ready to start) or IN_PROGRESS
            const activeJobs = data.filter((o: any) => o.status === 'PAID' || o.status === 'IN_PROGRESS');
            setPriorityJobs(activeJobs.slice(0, 5));

            setStats({
                totalJobs: data.length,
                inProgress: data.filter((o: any) => o.status === 'PAID' || o.status === 'IN_PROGRESS').length,
                completed: data.filter((o: any) => o.status === 'COMPLETED').length,
                pending: data.filter((o: any) => o.status === 'PENDING_PAYMENT').length,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Auto-sync every 30 seconds to keep data fresh
    useAutoSync({
        interval: 30000, // 30 seconds
        onSync: fetchStats,
        enabled: true
    });

    const statCards = [
        { label: 'Total Pekerjaan', value: stats.totalJobs, icon: FileText, color: 'green', trend: '+15%' },
        { label: 'Sedang Dikerjakan', value: stats.inProgress, icon: Clock, color: 'yellow', trend: '+8%' },
        { label: 'Selesai', value: stats.completed, icon: CheckCircle, color: 'emerald', trend: '+22%' },
        { label: 'Menunggu', value: stats.pending, icon: Calendar, color: 'orange', trend: '-5%' },
    ];

    const chartData = [
        { name: 'Jan', value: 20 },
        { name: 'Feb', value: 25 },
        { name: 'Mar', value: 30 },
        { name: 'Apr', value: 35 },
        { name: 'May', value: 28 },
        { name: 'Jun', value: 40 },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-lg border border-gray-200 dark:border-gray-700">
                    <img src="/logo-risabur.png" alt="RISA BUR Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                        Dashboard Akuntan
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">RISA BUR - Kantor Jasa Akuntan</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    const isNegative = stat.trend.startsWith('-');

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl bg-${stat.color}-500/10`}>
                                    <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                </div>
                                <div className={`flex items-center gap-1 ${isNegative ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'} text-sm font-semibold`}>
                                    <TrendingUp size={16} className={isNegative ? 'rotate-180' : ''} />
                                    {stat.trend}
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
            >
                <EnhancedAreaChart data={chartData} title="Pekerjaan Selesai per Bulan" />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
            >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pekerjaan Prioritas</h3>
                <div className="space-y-4">
                    {priorityJobs.length > 0 ? (
                        priorityJobs.map((job: any) => (
                            <div key={job.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{job.service?.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Klien: {job.client?.fullName}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${job.status === 'PAID' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {job.status === 'PAID' ? 'Pekerjaan Baru' : 'Sedang Diproses'}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Tidak ada pekerjaan prioritas saat ini.</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
