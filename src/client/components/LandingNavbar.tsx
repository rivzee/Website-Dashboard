'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LandingNavbar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { name: 'Tentang', href: '/about' },
        { name: 'Layanan', href: '/layanan' },
        { name: 'Testimoni', href: '/testimoni' },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Kontak', href: '/contact' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0"
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 relative">
                        <img src="/logo-risabur.png" alt="RISA BUR Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <span className="text-xl font-bold block group-hover:text-blue-400 transition text-white">RISA BUR</span>
                        <span className="text-xs text-gray-400">Kantor Jasa Akuntan</span>
                    </div>
                </Link>
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`transition ${isActive(link.href) ? 'text-blue-400 font-semibold' : 'text-gray-300 hover:text-blue-400'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="px-6 py-2 text-white hover:text-blue-400 transition">
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white hover:opacity-90 transition shadow-lg shadow-blue-500/30"
                    >
                        Daftar Gratis
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
