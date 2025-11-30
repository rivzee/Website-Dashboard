'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Fetch all payments (includes order, client, service)
    const fetchPayments = async () => {
        try {
            const res = await axios.get('http://localhost:3001/payments');
            setPayments(res.data);
        } catch (err) {
            console.error('Error fetching payments:', err);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    // Apply search & status filter
    useEffect(() => {
        let data = payments;
        if (statusFilter !== 'ALL') {
            data = data.filter(p => p.status === statusFilter);
        }
        if (search) {
            const term = search.toLowerCase();
            data = data.filter(p =>
            (p.order?.client?.fullName?.toLowerCase().includes(term) ||
                p.order?.client?.email?.toLowerCase().includes(term) ||
                p.paymentMethod?.toLowerCase().includes(term))
            );
        }
        setFiltered(data);
    }, [payments, search, statusFilter]);

    const statusBadge = (status: string) => {
        const colors = {
            PAID: 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30',
            UNPAID: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30',
            FAILED: 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Pembayaran
                            </span>
                        </h1>
                        <p className="text-gray-400">Kelola dan verifikasi pembayaran klien</p>
                    </div>
                    <div className="flex gap-4 items-center mt-4 md:mt-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cari client, email, metode..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        >
                            <option value="ALL" className="bg-gray-900">Semua Status</option>
                            <option value="PAID" className="bg-gray-900">Sudah Bayar</option>
                            <option value="UNPAID" className="bg-gray-900">Belum Bayar</option>
                            <option value="FAILED" className="bg-gray-900">Gagal</option>
                        </select>
                    </div>
                </motion.div>

                {/* Table */}
                <motion.div
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Pesanan</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Klien</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Metode</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Jumlah</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Bukti</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.map(p => (
                                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-sm text-white font-medium">{p.order?.service?.name || '—'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="text-white font-medium">{p.order?.client?.fullName || '-'}</div>
                                            <div className="text-xs text-gray-400 mt-1">{p.order?.client?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{p.paymentMethod}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="text-white font-semibold">
                                                {p.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {p.proofUrl ? (
                                                <a
                                                    href={p.proofUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                                                >
                                                    Lihat Bukti
                                                </a>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge(p.status)}`}>
                                                {p.status === 'PAID' ? 'LUNAS' :
                                                    p.status === 'UNPAID' ? 'BELUM BAYAR' :
                                                        p.status === 'FAILED' ? 'GAGAL' : p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <DollarSign className="w-12 h-12 text-gray-600 mb-3" />
                                                <p className="text-gray-400">Tidak ada data pembayaran.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>


            </div>
        </div>
    );
}
