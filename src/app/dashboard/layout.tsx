'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Menggunakan path relative yang eksplisit ke folder client
import Sidebar from '../../client/components/Sidebar';
import Topbar from '../../client/components/Topbar';
import { NotificationProvider } from '../../client/components/NotificationSystem';
import LoadingSpinner from '../../client/components/LoadingSpinner';
import { PageTransitionWrapper } from '../../client/components/PageTransition';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'AKUNTAN' | 'KLIEN';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 1. Cek User Auth
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        router.push('/login');
      }
    }

    // 2. Cek Theme (Dark Mode)
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setIsLoading(false);
  }, [router]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');

    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Loading Screen with Premium Animation
  if (isLoading || !user) {
    return <LoadingSpinner message="Memuat Dashboard..." fullScreen={true} />;
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

        {/* Ambient Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] opacity-50"></div>
        </div>

        {/* Sidebar */}
        <Sidebar
          user={user}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Main Content - Adjusts based on sidebar state */}
        <main
          className={`relative z-10 transition-all duration-300 ease-in-out ${isCollapsed ? 'md:ml-[80px]' : 'md:ml-[288px]'
            }`}
        >
          {/* Topbar */}
          <Topbar user={user} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

          <div className="p-4 md:p-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
              {/* Page Transition Animation */}
              <PageTransitionWrapper>
                {children}
              </PageTransitionWrapper>
            </div>
          </div>
        </main>

      </div>
    </NotificationProvider>
  );
}