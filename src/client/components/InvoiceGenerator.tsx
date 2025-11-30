'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, Mail, CheckCircle } from 'lucide-react';

interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
    total: number;
}

interface InvoiceData {
    invoiceNumber: string;
    date: string;
    dueDate: string;
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: 'PAID' | 'UNPAID' | 'OVERDUE';
    notes?: string;
}

interface InvoiceGeneratorProps {
    data: InvoiceData;
    onDownload?: () => void;
    onPrint?: () => void;
    onEmail?: () => void;
}

export default function InvoiceGenerator({ data, onDownload, onPrint, onEmail }: InvoiceGeneratorProps) {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        if (onPrint) {
            onPrint();
        } else {
            window.print();
        }
    };

    const handleDownload = () => {
        if (onDownload) {
            onDownload();
        } else {
            // Simple download as HTML
            const content = invoiceRef.current?.innerHTML || '';
            const blob = new Blob([content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${data.invoiceNumber}.html`;
            a.click();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'UNPAID':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
            case 'OVERDUE':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 print:hidden">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                    <Download size={18} />
                    Download PDF
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                    <Printer size={18} />
                    Print
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onEmail}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                    <Mail size={18} />
                    Email Invoice
                </motion.button>
            </div>

            {/* Invoice */}
            <div
                ref={invoiceRef}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700"
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/logo-risabur.png" alt="RISA BUR" className="w-12 h-12" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">RISA BUR</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Kantor Jasa Akuntan</p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p>Jl. Contoh No. 123</p>
                            <p>Jakarta, Indonesia 12345</p>
                            <p>Phone: +62 21 1234 5678</p>
                            <p>Email: info@risabur.com</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">INVOICE</h2>
                        <div className="text-sm space-y-1">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-semibold">Invoice #:</span> {data.invoiceNumber}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-semibold">Date:</span> {new Date(data.date).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-semibold">Due Date:</span> {new Date(data.dueDate).toLocaleDateString()}
                            </p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${getStatusColor(data.status)}`}>
                                {data.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bill To */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">BILL TO:</h3>
                    <div className="text-gray-900 dark:text-white">
                        <p className="font-bold text-lg">{data.clientName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{data.clientEmail}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{data.clientAddress}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                                <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Description</th>
                                <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Qty</th>
                                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Price</th>
                                <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="py-4 px-2 text-gray-900 dark:text-white">{item.description}</td>
                                    <td className="py-4 px-2 text-center text-gray-900 dark:text-white">{item.quantity}</td>
                                    <td className="py-4 px-2 text-right text-gray-900 dark:text-white">
                                        Rp {item.price.toLocaleString('id-ID')}
                                    </td>
                                    <td className="py-4 px-2 text-right font-semibold text-gray-900 dark:text-white">
                                        Rp {item.total.toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                    <div className="w-full md:w-1/2 lg:w-1/3 space-y-2">
                        <div className="flex justify-between py-2 text-gray-700 dark:text-gray-300">
                            <span>Subtotal:</span>
                            <span>Rp {data.subtotal.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between py-2 text-gray-700 dark:text-gray-300">
                            <span>Tax (11%):</span>
                            <span>Rp {data.tax.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between py-3 border-t-2 border-gray-300 dark:border-gray-600 text-xl font-bold text-gray-900 dark:text-white">
                            <span>Total:</span>
                            <span>Rp {data.total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {data.notes && (
                    <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{data.notes}</p>
                    </div>
                )}

                {/* Payment Status */}
                {data.status === 'PAID' && (
                    <div className="flex items-center justify-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-500">
                        <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                        <span className="text-green-800 dark:text-green-400 font-bold">PAID IN FULL</span>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>Thank you for your business!</p>
                    <p className="mt-2">For any questions, please contact us at info@risabur.com</p>
                </div>
            </div>
        </div>
    );
}

// Example usage component
export function InvoiceExample() {
    const sampleInvoice: InvoiceData = {
        invoiceNumber: 'INV-2024-001',
        date: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        clientName: 'PT. Contoh Perusahaan',
        clientEmail: 'contact@contoh.com',
        clientAddress: 'Jl. Client No. 456, Jakarta',
        items: [
            {
                description: 'Jasa Pembukuan Bulanan',
                quantity: 1,
                price: 5000000,
                total: 5000000
            },
            {
                description: 'Laporan Keuangan',
                quantity: 1,
                price: 3000000,
                total: 3000000
            },
            {
                description: 'Konsultasi Pajak',
                quantity: 2,
                price: 1500000,
                total: 3000000
            }
        ],
        subtotal: 11000000,
        tax: 1210000,
        total: 12210000,
        status: 'UNPAID',
        notes: 'Pembayaran dapat dilakukan melalui transfer bank ke rekening BCA 1234567890 a.n. RISA BUR'
    };

    return (
        <InvoiceGenerator
            data={sampleInvoice}
            onEmail={() => alert('Email invoice functionality')}
        />
    );
}
