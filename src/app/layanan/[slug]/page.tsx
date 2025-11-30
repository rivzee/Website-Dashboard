'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    FileText,
    Check,
    ArrowRight,
    Phone,
    Mail,
    Clock,
    Users,
    Award,
    BookOpen,
    Calculator,
    ClipboardCheck,
    TrendingUp
} from 'lucide-react';

const servicesData: any = {
    'laporan-keuangan': {
        title: 'Jasa Penyusunan Laporan Keuangan',
        description: 'Laporan keuangan akurat sesuai standar akuntansi',
        icon: FileText,
        longDescription: 'Layanan penyusunan laporan keuangan profesional yang dirancang untuk membantu bisnis Anda dalam menyajikan informasi keuangan yang akurat, transparan, dan sesuai dengan standar akuntansi yang berlaku di Indonesia (SAK/PSAK).',
        subDescription: 'Tim akuntan bersertifikat kami akan memastikan setiap detail transaksi tercatat dengan benar dan disajikan dalam format yang mudah dipahami oleh stakeholder Anda.',
        features: [
            'Laporan Laba Rugi (Income Statement)',
            'Neraca Keuangan (Balance Sheet)',
            'Laporan Arus Kas (Cash Flow Statement)',
            'Catatan Atas Laporan Keuangan',
            'Analisis Rasio Keuangan',
            'Konsultasi Interpretasi Laporan',
            'Review dan Revisi Unlimited',
            'Format Digital dan Cetak'
        ],
        process: [
            { step: '1', title: 'Konsultasi Awal', description: 'Diskusi kebutuhan dan pengumpulan data keuangan' },
            { step: '2', title: 'Analisis Data', description: 'Tim kami menganalisis dan memverifikasi data transaksi' },
            { step: '3', title: 'Penyusunan Laporan', description: 'Pembuatan laporan sesuai standar akuntansi' },
            { step: '4', title: 'Review & Finalisasi', description: 'Review bersama dan penyerahan laporan final' }
        ],
        price: 'Rp 2.500.000'
    },
    'pembukuan': {
        title: 'Jasa Pembukuan',
        description: 'Pencatatan transaksi keuangan sistematis dan teratur',
        icon: BookOpen,
        longDescription: 'Layanan pembukuan komprehensif untuk mencatat setiap transaksi bisnis Anda secara rapi, terstruktur, dan akuntabel. Kami membantu Anda memantau arus kas dan posisi keuangan secara real-time.',
        subDescription: 'Dengan sistem pembukuan yang baik, Anda dapat mengambil keputusan bisnis yang lebih tepat berdasarkan data keuangan yang valid.',
        features: [
            'Pencatatan Transaksi Harian',
            'Rekonsiliasi Bank & Kas',
            'Manajemen Hutang & Piutang',
            'Laporan Kas Kecil (Petty Cash)',
            'Pengarsipan Dokumen Keuangan',
            'Laporan Umur Piutang',
            'Monitoring Budget vs Realisasi',
            'Setup Sistem Akuntansi'
        ],
        process: [
            { step: '1', title: 'Setup Sistem', description: 'Instalasi dan konfigurasi sistem pembukuan' },
            { step: '2', title: 'Input Data', description: 'Pencatatan transaksi harian secara berkala' },
            { step: '3', title: 'Rekonsiliasi', description: 'Pencocokan data dengan rekening koran' },
            { step: '4', title: 'Pelaporan', description: 'Penyajian laporan pembukuan bulanan' }
        ],
        price: 'Rp 1.500.000'
    },
    'pendampingan': {
        title: 'Jasa Pendampingan',
        description: 'Bimbingan intensif penyusunan laporan keuangan',
        icon: Users,
        longDescription: 'Program pendampingan intensif bagi tim keuangan internal Anda. Kami mentransfer pengetahuan dan keahlian untuk meningkatkan kompetensi staf Anda dalam mengelola keuangan perusahaan.',
        subDescription: 'Cocok untuk perusahaan yang ingin membangun tim finance yang mandiri dan profesional.',
        features: [
            'Training Staff Keuangan',
            'Supervisi Penyusunan Laporan',
            'Konsultasi Masalah Akuntansi',
            'Review Sistem & Prosedur',
            'Penyusunan SOP Keuangan',
            'Pendampingan Audit Eksternal',
            'Workshop Perpajakan Dasar',
            'Evaluasi Kinerja Tim'
        ],
        process: [
            { step: '1', title: 'Assessment', description: 'Evaluasi kompetensi tim saat ini' },
            { step: '2', title: 'Program Design', description: 'Perancangan materi pendampingan' },
            { step: '3', title: 'Training', description: 'Sesi pelatihan dan mentoring intensif' },
            { step: '4', title: 'Evaluasi', description: 'Penilaian perkembangan kompetensi' }
        ],
        price: 'Rp 3.000.000'
    },
    'perpajakan': {
        title: 'Jasa Perpajakan',
        description: 'Konsultasi dan pengurusan perpajakan lengkap',
        icon: Calculator,
        longDescription: 'Solusi perpajakan lengkap untuk memastikan kepatuhan bisnis Anda terhadap regulasi pajak yang berlaku. Kami membantu meminimalkan risiko denda dan mengoptimalkan efisiensi pajak secara legal.',
        subDescription: 'Tangani kewajiban pajak Anda dengan tenang bersama konsultan pajak berpengalaman kami.',
        features: [
            'Perhitungan PPh & PPN',
            'Pelaporan SPT Masa & Tahunan',
            'Perencanaan Pajak (Tax Planning)',
            'Pendampingan Pemeriksaan Pajak',
            'Restitusi Pajak',
            'Review Kepatuhan Pajak',
            'Administrasi NPWP & PKP',
            'Konsultasi Peraturan Pajak Terbaru'
        ],
        process: [
            { step: '1', title: 'Review Pajak', description: 'Analisis kewajiban perpajakan perusahaan' },
            { step: '2', title: 'Perhitungan', description: 'Kalkulasi pajak terutang yang akurat' },
            { step: '3', title: 'Pelaporan', description: 'Submit laporan ke sistem DJP Online' },
            { step: '4', title: 'Arsip', description: 'Dokumentasi bukti lapor dan bayar' }
        ],
        price: 'Rp 2.000.000'
    },
    'audit-internal': {
        title: 'Jasa Audit Internal',
        description: 'Evaluasi sistem pengendalian internal perusahaan',
        icon: ClipboardCheck,
        longDescription: 'Layanan audit independen untuk mengevaluasi efektivitas pengendalian internal, manajemen risiko, dan tata kelola perusahaan Anda. Kami membantu mendeteksi inefisiensi dan potensi kecurangan.',
        subDescription: 'Tingkatkan operasional bisnis Anda dengan rekomendasi perbaikan yang objektif dan bernilai tambah.',
        features: [
            'Evaluasi Pengendalian Internal',
            'Identifikasi & Manajemen Risiko',
            'Audit Kepatuhan (Compliance)',
            'Audit Operasional',
            'Deteksi Kecurangan (Fraud)',
            'Rekomendasi Perbaikan Sistem',
            'Monitoring Tindak Lanjut',
            'Laporan Audit Komprehensif'
        ],
        process: [
            { step: '1', title: 'Perencanaan', description: 'Penentuan ruang lingkup dan jadwal audit' },
            { step: '2', title: 'Field Work', description: 'Pemeriksaan dokumen dan observasi lapangan' },
            { step: '3', title: 'Reporting', description: 'Penyampaian temuan dan rekomendasi' },
            { step: '4', title: 'Follow-up', description: 'Monitoring perbaikan hasil audit' }
        ],
        price: 'Rp 5.000.000'
    }
};

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const service = servicesData[params.slug];

    if (!service) {
        notFound();
    }

    const Icon = service.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 py-20">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[120px]"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition">
                        <ArrowRight size={20} className="rotate-180 mr-2" />
                        Kembali ke Beranda
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <Icon size={40} />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold">
                                    {service.title}
                                </h1>
                                <p className="text-xl text-blue-100 mt-2">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Tentang Layanan Ini
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                {service.longDescription}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {service.subDescription}
                            </p>
                        </motion.div>

                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Yang Anda Dapatkan
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {service.features.map((feature: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <Check size={20} className="text-green-500 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Process */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Proses Pengerjaan
                            </h2>
                            <div className="space-y-6">
                                {service.process.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                            {item.step}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Pricing Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl"
                        >
                            <h3 className="text-2xl font-bold mb-2">Investasi</h3>
                            <div className="text-4xl font-bold mb-6">
                                Mulai dari<br />{service.price}
                            </div>
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-2">
                                    <Clock size={18} />
                                    <span className="text-sm">Pengerjaan 5-7 hari kerja</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={18} />
                                    <span className="text-sm">Tim akuntan bersertifikat</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award size={18} />
                                    <span className="text-sm">Garansi akurasi 100%</span>
                                </div>
                            </div>
                            <button className="w-full px-6 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition flex items-center justify-center gap-2">
                                Konsultasi Gratis
                                <ArrowRight size={20} />
                            </button>
                        </motion.div>

                        {/* Contact Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Butuh Bantuan?
                            </h3>
                            <div className="space-y-3">
                                <a
                                    href="tel:+6281234567890"
                                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                                >
                                    <Phone size={18} />
                                    <span>+62 812-3456-7890</span>
                                </a>
                                <a
                                    href="mailto:info@risabur.com"
                                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                                >
                                    <Mail size={18} />
                                    <span>info@risabur.com</span>
                                </a>
                            </div>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Statistik Layanan
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Kepuasan Klien</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">98%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: '98%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Akurasi</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">100%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full" style={{ width: '100%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">On-Time Delivery</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">95%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full" style={{ width: '95%' }} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-white space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Siap Memulai?
                        </h2>
                        <p className="text-xl text-blue-100">
                            Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/layanan"
                                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                            >
                                Lihat Layanan Lain
                            </Link>
                            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                                Hubungi Kami
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
