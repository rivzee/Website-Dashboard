'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import LandingNavbar from '@/client/components/LandingNavbar';
import LandingFooter from '@/client/components/LandingFooter';

export default function TestimoniPage() {
    const testimonials = [
        {
            name: 'Budi Santoso',
            position: 'CEO PT Maju Jaya',
            image: '👨‍💼',
            rating: 5,
            text: 'RISA BUR sangat membantu kami dalam mengelola keuangan perusahaan. Tim yang profesional dan responsif! Laporan keuangan kini jadi lebih rapi dan mudah dipahami.'
        },
        {
            name: 'Siti Nurhaliza',
            position: 'Owner Toko Berkah',
            image: '👩‍💼',
            rating: 5,
            text: 'Laporan keuangan yang akurat dan tepat waktu. Sangat puas dengan layanan yang diberikan. Saya bisa fokus mengembangkan bisnis tanpa pusing masalah pembukuan.'
        },
        {
            name: 'Ahmad Wijaya',
            position: 'Direktur CV Sejahtera',
            image: '👨‍💼',
            rating: 5,
            text: 'Pelayanan terbaik! Membantu kami mengurus perpajakan dengan mudah dan cepat. Konsultasi yang diberikan sangat solutif untuk masalah perpajakan kami.'
        },
        {
            name: 'Dewi Sartika',
            position: 'Founder Startup Tech',
            image: '👩‍💻',
            rating: 5,
            text: 'Sebagai startup, kami butuh partner akuntansi yang fleksibel dan modern. RISA BUR adalah jawabannya. Dashboard yang disediakan sangat membantu monitoring cashflow.'
        },
        {
            name: 'Hendro Kusuma',
            position: 'Manajer Restoran Rasa',
            image: '👨‍🍳',
            rating: 5,
            text: 'Audit internal yang dilakukan sangat detail. Menemukan celah kebocoran dana yang selama ini tidak kami sadari. Sangat recommended!'
        },
        {
            name: 'Rina Melati',
            position: 'Owner Salon Cantik',
            image: '💇‍♀️',
            rating: 5,
            text: 'Harga sangat terjangkau untuk kualitas layanan sekelas korporat. Timnya ramah dan sabar menjelaskan istilah akuntansi yang awam bagi saya.'
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
                            Apa Kata <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Klien Kami</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Kepuasan klien adalah prioritas utama kami. Berikut adalah pengalaman mereka bekerja sama dengan RISA BUR.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 flex flex-col"
                            >
                                <Quote className="text-blue-400 mb-4" size={32} />
                                <p className="text-gray-300 mb-6 italic flex-grow">"{testimonial.text}"</p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="text-4xl bg-white/10 rounded-full p-2 w-16 h-16 flex items-center justify-center">{testimonial.image}</div>
                                    <div>
                                        <div className="font-bold text-lg">{testimonial.name}</div>
                                        <div className="text-sm text-gray-400">{testimonial.position}</div>
                                        <div className="flex gap-1 mt-1">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} size={14} fill="currentColor" className="text-yellow-400" />
                                            ))}
                                        </div>
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
