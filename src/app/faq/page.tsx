'use client';

import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';

export default function FaqPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            question: 'Apa saja layanan yang ditawarkan RISA BUR?',
            answer: 'Kami menawarkan berbagai layanan akuntansi profesional termasuk penyusunan laporan keuangan, pembukuan, pendampingan, perpajakan, dan audit internal. Kami juga menyediakan konsultasi manajemen keuangan untuk membantu pertumbuhan bisnis Anda.'
        },
        {
            question: 'Berapa lama waktu pengerjaan laporan keuangan?',
            answer: 'Waktu pengerjaan bervariasi tergantung kompleksitas dan volume transaksi bisnis Anda. Namun, umumnya kami menyelesaikan laporan keuangan bulanan dalam 5-7 hari kerja setelah data lengkap kami terima.'
        },
        {
            question: 'Apakah data perusahaan kami aman?',
            answer: 'Ya, keamanan data adalah prioritas utama kami. Kami menggunakan sistem keamanan tingkat enterprise dengan enkripsi data, akses terbatas, dan perjanjian kerahasiaan (NDA) yang ketat untuk melindungi informasi sensitif bisnis Anda.'
        },
        {
            question: 'Apakah ada garansi untuk layanan yang diberikan?',
            answer: 'Ya, kami memberikan garansi akurasi 100% untuk semua laporan keuangan yang kami susun. Jika terdapat kesalahan perhitungan dari pihak kami, kami akan melakukan revisi tanpa biaya tambahan.'
        },
        {
            question: 'Bagaimana cara memulai menggunakan layanan RISA BUR?',
            answer: 'Anda dapat memulai dengan menghubungi kami untuk konsultasi gratis. Tim kami akan menganalisis kebutuhan bisnis Anda dan merekomendasikan paket layanan yang paling sesuai. Setelah kesepakatan, kami akan segera memulai proses onboarding.'
        },
        {
            question: 'Apakah RISA BUR bisa menangani pajak perusahaan?',
            answer: 'Tentu. Tim kami terdiri dari konsultan pajak bersertifikat yang siap membantu Anda dalam perhitungan, pelaporan, dan perencanaan pajak perusahaan (PPh Badan, PPN, PPh 21, dll) sesuai peraturan perpajakan terbaru.'
        },
        {
            question: 'Apakah saya perlu software akuntansi sendiri?',
            answer: 'Tidak harus. Kami dapat menggunakan software akuntansi yang sudah Anda miliki, atau kami sediakan akses ke sistem cloud accounting kami. Kami fleksibel menyesuaikan dengan preferensi dan infrastruktur teknologi Anda.'
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

                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-6">
                            <HelpCircle className="text-blue-400" size={40} />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Pertanyaan <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Umum</span>
                        </h1>
                        <p className="text-xl text-gray-400">
                            Temukan jawaban untuk pertanyaan yang sering diajukan seputar layanan kami.
                        </p>
                    </motion.div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/5 transition text-left"
                                >
                                    <span className="text-lg font-semibold pr-8">{faq.question}</span>
                                    <ChevronDown
                                        className={`flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-blue-400' : 'text-gray-400'}`}
                                        size={24}
                                    />
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{ height: openFaq === idx ? 'auto' : 0, opacity: openFaq === idx ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-8 pb-8 pt-2 text-gray-400 leading-relaxed border-t border-white/5">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
