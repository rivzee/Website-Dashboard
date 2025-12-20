'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, UserPlus, Mail, CheckCircle } from 'lucide-react';
import { AlertModal } from '@/client/components/Modal';

function CompleteRegistrationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertModal, setAlertModal] = useState<{ show: boolean; type: 'success' | 'error' | 'warning'; title: string; message: string }>({ show: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        const emailParam = searchParams.get('email');
        const nameParam = searchParams.get('name');

        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
        }
        if (nameParam) {
            setFullName(decodeURIComponent(nameParam));
        }

        // If no email, redirect back to login
        if (!emailParam) {
            router.push('/login');
        }
    }, [searchParams, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            setAlertModal({ show: true, type: 'warning', title: 'Password Terlalu Pendek', message: 'Password minimal 6 karakter!' });
            return;
        }

        if (password !== confirmPassword) {
            setAlertModal({ show: true, type: 'warning', title: 'Password Tidak Cocok', message: 'Password dan Konfirmasi Password tidak sama!' });
            return;
        }

        setLoading(true);

        try {
            // Create user with the password they chose
            const response = await axios.post('/api/auth/complete-registration', {
                email,
                fullName,
                password,
            });

            // Save user to localStorage
            localStorage.setItem('user', JSON.stringify(response.data));

            setAlertModal({
                show: true,
                type: 'success',
                title: 'Pendaftaran Berhasil! 🎉',
                message: 'Akun Anda telah dibuat. Anda akan diarahkan ke dashboard.'
            });

        } catch (error: any) {
            console.error('Registration error:', error);
            setAlertModal({
                show: true,
                type: 'error',
                title: 'Gagal!',
                message: error.response?.data?.error || 'Gagal membuat akun. Silakan coba lagi.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAlertClose = () => {
        setAlertModal({ ...alertModal, show: false });
        if (alertModal.type === 'success') {
            router.push('/dashboard/klien');
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden flex items-center justify-center px-6 py-12">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <UserPlus size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Lengkapi Pendaftaran</h2>
                        <p className="text-gray-400">Buat password untuk akun Anda</p>
                    </div>

                    {/* Google Info */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-400" size={20} />
                            <div>
                                <p className="text-sm text-green-400 font-medium">Email Google terverifikasi</p>
                                <p className="text-xs text-green-300/70">{email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email (readonly) */}
                        <div>
                            <label className="block text-sm font-medium text-white/90 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-white/90 mb-2">Nama Lengkap</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-900/80 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Nama lengkap Anda"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-white/90 mb-2">Buat Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-900/80 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Minimal 6 karakter"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-white/90 mb-2">Konfirmasi Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-900/80 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Ulangi password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Mendaftarkan...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} />
                                    <span>Buat Akun</span>
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <p className="text-center mt-6 text-gray-500 text-sm">
                        Dengan mendaftar, Anda menyetujui syarat dan ketentuan kami.
                    </p>
                </div>
            </motion.div>

            {/* Alert Modal */}
            <AlertModal
                isOpen={alertModal.show}
                onClose={handleAlertClose}
                title={alertModal.title}
                message={alertModal.message}
                type={alertModal.type}
            />
        </div>
    );
}

export default function CompleteRegistrationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <CompleteRegistrationContent />
        </Suspense>
    );
}
