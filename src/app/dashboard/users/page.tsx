/**
 * Halaman Kelola Akun - CRUD
 * Complete user management with create, read, update, delete
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Plus,
    Edit,
    Trash2,
    Search,
    X,
    Mail,
    Phone,
    MapPin,
    Shield,
    Eye,
    Save,
    UserPlus,
} from 'lucide-react';
import { DataTable, Column } from '@/client/components/DataTable';
import { ExportButton } from '@/client/components/ExportButton';
import { ConfirmModal } from '@/client/components/Modal';
import { useToast } from '@/client/hooks/useToast';
import apiService from '@/client/services/api.service';
import LoadingSpinner from '@/client/components/LoadingSpinner';

interface User {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    role: 'ADMIN' | 'AKUNTAN' | 'KLIEN';
    createdAt: string;
}

interface UserFormData {
    fullName: string;
    email: string;
    password?: string;
    phone: string;
    address: string;
    role: 'ADMIN' | 'AKUNTAN' | 'KLIEN';
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: 'KLIEN',
    });
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; user: User | null }>({ show: false, user: null });
    const [deleting, setDeleting] = useState(false);
    const toast = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await apiService.users.getAll();
            setUsers(data);
            toast.success('Pengguna berhasil dimuat');
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Gagal memuat pengguna');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setModalMode('create');
        setSelectedUser(null);
        setFormData({
            fullName: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            role: 'KLIEN',
        });
        setShowModal(true);
    };

    const handleEdit = (user: User) => {
        setModalMode('edit');
        setSelectedUser(user);
        setFormData({
            fullName: user.fullName,
            email: user.email,
            password: '',
            phone: user.phone || '',
            address: user.address || '',
            role: user.role,
        });
        setShowModal(true);
    };

    const handleView = (user: User) => {
        setModalMode('view');
        setSelectedUser(user);
        setFormData({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            role: user.role,
        });
        setShowModal(true);
    };

    const handleDelete = async (user: User) => {
        setDeleteModal({ show: true, user });
    };

    const confirmDelete = async () => {
        if (!deleteModal.user) return;
        setDeleting(true);

        try {
            await apiService.users.delete(deleteModal.user.id);
            toast.success('Pengguna berhasil dihapus');
            setDeleteModal({ show: false, user: null });
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Gagal menghapus pengguna');
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (modalMode === 'create') {
                await apiService.users.create(formData);
                toast.success('User created successfully');
            } else if (modalMode === 'edit' && selectedUser) {
                await apiService.users.update(selectedUser.id, formData);
                toast.success('User updated successfully');
            }
            setShowModal(false);
            fetchUsers();
        } catch (error: any) {
            console.error('Error saving user:', error);
            toast.error(error.response?.data?.message || 'Failed to save user');
        }
    };

    const columns: Column<User>[] = [
        {
            key: 'fullName',
            label: 'Name',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {value.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{row.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'phone',
            label: 'Phone',
            render: (value) => (
                <span className="text-gray-900 dark:text-white">{value || '-'}</span>
            ),
        },
        {
            key: 'role',
            label: 'Role',
            sortable: true,
            render: (value) => {
                const colors = {
                    ADMIN: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
                    AKUNTAN: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                    KLIEN: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[value as keyof typeof colors]}`}>
                        {value}
                    </span>
                );
            },
        },
        {
            key: 'createdAt',
            label: 'Joined',
            sortable: true,
            render: (value) => (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(value).toLocaleDateString('id-ID')}
                </span>
            ),
        },
    ];

    const exportColumns = [
        { key: 'fullName', label: 'Full Name', width: 20 },
        { key: 'email', label: 'Email', width: 25 },
        { key: 'phone', label: 'Phone', width: 15 },
        { key: 'role', label: 'Role', width: 15 },
        { key: 'createdAt', label: 'Created At', width: 20 },
    ];

    if (isLoading) {
        return <LoadingSpinner message="Memuat Data Pengguna..." fullScreen={false} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Akun</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Kelola akun pengguna dan hak akses
                    </p>
                </div>

                <div className="flex gap-3">
                    <ExportButton
                        data={users}
                        columns={exportColumns}
                        filename="users_export"
                        title="User List"
                    />

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg transition-colors"
                    >
                        <Plus size={20} />
                        Tambah Pengguna
                    </motion.button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Pengguna', value: users.length, color: 'from-blue-500 to-cyan-500', icon: Users },
                    { label: 'Admin', value: users.filter(u => u.role === 'ADMIN').length, color: 'from-purple-500 to-pink-500', icon: Shield },
                    { label: 'Akuntan', value: users.filter(u => u.role === 'AKUNTAN').length, color: 'from-blue-500 to-indigo-500', icon: Users },
                    { label: 'Klien', value: users.filter(u => u.role === 'KLIEN').length, color: 'from-green-500 to-teal-500', icon: Users },
                ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                                </div>
                                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                                    <Icon className="text-white" size={24} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Users Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <DataTable
                    data={users}
                    columns={columns}
                    searchable
                    searchPlaceholder="Search users..."
                    filterable
                    sortable
                    paginated
                    pageSize={10}
                    bulkActions
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onBulkDelete={(rows) => {
                        console.log('Bulk delete:', rows);
                        toast.info('Bulk delete', `${rows.length} users will be deleted`);
                    }}
                />
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                {/* Modal Header */}
                                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {modalMode === 'create' ? (
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                                                <UserPlus className="text-blue-600 dark:text-blue-400" size={24} />
                                            </div>
                                        ) : modalMode === 'edit' ? (
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                                                <Edit className="text-purple-600 dark:text-purple-400" size={24} />
                                            </div>
                                        ) : (
                                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-xl">
                                                <Eye className="text-green-600 dark:text-green-400" size={24} />
                                            </div>
                                        )}
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {modalMode === 'create' ? 'Add New User' : modalMode === 'edit' ? 'Edit User' : 'View User'}
                                            </h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {modalMode === 'create' ? 'Create a new user account' : modalMode === 'edit' ? 'Update user information' : 'View user details'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                                    >
                                        <X size={20} className="text-gray-500" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            disabled={modalMode === 'view'}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                disabled={modalMode === 'view'}
                                                required
                                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Password (only for create/edit) */}
                                    {modalMode !== 'view' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Password {modalMode === 'create' ? '*' : '(leave blank to keep current)'}
                                            </label>
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required={modalMode === 'create'}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    )}

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Phone
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                disabled={modalMode === 'view'}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                placeholder="+62 812 3456 7890"
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Address
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />
                                            <textarea
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                disabled={modalMode === 'view'}
                                                rows={3}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                                                placeholder="Enter address..."
                                            />
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Role *
                                        </label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                            disabled={modalMode === 'view'}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="KLIEN">Client</option>
                                            <option value="AKUNTAN">Accountant</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>

                                    {/* Actions */}
                                    {modalMode !== 'view' && (
                                        <div className="flex gap-3 pt-4">
                                            <motion.button
                                                type="submit"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                                            >
                                                <Save size={20} />
                                                {modalMode === 'create' ? 'Create User' : 'Update User'}
                                            </motion.button>

                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setShowModal(false)}
                                                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-medium transition-colors"
                                            >
                                                Cancel
                                            </motion.button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, user: null })}
                onConfirm={confirmDelete}
                title="Hapus Pengguna?"
                message={`Apakah Anda yakin ingin menghapus ${deleteModal.user?.fullName}? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Hapus"
                cancelText="Batal"
                type="danger"
                loading={deleting}
            />
        </div>
    );
}
