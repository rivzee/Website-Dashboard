'use client';

import Link from 'next/link';

export default function LandingFooter() {
    return (
        <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl bg-white/5 py-12 px-6 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10">
                                <img src="/logo-risabur.png" alt="RISA BUR" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-xl font-bold">RISA BUR</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Kantor Jasa Akuntan profesional dan terpercaya
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Layanan</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/layanan/laporan-keuangan" className="hover:text-white transition">Laporan Keuangan</Link></li>
                            <li><Link href="/layanan/pembukuan" className="hover:text-white transition">Pembukuan</Link></li>
                            <li><Link href="/layanan/perpajakan" className="hover:text-white transition">Perpajakan</Link></li>
                            <li><Link href="/layanan/audit-internal" className="hover:text-white transition">Audit Internal</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Perusahaan</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-white transition">Tentang Kami</Link></li>
                            <li><Link href="/portfolio" className="hover:text-white transition">Portfolio</Link></li>
                            <li><Link href="/testimoni" className="hover:text-white transition">Testimoni</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition">Kontak</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Kontak</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>+62 822-8791-0202</li>
                            <li>cs@kja-risabur.com</li>
                            <li>Jl. Pemuda 43E, Olo, Padang Barat, Padang, Sumbar 25117</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; 2025 RISA BUR - Kantor Jasa Akuntan. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
