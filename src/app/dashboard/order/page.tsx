'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

export default function OrderPage() {
  const [services, setServices] = useState<any[]>([]);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
    axios.get('/api/services').then(res => setServices(res.data));
  }, []);

  const handleOrder = async (serviceId: string) => {
    if (!confirm('Lanjutkan pemesanan layanan ini?')) return;
    try {
      await axios.post('/api/orders', { clientId: user.id, serviceId, notes: 'Order Dashboard' });
      router.push('/dashboard/my-orders');
    } catch (e) { alert('Gagal'); }
  };

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Pilih Paket Layanan</h2>
        <p className="text-gray-500 mt-2">Solusi akuntansi profesional untuk bisnis Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((s, index) => (
          <div key={s.id} className={`relative bg-white rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-2 ${index === 1 ? 'border-indigo-500 shadow-2xl ring-4 ring-indigo-500/10 scale-105 z-10' : 'border-gray-100 shadow-lg hover:shadow-xl'}`}>

            {index === 1 && (
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                Paling Laris
              </span>
            )}

            <h3 className="text-xl font-bold text-gray-900 mb-2">{s.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-sm text-gray-500 font-medium">Rp</span>
              <span className="text-4xl font-extrabold text-gray-900">{Number(s.price).toLocaleString('id-ID')}</span>
            </div>

            <p className="text-gray-500 text-sm mb-6 leading-relaxed min-h-[60px]">{s.description}</p>

            <div className="space-y-3 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="bg-green-100 text-green-600 rounded-full p-0.5"><Check size={12} strokeWidth={4} /></div>
                  <span>Fitur unggulan {i} termasuk</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleOrder(s.id)}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${index === 1 ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200'}`}
            >
              Pilih Paket Ini
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
