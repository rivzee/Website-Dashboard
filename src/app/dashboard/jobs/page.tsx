'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, Search, Filter, Eye, Calendar, User, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { TableSkeleton } from '@/components/Skeletons';

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  client: { fullName: string; email: string };
  service: { name: string };
}

export default function JobsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3001/orders');
      setOrders(res.data);
    } catch (error) {
      toast.error('Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = (status: string) => {
    switch (status) {
      case 'PAID':
        return { color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30', icon: CheckCircle, label: 'Lunas' };
      case 'COMPLETED':
        return { color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30', icon: CheckCircle, label: 'Selesai' };
      case 'IN_PROGRESS':
        return { color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30', icon: Clock, label: 'Dikerjakan' };
      default:
        return { color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30', icon: AlertCircle, label: 'Menunggu' };
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.client?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total Pesanan', value: orders.length, icon: Package, color: 'blue' },
    { label: 'Menunggu', value: orders.filter(o => o.status === 'PENDING_PAYMENT').length, icon: Clock, color: 'orange' },
    { label: 'Dikerjakan', value: orders.filter(o => o.status === 'IN_PROGRESS' || o.status === 'PAID').length, icon: AlertCircle, color: 'yellow' },
    { label: 'Selesai', value: orders.filter(o => o.status === 'COMPLETED').length, icon: CheckCircle, color: 'green' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Daftar Pesanan</h1>
        <p className="text-gray-600 dark:text-gray-400">Kelola dan pantau semua pesanan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-2xl bg-${stat.color}-500/10`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari klien, email, atau layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {['ALL', 'PENDING_PAYMENT', 'PAID', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-3 rounded-xl font-semibold transition ${statusFilter === status
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
              >
                {status === 'ALL' ? 'Semua' : statusConfig(status).label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : filteredOrders.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl p-12 text-center border border-gray-200/50 dark:border-gray-700/50">
          <Package className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={64} />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {searchQuery || statusFilter !== 'ALL' ? 'Tidak ada hasil' : 'Belum Ada Pesanan'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery || statusFilter !== 'ALL' ? 'Coba filter atau kata kunci lain' : 'Pesanan akan muncul di sini'}
          </p>
        </div>
      ) : (
        <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/40 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Klien</th>
                  <th className="text-left p-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Layanan</th>
                  <th className="text-left p-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Tanggal</th>
                  <th className="text-left p-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Total</th>
                  <th className="text-center p-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-center p-6 text-sm font-semibold text-gray-600 dark:text-gray-400">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => {
                  const status = statusConfig(order.status);
                  const StatusIcon = status.icon;

                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {order.client?.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{order.client?.fullName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{order.client?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="font-medium text-gray-900 dark:text-white">{order.service?.name}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar size={16} />
                          <span className="text-sm">
                            {new Date(order.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="font-bold text-gray-900 dark:text-white">
                          Rp {Number(order.totalAmount).toLocaleString('id-ID')}
                        </p>
                      </td>
                      <td className="p-6 text-center">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${status.color}`}>
                          <StatusIcon size={14} />
                          {status.label}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <button className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition text-blue-600 dark:text-blue-400">
                          <Eye size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}