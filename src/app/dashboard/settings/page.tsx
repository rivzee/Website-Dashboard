'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    Building,
    DollarSign,
    Mail,
    Bell,
    Key,
    Save,
    Upload,
    Eye,
    EyeOff,
    Copy,
    RefreshCw,
    ShieldAlert,
    Loader2
} from 'lucide-react';
import { useToast } from '@/client/hooks/useToast';
import { CompactLoading } from '@/client/components/LoadingSpinner';

export default function SettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('company');
    const [showApiKey, setShowApiKey] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    // Check if user is Admin
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.role === 'ADMIN') {
                setIsAdmin(true);
                fetchSettings();
            } else {
                router.push('/dashboard');
            }
        } else {
            router.push('/login');
        }
    }, [router]);

    // Fetch settings from API
    const fetchSettings = async () => {
        try {
            const res = await axios.get('/api/settings');
            const data = res.data;

            if (data.company) setCompanySettings(data.company);
            if (data.tax) setTaxSettings(data.tax);
            if (data.email) setEmailTemplates(data.email);
            if (data.notifications) setNotificationPrefs(data.notifications);
            if (data.apiKeys) setApiKeys(data.apiKeys);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    // Show loading or access denied
    if (loading) {
        return <CompactLoading message="Memuat pengaturan..." />;
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <ShieldAlert size={64} className="text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Akses Ditolak</h2>
                <p className="text-gray-500 dark:text-gray-400">Halaman ini hanya bisa diakses oleh Admin.</p>
            </div>
        );
    }

    // Company Settings
    const [companySettings, setCompanySettings] = useState({
        name: 'RISA BUR',
        legalName: 'PT. RISA BUR Konsultan',
        address: 'Jl. Contoh No. 123, Jakarta',
        phone: '+62 21 1234 5678',
        email: 'info@risabur.com',
        website: 'www.risabur.com',
        npwp: '12.345.678.9-012.000',
        logo: '/logo-risabur.png'
    });

    // Tax Settings
    const [taxSettings, setTaxSettings] = useState({
        vatRate: 11,
        incomeTaxRate: 25,
        taxYear: 2024,
        fiscalYearStart: '01-01',
        fiscalYearEnd: '12-31',
        taxIdNumber: '12.345.678.9-012.000'
    });

    // Email Templates
    const [emailTemplates, setEmailTemplates] = useState({
        invoiceSubject: 'Invoice #{invoiceNumber} from RISA BUR',
        invoiceBody: 'Dear {clientName},\n\nPlease find attached your invoice #{invoiceNumber}.\n\nThank you for your business!',
        reminderSubject: 'Payment Reminder - Invoice #{invoiceNumber}',
        reminderBody: 'Dear {clientName},\n\nThis is a friendly reminder about invoice #{invoiceNumber}.'
    });

    // Notification Preferences
    const [notificationPrefs, setNotificationPrefs] = useState({
        emailNotifications: true,
        pushNotifications: true,
        newOrderEmail: true,
        paymentReceivedEmail: true,
        deadlineReminder: true,
        weeklyReport: false,
        monthlyReport: true
    });

    // API Keys
    const [apiKeys, setApiKeys] = useState([
        { id: '1', name: 'Production API', key: 'sk_live_1234567890abcdef', created: new Date().toISOString(), lastUsed: new Date().toISOString() },
        { id: '2', name: 'Development API', key: 'sk_test_abcdef1234567890', created: new Date().toISOString(), lastUsed: null }
    ]);

    const handleSaveCompany = async () => {
        setSaving(true);
        try {
            await axios.post('/api/settings', { key: 'company', value: companySettings });
            toast.success('Pengaturan perusahaan berhasil disimpan!');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menyimpan pengaturan perusahaan');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveTax = async () => {
        setSaving(true);
        try {
            await axios.post('/api/settings', { key: 'tax', value: taxSettings });
            toast.success('Pengaturan pajak berhasil disimpan!');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menyimpan pengaturan pajak');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveEmail = async () => {
        setSaving(true);
        try {
            await axios.post('/api/settings', { key: 'email', value: emailTemplates });
            toast.success('Template email berhasil disimpan!');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menyimpan template email');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotifications = async () => {
        setSaving(true);
        try {
            await axios.post('/api/settings', { key: 'notifications', value: notificationPrefs });
            toast.success('Preferensi notifikasi berhasil disimpan!');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menyimpan preferensi notifikasi');
        } finally {
            setSaving(false);
        }
    };

    const generateApiKey = async () => {
        const newKey = {
            id: Date.now().toString(),
            name: 'New API Key',
            key: 'sk_live_' + Math.random().toString(36).substr(2, 24),
            created: new Date().toISOString(),
            lastUsed: null
        };
        const updatedKeys = [...apiKeys, newKey];
        setApiKeys(updatedKeys);

        try {
            await axios.post('/api/settings', { key: 'apiKeys', value: updatedKeys });
            toast.success('API key baru berhasil dibuat!');
        } catch (error) {
            console.error(error);
            toast.error('Gagal menyimpan API key');
        }
    };

    const copyApiKey = (key: string) => {
        navigator.clipboard.writeText(key);
        toast.success('API key copied to clipboard!');
    };

    const tabs = [
        { id: 'company', label: 'Company Profile', icon: Building },
        { id: 'tax', label: 'Tax Settings', icon: DollarSign },
        { id: 'email', label: 'Email Templates', icon: Mail },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'api', label: 'API Keys', icon: Key }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Settings & Preferences
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your system configuration and preferences
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg space-y-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                        {/* Company Profile Tab */}
                        {activeTab === 'company' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Company Profile</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            value={companySettings.name}
                                            onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Legal Name
                                        </label>
                                        <input
                                            type="text"
                                            value={companySettings.legalName}
                                            onChange={(e) => setCompanySettings({ ...companySettings, legalName: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            value={companySettings.address}
                                            onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={companySettings.phone}
                                            onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={companySettings.email}
                                            onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            value={companySettings.website}
                                            onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            NPWP
                                        </label>
                                        <input
                                            type="text"
                                            value={companySettings.npwp}
                                            onChange={(e) => setCompanySettings({ ...companySettings, npwp: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Company Logo
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <img src={companySettings.logo} alt="Logo" className="w-16 h-16 object-contain" />
                                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                                <Upload size={18} />
                                                Upload New Logo
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSaveCompany}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </motion.div>
                        )}

                        {/* Tax Settings Tab */}
                        {activeTab === 'tax' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tax Settings</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            VAT Rate (%)
                                        </label>
                                        <input
                                            type="number"
                                            value={taxSettings.vatRate}
                                            onChange={(e) => setTaxSettings({ ...taxSettings, vatRate: Number(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Income Tax Rate (%)
                                        </label>
                                        <input
                                            type="number"
                                            value={taxSettings.incomeTaxRate}
                                            onChange={(e) => setTaxSettings({ ...taxSettings, incomeTaxRate: Number(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Tax Year
                                        </label>
                                        <input
                                            type="number"
                                            value={taxSettings.taxYear}
                                            onChange={(e) => setTaxSettings({ ...taxSettings, taxYear: Number(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Tax ID Number
                                        </label>
                                        <input
                                            type="text"
                                            value={taxSettings.taxIdNumber}
                                            onChange={(e) => setTaxSettings({ ...taxSettings, taxIdNumber: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Fiscal Year Start
                                        </label>
                                        <input
                                            type="text"
                                            value={taxSettings.fiscalYearStart}
                                            placeholder="MM-DD"
                                            onChange={(e) => setTaxSettings({ ...taxSettings, fiscalYearStart: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Fiscal Year End
                                        </label>
                                        <input
                                            type="text"
                                            value={taxSettings.fiscalYearEnd}
                                            placeholder="MM-DD"
                                            onChange={(e) => setTaxSettings({ ...taxSettings, fiscalYearEnd: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSaveTax}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    <Save size={18} />
                                    Save Tax Settings
                                </button>
                            </motion.div>
                        )}

                        {/* Email Templates Tab */}
                        {activeTab === 'email' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Templates</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Available variables: {'{clientName}'}, {'{invoiceNumber}'}, {'{amount}'}, {'{dueDate}'}
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Invoice Email Subject
                                        </label>
                                        <input
                                            type="text"
                                            value={emailTemplates.invoiceSubject}
                                            onChange={(e) => setEmailTemplates({ ...emailTemplates, invoiceSubject: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Invoice Email Body
                                        </label>
                                        <textarea
                                            value={emailTemplates.invoiceBody}
                                            onChange={(e) => setEmailTemplates({ ...emailTemplates, invoiceBody: e.target.value })}
                                            rows={6}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Payment Reminder Subject
                                        </label>
                                        <input
                                            type="text"
                                            value={emailTemplates.reminderSubject}
                                            onChange={(e) => setEmailTemplates({ ...emailTemplates, reminderSubject: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Payment Reminder Body
                                        </label>
                                        <textarea
                                            value={emailTemplates.reminderBody}
                                            onChange={(e) => setEmailTemplates({ ...emailTemplates, reminderBody: e.target.value })}
                                            rows={6}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSaveEmail}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    <Save size={18} />
                                    Save Email Templates
                                </button>
                            </motion.div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Preferences</h2>

                                <div className="space-y-4">
                                    {Object.entries(notificationPrefs).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Receive notifications for this event
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={(e) => setNotificationPrefs({ ...notificationPrefs, [key]: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleSaveNotifications}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    <Save size={18} />
                                    Save Preferences
                                </button>
                            </motion.div>
                        )}

                        {/* API Keys Tab */}
                        {activeTab === 'api' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys</h2>
                                    <button
                                        onClick={generateApiKey}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        <RefreshCw size={18} />
                                        Generate New Key
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {apiKeys.map((apiKey) => (
                                        <div key={apiKey.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{apiKey.name}</h3>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setShowApiKey(!showApiKey)}
                                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                    >
                                                        {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                    <button
                                                        onClick={() => copyApiKey(apiKey.key)}
                                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                    >
                                                        <Copy size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <code className="block p-3 bg-gray-800 text-green-400 rounded-lg font-mono text-sm">
                                                    {showApiKey ? apiKey.key : '••••••••••••••••••••••••'}
                                                </code>
                                            </div>
                                            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                <span>Created: {new Date(apiKey.created).toLocaleDateString('id-ID')}</span>
                                                <span>Last used: {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString('id-ID') : 'Never'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
