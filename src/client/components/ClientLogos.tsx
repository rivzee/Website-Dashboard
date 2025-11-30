'use client';

import { motion } from 'framer-motion';

const logos = [
    'TechStart', 'MegaCorp', 'GlobalIndo', 'RetailMaju', 'KaryaKreatif',
    'BinaUsaha', 'PrimaJasa', 'SentosaAbadi', 'MakmurJaya', 'InovasiDigital'
];

export default function ClientLogos() {
    return (
        <div className="w-full py-10 border-y border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden flex relative z-10">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-950 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-950 to-transparent z-10" />

            <motion.div
                className="flex gap-16 items-center whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{
                    repeat: Infinity,
                    duration: 30,
                    ease: "linear"
                }}
            >
                {[...logos, ...logos, ...logos].map((logo, idx) => (
                    <div key={idx} className="text-2xl font-bold text-gray-500 hover:text-white transition-colors duration-300 cursor-default">
                        {logo}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
