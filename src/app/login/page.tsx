'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', form);
      localStorage.setItem('user', JSON.stringify(res.data));
      await new Promise(r => setTimeout(r, 500));
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.response?.data?.message || 'Login gagal');
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
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Branding */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block"
            >
              <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span>Kembali ke Beranda</span>
              </Link>

              <div className="mb-8">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
                  <img src="/logo-risabur.png" alt="RISA BUR Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  RISA BUR
                </h1>
                <p className="text-xl text-gray-400 mb-6">
                  Kantor Jasa Akuntan Profesional
                </p>
                <p className="text-gray-500 leading-relaxed mb-8">
                  Platform akuntansi modern yang menghubungkan Anda dengan akuntan profesional.
                  Laporan keuangan akurat, cepat, dan terpercaya.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { value: '1,200+', label: 'Klien Aktif' },
                  { value: '98%', label: 'Kepuasan' },
                  { value: '15+', label: 'Tahun' }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-all"
                  >
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold text-white/90 mb-4">Mengapa Memilih Kami?</h3>
                {[
                  {
                    icon: '🚀',
                    title: 'Proses Cepat & Mudah',
                    desc: 'Kelola keuangan bisnis Anda dengan sistem yang intuitif dan efisien'
                  },
                  {
                    icon: '🔒',
                    title: 'Keamanan Terjamin',
                    desc: 'Data keuangan Anda dilindungi dengan enkripsi tingkat enterprise'
                  },
                  {
                    icon: '👨‍💼',
                    title: 'Akuntan Profesional',
                    desc: 'Didukung oleh tim akuntan bersertifikat dan berpengalaman'
                  },
                  {
                    icon: '📊',
                    title: 'Laporan Real-time',
                    desc: 'Akses laporan keuangan kapan saja, dimana saja secara real-time'
                  }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                  >
                    <div className="text-2xl group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white mb-1">{feature.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md mx-auto lg:mx-0"
            >
              {/* Mobile back button */}
              <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span>Kembali</span>
              </Link>

              {/* Login card */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="lg:hidden w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl p-3 mb-4 mx-auto border border-white/20">
                    <img src="/logo-risabur.png" alt="RISA BUR Logo" className="w-full h-full object-contain" />
                  </div>

                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl font-bold text-white mb-2"
                  >
                    Selamat Datang! 👋
                  </motion.h2>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-400"
                  >
                    Masuk ke Dashboard Akuntansi Anda
                  </motion.p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email field */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={20} />
                      <input
                        type="email"
                        value={form.email}
                        placeholder="admin@akuntan.com"
                        className="w-full pl-12 pr-12 py-3.5 bg-gray-900/80 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-900 transition-all duration-300 backdrop-blur-sm"
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        required
                      />
                      <AnimatePresence>
                        {form.email && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center"
                          >
                            <CheckCircle2 className="text-green-400" size={20} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
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
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3.5 bg-gray-900/80 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-gray-900 transition-all duration-300 backdrop-blur-sm"
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10 flex items-center justify-center"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
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
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all"
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
                        <LogIn size={20} />
                        <span>Masuk</span>
                      </>
                    )}
                  </motion.button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-[#0B1120] text-gray-400">Atau masuk dengan</span>
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

                {/* Register link */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center mt-6 text-gray-400"
                >
                  Belum punya akun?{' '}
                  <Link href="/register" className="text-white font-semibold hover:underline">
                    Daftar Sekarang
                  </Link>
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}