'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import {
    FileText,
    BookOpen,
    Users,
    Calculator,
    ClipboardCheck,
    ArrowRight,
    Check,
    Star,
    Phone,
    Mail,
    Sparkles,
    BarChart3,
    ShieldCheck,
    Clock
} from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

interface Service {
    id: string;
    title: string;
    description: string;
    icon: any;
    features: string[];
    price: string;
    popular?: boolean;
    color: string;
}

const services: Service[] = [
    {
        id: 'laporan-keuangan',
        title: 'Laporan Keuangan',
        description: 'Penyusunan laporan keuangan komprehensif sesuai standar SAK yang berlaku untuk analisis performa bisnis.',
        icon: FileText,
        features: [
            'Laporan Laba Rugi & Neraca',
            'Laporan Arus Kas Detail',
            'Catatan Atas Laporan Keuangan',
            'Analisis Rasio Keuangan',
            'Dashboard Performa Bisnis'
        ],
        price: 'Mulai Rp 2.5 Jt',
        popular: true,
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'pembukuan',
        title: 'Jasa Pembukuan',
        description: 'Pencatatan transaksi harian yang rapi dan sistematis menggunakan software akuntansi modern.',
        icon: BookOpen,
        features: [
            'Pencatatan Transaksi Harian',
            'Rekonsiliasi Bank Bulanan',
            'Manajemen Hutang & Piutang',
            'Pengarsipan Dokumen Digital',
            'Akses Software Akuntansi'
        ],
        price: 'Mulai Rp 1.5 Jt/bln',
        color: 'from-purple-500 to-pink-500'
    },
    {
        id: 'perpajakan',
        title: 'Konsultan Pajak',
        description: 'Solusi perpajakan lengkap mulai dari perhitungan, pelaporan, hingga perencanaan pajak strategis.',
        icon: Calculator,
        features: [
            'Perhitungan PPh & PPN',
            'Pelaporan SPT Masa & Tahunan',
            'Tax Planning Strategis',
            'Pendampingan Pemeriksaan',
            'Update Regulasi Pajak'
        ],
        price: 'Mulai Rp 2 Jt',
        popular: true,
        color: 'from-orange-500 to-red-500'
    },
    {
        id: 'audit-internal',
        title: 'Audit Internal',
        description: 'Evaluasi independen terhadap sistem pengendalian internal untuk meminimalisir risiko kebocoran.',
        icon: ClipboardCheck,
        features: [
            'Risk Based Audit',
            'Evaluasi SOP & Kepatuhan',
            'Pemeriksaan Fisik Aset',
            'Deteksi Fraud',
            'Rekomendasi Perbaikan Sistem'
        ],
        price: 'Custom',
        color: 'from-green-500 to-emerald-500'
    },
    {
        id: 'pendampingan',
        title: 'Pendampingan & Training',
        description: 'Program pelatihan intensif untuk meningkatkan kompetensi tim keuangan internal perusahaan Anda.',
        icon: Users,
        features: [
            'Training Software Akuntansi',
            'Workshop Perpajakan',
            'Setup Sistem Keuangan',
            'SOP Development',
            'Konsultasi Berkala'
        ],
        price: 'Mulai Rp 3 Jt',
        color: 'from-indigo-500 to-violet-500'
    }
];

const process = [
    {
        title: 'Konsultasi Awal',
        description: 'Diskusi mendalam mengenai kebutuhan dan tantangan bisnis Anda.',
        icon: Users
    },
    {
        title: 'Analisis & Penawaran',
        description: 'Kami menganalisis situasi dan memberikan solusi yang paling tepat.',
        icon: BarChart3
    },
    {
        title: 'Implementasi',
        description: 'Eksekusi layanan oleh tim ahli dengan standar profesional tinggi.',
        icon: Sparkles
    },
    {
        title: 'Review & Reporting',
        description: 'Laporan berkala dan evaluasi hasil kerja untuk perbaikan berkelanjutan.',
        icon: FileText
    }
];

export default function ServicesPage() {
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
            <LandingNavbar />
            <FloatingWhatsApp />

            {/* Scroll Progress */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 origin-left z-[100]"
                style={{ scaleX: scrollYProgress }}
            />

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 px-6">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <motion.div
                    style={{ scale, opacity }}
                    className="max-w-7xl mx-auto text-center relative z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8"
                    >
                        <Sparkles size={16} className="text-yellow-400" />
                        <span className="text-sm">Solusi Komprehensif</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-6"
                    >
                        Layanan <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Profesional</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-3xl mx-auto mb-12"
                    >
                        Kami menghadirkan solusi akuntansi, perpajakan, dan audit yang dirancang khusus untuk mendukung pertumbuhan bisnis Anda di era digital.
                    </motion.p>
                </motion.div>
            </section>

            {/* Services Grid */}
            <section className="relative z-10 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="group relative"
                                >
                                    <Link href={`/layanan/${service.id}`} className="block h-full">
                                        {service.popular && (
                                            <div className="absolute -top-4 -right-4 z-20">
                                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                                    <Star size={12} fill="currentColor" />
                                                    Popular
                                                </div>
                                            </div>
                                        )}

                                        <div className="h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 flex flex-col relative overflow-hidden">
                                            {/* Gradient Glow */}
                                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-10 blur-3xl rounded-full -mr-16 -mt-16 transition-opacity group-hover:opacity-20`} />

                                            <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                                <Icon size={28} className="text-white" />
                                            </div>

                                            <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                                            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                                                {service.description}
                                            </p>

                                            <div className="space-y-3 mb-8 flex-grow">
                                                {service.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-3">
                                                        <div className={`mt-1 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0`}>
                                                            <Check size={12} className="text-blue-400" />
                                                        </div>
                                                        <span className="text-sm text-gray-300">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="pt-6 border-t border-white/10 mt-auto">
                                                <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group-hover:border-blue-500/50 group-hover:text-blue-400">
                                                    Detail Layanan
                                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="relative z-10 py-20 px-6 bg-white/5">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-6">Bagaimana Kami <span className="text-blue-500">Bekerja</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Proses kerja yang transparan dan terstruktur untuk hasil terbaik</p>
                    </motion.div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20" />

                        {process.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative text-center"
                            >
                                <div className="w-24 h-24 mx-auto bg-gray-900 border border-white/10 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-xl">
                                    <step.icon size={32} className="text-blue-400" />
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm border-4 border-gray-900">
                                        {idx + 1}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-gray-400 text-sm">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-32 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/20 rounded-3xl p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-blue-500/10 blur-3xl" />
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-6">Butuh Penawaran Khusus?</h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Kami mengerti setiap bisnis unik. Hubungi kami untuk mendiskusikan paket layanan yang sesuai dengan kebutuhan spesifik Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://wa.me/6281234567890"
                                className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-xl font-bold transition flex items-center justify-center gap-2"
                            >
                                <Phone size={20} />
                                Chat WhatsApp
                            </a>
                            <a
                                href="/contact"
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition flex items-center justify-center gap-2"
                            >
                                <Mail size={20} />
                                Hubungi Kami
                            </a>
                        </div>
                    </div>
                </motion.div>
            </section>

            <LandingFooter />
        </div>
    );
}
