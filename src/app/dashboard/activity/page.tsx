'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DataTable } from '@/client/components/DataTable';
import {
    Activity,
    User,
    FileText,
    Settings,
    LogIn,
    LogOut,
    Edit,
    Trash,
    Plus,
    Download,
    Shield,
    AlertTriangle,
    Info,
    CheckCircle
} from 'lucide-react';
import LoadingSpinner from '@/client/components/LoadingSpinner';

interface ActivityLog {
    id: string;
    userId: string;
    userName: string;
    userRole: string;
    action: string;
    type: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW' | 'EXPORT';
    resource: string;
    resourceId?: string;
    ipAddress: string;
    userAgent: string;
    timestamp: Date;
    details?: any;
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
}

export default function ActivityLogPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [filter, setFilter] = useState<'all' | 'security' | 'data' | 'user'>('all');
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (filter !== 'all') {
                queryParams.append('type', filter);
            }

            const response = await fetch(`/api/activity?${queryParams.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch logs');

            const data = await response.json();
            setLogs(data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [filter]);

    const getActionIcon = (type: string) => {
        switch (type) {
            case 'CREATE':
                return <Plus size={16} className="text-green-600" />;
            case 'UPDATE':
                return <Edit size={16} className="text-blue-600" />;
            case 'DELETE':
                return <Trash size={16} className="text-red-600" />;
            case 'LOGIN':
                return <LogIn size={16} className="text-purple-600" />;
            case 'LOGOUT':
                return <LogOut size={16} className="text-gray-600" />;
            case 'VIEW':
                return <FileText size={16} className="text-indigo-600" />;
            case 'EXPORT':
                return <Download size={16} className="text-orange-600" />;
            default:
                return <Activity size={16} className="text-gray-600" />;
        }
    };

    const getSeverityBadge = (severity: string) => {
        const colors: any = {
            INFO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            WARNING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            ERROR: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
            CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        };

        const icons: any = {
            INFO: <Info size={14} />,
            WARNING: <AlertTriangle size={14} />,
            ERROR: <AlertTriangle size={14} />,
            CRITICAL: <Shield size={14} />
        };

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${colors[severity]}`}>
                {icons[severity]}
                {severity}
            </span>
        );
    };

    const columns = [
        {
            key: 'timestamp',
            label: 'Waktu',
            sortable: true,
            render: (value: Date) => (
                <div className="text-sm">
                    <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(value).toLocaleTimeString('id-ID')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(value).toLocaleDateString('id-ID')}
                    </p>
                </div>
            )
        },
        {
            key: 'userName',
            label: 'Pengguna',
            sortable: true,
            render: (value: string, row: ActivityLog) => (
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{row.userRole}</p>
                </div>
            )
        },
        {
            key: 'action',
            label: 'Aksi',
            render: (value: string, row: ActivityLog) => (
                <div className="flex items-center gap-2">
                    {getActionIcon(row.type)}
                    <span className="text-gray-900 dark:text-white">{value}</span>
                </div>
            )
        },
        {
            key: 'resource',
            label: 'Sumber Daya',
            sortable: true,
            render: (value: string, row: ActivityLog) => (
                <div>
                    <p className="font-medium text-gray-900 dark:text-white">{value}</p>
                    {row.resourceId && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {row.resourceId}</p>
                    )}
                </div>
            )
        },

    ];

    const stats = {
        total: logs.length,
        critical: logs.filter(l => l.severity === 'CRITICAL').length,
        warning: logs.filter(l => l.severity === 'WARNING').length,
        today: logs.filter(l => {
            const today = new Date();
            const logDate = new Date(l.timestamp);
            return logDate.toDateString() === today.toDateString();
        }).length
    };

    const exportLogs = () => {
        const csv = [
            ['Timestamp', 'User', 'Role', 'Action', 'Type', 'Resource', 'IP Address', 'Severity'].join(','),
            ...logs.map(log => [
                new Date(log.timestamp).toISOString(),
                log.userName,
                log.userRole,
                log.action,
                log.type,
                log.resource,
                log.ipAddress,
                log.severity
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activity-logs-${new Date().toISOString()}.csv`;
        a.click();
    };

    if (loading) {
        return <LoadingSpinner message="Memuat Log Aktivitas..." fullScreen={false} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Log Aktivitas & Jejak Audit
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Pantau semua aktivitas sistem dan tindakan pengguna
                    </p>
                </div>

                <button
                    onClick={exportLogs}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <Download size={18} />
                    Ekspor Log
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Log</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats.total}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Activity className="text-blue-600 dark:text-blue-400" size={24} />
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
                            <p className="text-sm text-gray-600 dark:text-gray-400">Hari Ini</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats.today}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
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
                            <p className="text-sm text-gray-600 dark:text-gray-400">Peringatan</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats.warning}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                            <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={24} />
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
                            <p className="text-sm text-gray-600 dark:text-gray-400">Kritis</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats.critical}
                            </p>
                        </div>
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                            <Shield className="text-red-600 dark:text-red-400" size={24} />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
                {[
                    { key: 'all', label: 'Semua Log' },
                    { key: 'security', label: 'Keamanan' },
                    { key: 'data', label: 'Perubahan Data' },
                    { key: 'user', label: 'Aksi Pengguna' }
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === tab.key
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Activity Log Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <DataTable
                    columns={columns}
                    data={logs}
                    searchable={true}
                    filterable={true}


                />
            </motion.div>
        </div>
    );
}
