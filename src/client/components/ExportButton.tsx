/**
 * Export Button Component
 * Dropdown button for exporting data in multiple formats
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileSpreadsheet, FileText, File } from 'lucide-react';
import { exportData, ExportOptions } from '@/utils/export';
import { useToast } from '@/hooks/useToast';

interface ExportButtonProps {
    data: any[];
    columns: Array<{ key: string; label: string; width?: number }>;
    filename?: string;
    title?: string;
    className?: string;
}

export function ExportButton({
    data,
    columns,
    filename = 'export',
    title = 'Data Export',
    className = '',
}: ExportButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const toast = useToast();

    const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
        try {
            const options: ExportOptions = {
                filename,
                title,
                columns,
                data,
            };

            exportData(format, options);

            toast.success(
                'Export Successful',
                `Data exported as ${format.toUpperCase()}`
            );

            setIsOpen(false);
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Export Failed', 'Failed to export data');
        }
    };

    const exportOptions = [
        {
            format: 'excel' as const,
            label: 'Excel (XLSX)',
            icon: FileSpreadsheet,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'hover:bg-green-50 dark:hover:bg-green-900/20',
        },
        {
            format: 'csv' as const,
            label: 'CSV',
            icon: File,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
        },
        {
            format: 'pdf' as const,
            label: 'PDF',
            icon: FileText,
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'hover:bg-red-50 dark:hover:bg-red-900/20',
        },
    ];

    return (
        <div className={`relative ${className}`}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                disabled={data.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Download size={18} />
                <span>Export</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                        >
                            <div className="p-2">
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                    Export as
                                </div>
                                {exportOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <motion.button
                                            key={option.format}
                                            whileHover={{ x: 4 }}
                                            onClick={() => handleExport(option.format)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${option.bgColor}`}
                                        >
                                            <Icon size={18} className={option.color} />
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {option.label}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {data.length} record{data.length !== 1 ? 's' : ''} will be exported
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
