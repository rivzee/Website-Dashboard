'use client';

import { useState } from 'react';
import { AlertModal } from '@/client/components/Modal';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertModal, setAlertModal] = useState<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Kirim data ke backend
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      // Redirect ke dashboard
      window.location.href = '/dashboard';
    } else {
      setAlertModal({ show: true, title: 'Login Gagal', message: 'Email atau password salah. Silakan coba lagi.' });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Login
        </button>
      </form>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.show}
        onClose={() => setAlertModal({ ...alertModal, show: false })}
        title={alertModal.title}
        message={alertModal.message}
        type="error"
      />
    </>
  );
}