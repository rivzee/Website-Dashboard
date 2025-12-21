/**
 * Halaman Kelola Layanan - CRUD
 * Complete service management with create, read, update, delete
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  X,
  DollarSign,
  Clock,
  FileText,
  Eye,
  Save,
  Package,
  Tag,
} from 'lucide-react';
import { DataTable, Column } from '@/client/components/DataTable';
import { ExportButton } from '@/client/components/ExportButton';
import { ConfirmModal } from '@/client/components/Modal';
import { useToast } from '@/client/hooks/useToast';
import apiService from '@/client/services/api.service';
import LoadingSpinner from '@/client/components/LoadingSpinner';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  isActive: boolean;
}

const CATEGORIES = [
  'Pembukuan',
  'Laporan Keuangan',
  'Pajak',
  'Audit',
  'Konsultasi',
  'Lainnya',
];

export default function ServiceManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    price: 0,
    duration: '',
    category: 'Pembukuan',
    isActive: true,
  });
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; service: Service | null }>({ show: false, service: null });
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.services.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Gagal memuat layanan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedService(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: '',
      category: 'Pembukuan',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (service: Service) => {
    setModalMode('edit');
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      isActive: service.isActive,
    });
    setShowModal(true);
  };

  const handleView = (service: Service) => {
    setModalMode('view');
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      isActive: service.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (service: Service) => {
    setDeleteModal({ show: true, service });
  };

  const confirmDelete = async () => {
    if (!deleteModal.service) return;
    setDeleting(true);

    try {
      await apiService.services.delete(deleteModal.service.id);
      toast.success('Layanan berhasil dihapus');
      setDeleteModal({ show: false, service: null });
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Gagal menghapus layanan');
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalMode === 'create') {
        await apiService.services.create(formData);
        toast.success('Service created successfully');
      } else if (modalMode === 'edit' && selectedService) {
        await apiService.services.update(selectedService.id, formData);
        toast.success('Service updated successfully');
      }
      setShowModal(false);
      fetchServices();
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast.error(error.response?.data?.message || 'Failed to save service');
    }
  };

  const columns: Column<Service>[] = [
    {
      key: 'name',
      label: 'Service Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
            <Briefcase className="text-white" size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => (
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-md">
          {value}
        </p>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          Rp {value.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (value) => (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Clock size={16} />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${value
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
        >
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const exportColumns = [
    { key: 'name', label: 'Service Name', width: 25 },
    { key: 'description', label: 'Description', width: 35 },
    { key: 'category', label: 'Category', width: 15 },
    { key: 'price', label: 'Price', width: 15 },
    { key: 'duration', label: 'Duration', width: 15 },
    { key: 'isActive', label: 'Status', width: 10 },
  ];

  const stats = {
    total: services.length,
    active: services.filter(s => s.isActive).length,
    inactive: services.filter(s => !s.isActive).length,
  };

  if (isLoading) {
    return <LoadingSpinner message="Memuat Data Layanan..." fullScreen={false} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Layanan</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your accounting services and packages
          </p>
        </div>

        <div className="flex gap-3">
          <ExportButton
            data={services}
            columns={exportColumns}
            filename="services_export"
            title="Service List"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg transition-colors"
          >
            <Plus size={20} />
            Tambah Layanan
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Layanan', value: stats.total, color: 'from-blue-500 to-cyan-500', icon: Package },
          { label: 'Aktif', value: stats.active, color: 'from-green-500 to-teal-500', icon: Briefcase },
          { label: 'Nonaktif', value: stats.inactive, color: 'from-red-500 to-pink-500', icon: Briefcase },
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Services Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <DataTable
          data={services}
          columns={columns}
          searchable
          searchPlaceholder="Search services..."
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
            toast.info('Bulk delete', `${rows.length} services will be deleted`);
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
                        <Package className="text-blue-600 dark:text-blue-400" size={24} />
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
                        {modalMode === 'create' ? 'Add New Service' : modalMode === 'edit' ? 'Edit Service' : 'View Service'}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {modalMode === 'create' ? 'Create a new service package' : modalMode === 'edit' ? 'Update service information' : 'View service details'}
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
                  {/* Service Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Service Name *
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={modalMode === 'view'}
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="e.g., Pembukuan Bulanan"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        disabled={modalMode === 'view'}
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 text-gray-400" size={20} />
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        disabled={modalMode === 'view'}
                        required
                        rows={4}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                        placeholder="Describe the service in detail..."
                      />
                    </div>
                  </div>

                  {/* Price & Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price (Rp) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          disabled={modalMode === 'view'}
                          required
                          min="0"
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="500000"
                        />
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration *
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          disabled={modalMode === 'view'}
                          required
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="e.g., 1 Month"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Active Status</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Make this service available for clients
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        disabled={modalMode === 'view'}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
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
                        {modalMode === 'create' ? 'Create Service' : 'Update Service'}
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
        onClose={() => setDeleteModal({ show: false, service: null })}
        onConfirm={confirmDelete}
        title="Hapus Layanan?"
        message={`Apakah Anda yakin ingin menghapus "${deleteModal.service?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
        loading={deleting}
      />
    </div>
  );
}
