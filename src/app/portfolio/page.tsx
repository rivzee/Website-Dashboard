'use client';

import { motion } from 'framer-motion';
import { Building2, CheckCircle2, TrendingUp } from 'lucide-react';
import LandingNavbar from '@/client/components/LandingNavbar';
import LandingFooter from '@/client/components/LandingFooter';

export default function PortfolioPage() {
    const portfolio = [
        {
            company: 'PT Teknologi Maju',
            industry: 'Teknologi',
            service: 'Laporan Keuangan & Audit',
            result: 'Efisiensi 40% dalam proses pelaporan',
            desc: 'Perusahaan teknologi yang berkembang pesat membutuhkan sistem pelaporan yang agile. Kami membantu menyusun SOP keuangan dan implementasi software akuntansi.'
        },
        {
            company: 'CV Retail Sukses',
            industry: 'Retail',
            service: 'Pembukuan & Perpajakan',
            result: 'Penghematan pajak hingga 25%',
            desc: 'Membantu merapikan stok opname dan rekonsiliasi bank harian untuk 15 cabang retail, serta perencanaan pajak yang efisien dan legal.'
        },
        {
            company: 'UD Manufaktur Prima',
            industry: 'Manufaktur',
            service: 'Audit Internal',
            result: 'Peningkatan kontrol internal 60%',
            desc: 'Melakukan audit menyeluruh pada siklus produksi dan persediaan, menemukan inefisiensi biaya produksi dan memberikan rekomendasi perbaikan.'
        },
        {
            company: 'PT Jasa Konsultan',
            industry: 'Konsultan',
            service: 'Pendampingan Keuangan',
            result: 'Tim internal lebih kompeten',
            desc: 'Memberikan pelatihan intensif kepada staf keuangan internal klien sehingga mampu menyusun laporan keuangan mandiri sesuai SAK ETAP.'
        },
        {
            company: 'Restoran Rasa Nusantara',
            industry: 'F&B',
            service: 'Pembukuan & Payroll',
            result: 'Laporan HPP akurat per menu',
            desc: 'Menghitung HPP detail untuk setiap menu makanan, membantu manajemen menentukan harga jual yang lebih menguntungkan.'
        },
        {
            company: 'Klinik Sehat Bersama',
            industry: 'Kesehatan',
            service: 'Laporan Keuangan',
            result: 'Laporan siap untuk pinjaman bank',
            desc: 'Menyusun laporan keuangan historis 3 tahun terakhir yang auditable untuk keperluan pengajuan kredit ekspansi klinik.'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white overflow-hidden flex flex-col">
            <LandingNavbar />

            <main className="flex-grow relative z-10 py-32 px-6">
                {/* Animated Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-20"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Portfolio <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Klien</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Studi kasus keberhasilan klien kami dalam mengelola keuangan dan mencapai pertumbuhan bisnis.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {portfolio.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Building2 className="text-blue-400" size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">{item.company}</h3>
                                        <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-gray-300 mb-2">
                                            {item.industry}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    {item.desc}
                                </p>

                                <div className="space-y-3 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="text-green-400 flex-shrink-0" size={20} />
                                        <span className="text-gray-300 font-medium">Layanan: {item.service}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="text-blue-400 flex-shrink-0" size={20} />
                                        <span className="text-blue-200 font-medium">Hasil: {item.result}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
