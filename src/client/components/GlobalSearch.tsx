'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Users, Package, ShoppingCart, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
    id: string;
    type: 'order' | 'user' | 'service';
    title: string;
    subtitle: string;
    url: string;
}

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const router = useRouter();

    // Mock data - replace with actual API calls
    const mockData: SearchResult[] = [
        { id: '1', type: 'order', title: 'Order #12345', subtitle: 'Klien: John Doe', url: '/dashboard/jobs' },
        { id: '2', type: 'user', title: 'John Doe', subtitle: 'klien@email.com', url: '/dashboard/users' },
        { id: '3', type: 'service', title: 'Laporan Keuangan', subtitle: 'Rp 500,000', url: '/dashboard/services' },
    ];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (query.length > 0) {
            const filtered = mockData.filter(
                item =>
                    item.title.toLowerCase().includes(query.toLowerCase()) ||
                    item.subtitle.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'order':
                return <ShoppingCart size={20} className="text-blue-500" />;
            case 'user':
                return <Users size={20} className="text-purple-500" />;
            case 'service':
                return <Package size={20} className="text-green-500" />;
            default:
                return <FileText size={20} className="text-gray-500" />;
        }
    };

    const handleSelect = (url: string) => {
        router.push(url);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <>
            {/* Search Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
                <Search size={18} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Cari...</span>
                <kbd className="hidden md:inline-flex px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
                    Ctrl+K
                </kbd>
            </button>

            {/* Search Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="fixed inset-0 flex items-start justify-center pt-20 z-50 px-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                className="w-full max-w-2xl backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Search Input */}
                                <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                                    <Search size={24} className="text-gray-400" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Cari pesanan, user, atau layanan..."
                                        className="flex-1 bg-transparent text-lg outline-none text-gray-900 dark:text-white placeholder-gray-400"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Results */}
                                <div className="max-h-96 overflow-y-auto">
                                    {query.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                            <Search size={48} className="mx-auto mb-4 opacity-50" />
                                            <p>Ketik untuk mencari...</p>
                                            <p className="text-sm mt-2">Cari pesanan, user, atau layanan</p>
                                        </div>
                                    ) : results.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                            <p>Tidak ada hasil untuk "{query}"</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {results.map((result) => (
                                                <motion.button
                                                    key={result.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    onClick={() => handleSelect(result.url)}
                                                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-left"
                                                >
                                                    <div className="flex-shrink-0">{getIcon(result.type)}</div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                            {result.title}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                            {result.subtitle}
                                                        </p>
                                                    </div>
                                                    <div className="text-xs text-gray-400 uppercase">{result.type}</div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">↑</kbd>
                                                <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">↓</kbd>
                                                navigate
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">Enter</kbd>
                                                select
                                            </span>
                                        </div>
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">Esc</kbd>
                                            close
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
