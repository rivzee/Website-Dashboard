'use client';

import { motion } from 'framer-motion';

export default function GoogleMap() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-4"
        >
            <h3 className="text-2xl font-bold mb-4 text-center">Lokasi Kantor Kami</h3>
            <div className="w-full h-[300px] rounded-2xl overflow-hidden">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d997.3270246939331!2d100.36215707475949!3d-0.9449999990662487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b93d1b4e1a4b%3A0x1234567890abcdef!2sJl.%20Pemuda%20No.43E%2C%20Olo%2C%20Kec.%20Padang%20Bar.%2C%20Kota%20Padang%2C%20Sumatera%20Barat%2025117!5e0!3m2!1sid!2sid!4v1734603000000!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale hover:grayscale-0 transition-all duration-500"
                />
            </div>
        </motion.div>
    );
}
