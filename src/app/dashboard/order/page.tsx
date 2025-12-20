'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { ConfirmModal, AlertModal } from '@/client/components/Modal';

export default function OrderPage() {
  const [services, setServices] = useState<any[]>([]);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orderModal, setOrderModal] = useState<{ show: boolean; service: any | null }>({ show: false, service: null });
  const [alertModal, setAlertModal] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({ show: false, type: 'success', message: '' });
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
    axios.get('/api/services').then(res => setServices(res.data));
  }, []);

  const handleOrder = async (service: any) => {
    setOrderModal({ show: true, service });
  };

  const confirmOrder = async () => {
    if (!orderModal.service) return;
    setOrdering(true);

    try {
      await axios.post('/api/orders', { clientId: user.id, serviceId: orderModal.service.id, notes: 'Order Dashboard' });
      setOrderModal({ show: false, service: null });
      router.push('/dashboard/my-orders');
    } catch (e: any) {
      setOrderModal({ show: false, service: null });
      setAlertModal({ show: true, type: 'error', message: 'Gagal membuat pesanan. Silakan coba lagi.' });
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Pilih Paket Layanan</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Solusi akuntansi profesional untuk bisnis Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((s, index) => (
          <div key={s.id} className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-2 ${index === 1 ? 'border-indigo-500 shadow-2xl ring-4 ring-indigo-500/10 scale-105 z-10' : 'border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl'}`}>

            {index === 1 && (
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                Paling Laris
              </span>
            )}

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{s.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Rp</span>
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{Number(s.price).toLocaleString('id-ID')}</span>
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed min-h-[60px]">{s.description}</p>

            <div className="space-y-3 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full p-0.5"><Check size={12} strokeWidth={4} /></div>
                  <span>Fitur unggulan {i} termasuk</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleOrder(s)}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${index === 1 ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20' : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'}`}
            >
              Pilih Paket Ini
            </button>
          </div>
        ))}
      </div>

      {/* Order Confirmation Modal */}
      <ConfirmModal
        isOpen={orderModal.show}
        onClose={() => setOrderModal({ show: false, service: null })}
        onConfirm={confirmOrder}
        title="Konfirmasi Pesanan"
        message={`Anda akan memesan layanan "${orderModal.service?.name}" dengan harga Rp ${orderModal.service?.price?.toLocaleString('id-ID')}.`}
        confirmText="Pesan Sekarang"
        cancelText="Batal"
        type="info"
        loading={ordering}
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.show}
        onClose={() => setAlertModal({ ...alertModal, show: false })}
        title={alertModal.type === 'success' ? 'Berhasil!' : 'Gagal!'}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
}
