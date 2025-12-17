'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import LandingNavbar from '@/client/components/LandingNavbar';
import LandingFooter from '@/client/components/LandingFooter';

export default function ContactPage() {
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
                            Hubungi <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Kami</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Siap membantu Anda dengan solusi akuntansi terbaik. Jangan ragu untuk menghubungi kami untuk konsultasi gratis.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8"
                            >
                                <h3 className="text-2xl font-bold mb-6">Informasi Kontak</h3>
                                <div className="space-y-6">
                                    <a href="tel:+6281234567890" className="flex items-start gap-4 group">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition">
                                            <Phone className="text-blue-400" size={24} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-lg">Telepon</div>
                                            <div className="text-gray-400 group-hover:text-blue-400 transition">+62 812-3456-7890</div>
                                        </div>
                                    </a>

                                    <a href="mailto:cs@kja-risabur.com" className="flex items-start gap-4 group">
                                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition">
                                            <Mail className="text-purple-400" size={24} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-lg">Email</div>
                                            <div className="text-gray-400 group-hover:text-purple-400 transition">cs@kja-risabur.com</div>
                                        </div>
                                    </a>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                                            <MapPin className="text-pink-400" size={24} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-lg">Alamat Kantor</div>
                                            <div className="text-gray-400">
                                                Jl. Pemuda 43E, Olo, Padang Barat<br />
                                                Padang, Sumbar 25117
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                            <Clock className="text-green-400" size={24} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-lg">Jam Operasional</div>
                                            <div className="text-gray-400">
                                                Senin - Jumat: 08:00 - 17:00 WIB<br />
                                                Sabtu: 08:00 - 12:00 WIB
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 h-[300px] relative overflow-hidden group"
                            >
                                {/* Placeholder for Map */}
                                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center group-hover:scale-105 transition duration-700">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <MapPin size={20} />
                                        Peta Lokasi (Google Maps Embed)
                                    </span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8"
                        >
                            <h3 className="text-2xl font-bold mb-6">Kirim Pesan</h3>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                                            placeholder="Nama Anda"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Email</label>
                                        <input
                                            type="email"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                                            placeholder="email@contoh.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Subjek</label>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition text-gray-300">
                                        <option value="" className="bg-gray-900">Pilih Layanan</option>
                                        <option value="laporan-keuangan" className="bg-gray-900">Laporan Keuangan</option>
                                        <option value="pembukuan" className="bg-gray-900">Pembukuan</option>
                                        <option value="perpajakan" className="bg-gray-900">Perpajakan</option>
                                        <option value="audit" className="bg-gray-900">Audit Internal</option>
                                        <option value="lainnya" className="bg-gray-900">Lainnya</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Pesan</label>
                                    <textarea
                                        rows={5}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition resize-none"
                                        placeholder="Tuliskan kebutuhan atau pertanyaan Anda..."
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                                >
                                    Kirim Pesan
                                    <Send size={20} />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
