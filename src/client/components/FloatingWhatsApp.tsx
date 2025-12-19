'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
    return (
        <motion.a
            href="https://wa.me/6282287910202"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 group"
        >
            <div className="bg-white text-gray-900 px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-bold pointer-events-none">
                Konsultasi Gratis via WA
            </div>
            <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 relative">
                <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20" />
                <MessageCircle size={32} className="text-white fill-white" />
            </div>
        </motion.a>
    );
}
