'use client';

import { motion } from 'framer-motion';
import { Target, Heart, Award } from 'lucide-react';
import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';

export default function AboutPage() {
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
                            Tentang <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">RISA BUR</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Kantor Jasa Akuntan terpercaya dengan pengalaman lebih dari 15 tahun melayani berbagai industri di Indonesia. Kami berdedikasi untuk memberikan solusi keuangan yang akurat dan transparan.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {[
                            {
                                icon: Target,
                                title: 'Visi Kami',
                                description: 'Menjadi mitra terpercaya dalam pengelolaan keuangan bisnis di Indonesia dengan standar profesional tertinggi.'
                            },
                            {
                                icon: Heart,
                                title: 'Misi Kami',
                                description: 'Memberikan solusi akuntansi yang akurat, efisien, dan terpercaya untuk mendukung pertumbuhan bisnis klien.'
                            },
                            {
                                icon: Award,
                                title: 'Nilai Kami',
                                description: 'Integritas, profesionalisme, dan komitmen untuk memberikan layanan terbaik kepada setiap klien.'
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-gray-400">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 text-center"
                    >
                        <h2 className="text-3xl font-bold mb-6">Sejarah Kami</h2>
                        <p className="text-gray-400 max-w-4xl mx-auto leading-relaxed">
                            Didirikan pada tahun 2010, RISA BUR bermula dari sebuah kantor kecil dengan semangat besar untuk membantu UMKM di Indonesia merapikan pembukuan mereka. Seiring berjalannya waktu, kepercayaan klien membawa kami tumbuh menjadi salah satu Kantor Jasa Akuntan terkemuka yang melayani ratusan perusahaan dari berbagai sektor, mulai dari ritel, manufaktur, hingga teknologi.
                        </p>
                    </motion.div>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
