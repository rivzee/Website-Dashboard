'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', phone: '' });

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation
  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Password validation
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({ email: '', password: '', phone: '' });

    // Validate form
    let hasError = false;
    const newErrors = { email: '', password: '', phone: '' };

    if (!validateEmail(form.email)) {
      newErrors.email = 'Email tidak valid. Gunakan email pribadi Anda yang aktif.';
      hasError = true;
    }

    if (!validatePassword(form.password)) {
      newErrors.password = 'Password minimal 6 karakter.';
      hasError = true;
    }

    if (!validatePhone(form.phone)) {
      newErrors.phone = 'Nomor telepon tidak valid. Format: 08xx atau +628xx';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/users', {
        ...form,
        role: 'KLIEN'
      });

      // Success message
      alert(`✅ Registrasi Berhasil!\n\nSelamat datang, ${form.fullName}!\nEmail: ${form.email}\n\nSilakan login untuk melanjutkan.`);

      // Redirect to login
      router.push('/login');
    } catch (err: any) {
      console.error('Registration error:', err);

      // Better error handling
      let errorMessage = 'Gagal mendaftar. ';

      if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else if (err.response?.status === 409) {
        errorMessage += 'Email sudah terdaftar. Silakan gunakan email lain atau login.';
      } else if (err.response?.status === 400) {
        errorMessage += 'Data tidak valid. Periksa kembali form Anda.';
      } else if (err.message === 'Network Error') {
        errorMessage += 'Tidak dapat terhubung ke server. Pastikan backend berjalan.';
      } else {
        errorMessage += 'Terjadi kesalahan. Silakan coba lagi.';
      }

      alert('❌ ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 origin-left z-50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl mx-auto">
          {/* Mobile back button */}
          <Link href="/login" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Login</span>
          </Link>

          {/* Register card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl p-3 mb-4 mx-auto border border-white/20"
              >
                <img src="/logo-risabur.png" alt="RISA BUR Logo" className="w-full h-full object-contain" />
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Buat Akun Baru 🚀
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400"
              >
                Gunakan email pribadi Anda yang aktif
              </motion.p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name field */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={form.fullName}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/15 transition-all duration-300"
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                    required
                  />
                  <AnimatePresence>
                    {form.fullName && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        <CheckCircle2 className="text-green-400" size={20} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Email field */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Email Pribadi
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={form.email}
                    placeholder="john@gmail.com"
                    className={`w-full pl-12 pr-12 py-3 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/15 transition-all duration-300`}
                    onChange={e => {
                      setForm({ ...form, email: e.target.value });
                      setErrors({ ...errors, email: '' });
                    }}
                    required
                  />
                  <AnimatePresence>
                    {form.email && !errors.email && validateEmail(form.email) && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        <CheckCircle2 className="text-green-400" size={20} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle size={16} />
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Phone field */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={form.phone}
                    placeholder="+62 812 3456 7890"
                    className={`w-full pl-12 pr-12 py-3 bg-white/10 border ${errors.phone ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/15 transition-all duration-300`}
                    onChange={e => {
                      setForm({ ...form, phone: e.target.value });
                      setErrors({ ...errors, phone: '' });
                    }}
                    required
                  />
                  <AnimatePresence>
                    {form.phone && !errors.phone && validatePhone(form.phone) && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        <CheckCircle2 className="text-green-400" size={20} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle size={16} />
                    {errors.phone}
                  </motion.p>
                )}
              </motion.div>

              {/* Password field */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    placeholder="Minimal 6 karakter"
                    className={`w-full pl-12 pr-12 py-3 bg-white/10 border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/15 transition-all duration-300`}
                    onChange={e => {
                      setForm({ ...form, password: e.target.value });
                      setErrors({ ...errors, password: '' });
                    }}
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle size={16} />
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={loading}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all mt-6"
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>Daftar Sekarang</span>
                  </>
                )}
              </motion.button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#0B1120] text-gray-400">Atau daftar dengan</span>
                </div>
              </div>

              {/* Google Login Button */}
              <motion.a
                href="/api/auth/google"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-gray-900 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </motion.a>
            </form>

            {/* Login link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-6 text-gray-400"
            >
              Sudah punya akun?{' '}
              <Link href="/login" className="text-white font-semibold hover:underline">
                Masuk Sekarang
              </Link>
            </motion.p>

            {/* Terms */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-center mt-4 text-xs text-gray-500"
            >
              Dengan mendaftar, Anda menyetujui{' '}
              <a href="#" className="text-blue-400 hover:underline">Syarat & Ketentuan</a>
              {' '}dan{' '}
              <a href="#" className="text-blue-400 hover:underline">Kebijakan Privasi</a>
            </motion.p>
          </div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-6 text-gray-500 text-sm"
          >
            © 2024 RISA BUR - Kantor Jasa Akuntan
          </motion.p>
        </div>
      </div>
    </div>
  );
}
