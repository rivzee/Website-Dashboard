'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Download,
    Printer,
    Calendar,
    TrendingUp,
    TrendingDown,
    DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

type ReportType = 'tax' | 'balance-sheet' | 'income-statement' | 'cash-flow';

interface DocumentGeneratorProps {
    type?: ReportType;
}

export default function DocumentGenerator({ type = 'tax' }: DocumentGeneratorProps) {
    const [selectedType, setSelectedType] = useState<ReportType>(type);
    const [period, setPeriod] = useState({
        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [generating, setGenerating] = useState(false);

    const reportTypes = [
        { id: 'tax', label: 'Laporan Pajak', icon: FileText, color: 'blue' },
        { id: 'balance-sheet', label: 'Neraca', icon: TrendingUp, color: 'green' },
        { id: 'income-statement', label: 'Laporan Laba Rugi', icon: DollarSign, color: 'purple' },
        { id: 'cash-flow', label: 'Laporan Arus Kas', icon: TrendingDown, color: 'orange' }
    ];

    const generateDocument = async () => {
        setGenerating(true);

        // Simulate document generation
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast.success(`${reportTypes.find(r => r.id === selectedType)?.label} berhasil dibuat!`);
        setGenerating(false);
    };

    const downloadPDF = () => {
        toast('Downloading PDF...');
    };

    const printDocument = () => {
        window.print();
    };

    // Sample data for demonstration
    const balanceSheetData = {
        assets: {
            current: [
                { name: 'Kas dan Bank', amount: 150000000 },
                { name: 'Piutang Usaha', amount: 75000000 },
                { name: 'Persediaan', amount: 50000000 }
            ],
            fixed: [
                { name: 'Tanah dan Bangunan', amount: 500000000 },
                { name: 'Kendaraan', amount: 200000000 },
                { name: 'Peralatan', amount: 100000000 }
            ]
        },
        liabilities: {
            current: [
                { name: 'Hutang Usaha', amount: 50000000 },
                { name: 'Hutang Pajak', amount: 25000000 }
            ],
            longTerm: [
                { name: 'Hutang Bank', amount: 300000000 }
            ]
        },
        equity: [
            { name: 'Modal Disetor', amount: 500000000 },
            { name: 'Laba Ditahan', amount: 200000000 }
        ]
    };

    const incomeStatementData = {
        revenue: [
            { name: 'Pendapatan Jasa', amount: 500000000 },
            { name: 'Pendapatan Lain-lain', amount: 50000000 }
        ],
        expenses: [
            { name: 'Beban Gaji', amount: 200000000 },
            { name: 'Beban Operasional', amount: 100000000 },
            { name: 'Beban Pajak', amount: 50000000 }
        ]
    };

    const totalAssets = [
        ...balanceSheetData.assets.current,
        ...balanceSheetData.assets.fixed
    ].reduce((sum, item) => sum + item.amount, 0);

    const totalLiabilities = [
        ...balanceSheetData.liabilities.current,
        ...balanceSheetData.liabilities.longTerm
    ].reduce((sum, item) => sum + item.amount, 0);

    const totalEquity = balanceSheetData.equity.reduce((sum, item) => sum + item.amount, 0);

    const totalRevenue = incomeStatementData.revenue.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = incomeStatementData.expenses.reduce((sum, item) => sum + item.amount, 0);
    const netIncome = totalRevenue - totalExpenses;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Document Generator
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Generate financial reports and documents
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={downloadPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        <Download size={18} />
                        Download PDF
                    </button>
                    <button
                        onClick={printDocument}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                    >
                        <Printer size={18} />
                        Print
                    </button>
                </div>
            </div>

            {/* Report Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {reportTypes.map((report) => {
                    const Icon = report.icon;
                    return (
                        <motion.button
                            key={report.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedType(report.id as ReportType)}
                            className={`p-4 rounded-2xl border-2 transition-all ${selectedType === report.id
                                ? `border-${report.color}-500 bg-${report.color}-50 dark:bg-${report.color}-900/20`
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                        >
                            <Icon size={32} className={`text-${report.color}-600 dark:text-${report.color}-400 mb-2`} />
                            <p className="font-semibold text-gray-900 dark:text-white">{report.label}</p>
                        </motion.button>
                    );
                })}
            </div>

            {/* Period Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    Select Period
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={period.startDate}
                            onChange={(e) => setPeriod({ ...period, startDate: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={period.endDate}
                            onChange={(e) => setPeriod({ ...period, endDate: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <button
                    onClick={generateDocument}
                    disabled={generating}
                    className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {generating ? 'Generating...' : 'Generate Report'}
                </button>
            </div>

            {/* Document Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg print:shadow-none">
                {/* Header */}
                <div className="text-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img src="/logo-risabur.png" alt="RISA BUR" className="w-16 h-16" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">RISA BUR</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Kantor Jasa Akuntan</p>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {reportTypes.find(r => r.id === selectedType)?.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Periode: {new Date(period.startDate).toLocaleDateString('id-ID')} - {new Date(period.endDate).toLocaleDateString('id-ID')}
                    </p>
                </div>

                {/* Balance Sheet */}
                {selectedType === 'balance-sheet' && (
                    <div className="space-y-6">
                        {/* Assets */}
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                AKTIVA (ASSETS)
                            </h4>

                            <div className="ml-4 space-y-4">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white mb-2">Aktiva Lancar</p>
                                    {balanceSheetData.assets.current.map((item, idx) => (
                                        <div key={idx} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                Rp {item.amount.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white mb-2">Aktiva Tetap</p>
                                    {balanceSheetData.assets.fixed.map((item, idx) => (
                                        <div key={idx} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                Rp {item.amount.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between py-3 bg-blue-50 dark:bg-blue-900/20 px-4 rounded-lg">
                                    <span className="font-bold text-gray-900 dark:text-white">Total Aktiva</span>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        Rp {totalAssets.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Liabilities & Equity */}
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                PASIVA (LIABILITIES & EQUITY)
                            </h4>

                            <div className="ml-4 space-y-4">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white mb-2">Kewajiban Lancar</p>
                                    {balanceSheetData.liabilities.current.map((item, idx) => (
                                        <div key={idx} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                Rp {item.amount.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white mb-2">Kewajiban Jangka Panjang</p>
                                    {balanceSheetData.liabilities.longTerm.map((item, idx) => (
                                        <div key={idx} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                Rp {item.amount.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white mb-2">Ekuitas</p>
                                    {balanceSheetData.equity.map((item, idx) => (
                                        <div key={idx} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                Rp {item.amount.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between py-3 bg-green-50 dark:bg-green-900/20 px-4 rounded-lg">
                                    <span className="font-bold text-gray-900 dark:text-white">Total Pasiva</span>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        Rp {(totalLiabilities + totalEquity).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Income Statement */}
                {selectedType === 'income-statement' && (
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                PENDAPATAN (REVENUE)
                            </h4>
                            <div className="ml-4">
                                {incomeStatementData.revenue.map((item, idx) => (
                                    <div key={idx} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            Rp {item.amount.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between py-3 bg-purple-50 dark:bg-purple-900/20 px-4 rounded-lg mt-2">
                                    <span className="font-bold text-gray-900 dark:text-white">Total Pendapatan</span>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        Rp {totalRevenue.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                                BEBAN (EXPENSES)
                            </h4>
                            <div className="ml-4">
                                {incomeStatementData.expenses.map((item, idx) => (
                                    <div key={idx} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            Rp {item.amount.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between py-3 bg-orange-50 dark:bg-orange-900/20 px-4 rounded-lg mt-2">
                                    <span className="font-bold text-gray-900 dark:text-white">Total Beban</span>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        Rp {totalExpenses.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={`flex justify-between py-4 px-6 rounded-lg ${netIncome >= 0
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-red-100 dark:bg-red-900/30'
                            }`}>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                {netIncome >= 0 ? 'LABA BERSIH' : 'RUGI BERSIH'}
                            </span>
                            <span className={`text-xl font-bold ${netIncome >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                                }`}>
                                Rp {Math.abs(netIncome).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>Generated by RISA BUR Accounting System</p>
                    <p className="mt-1">{new Date().toLocaleString('id-ID')}</p>
                </div>
            </div>
        </div>
    );
}
