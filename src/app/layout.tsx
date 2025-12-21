import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ErrorBoundary from '@/client/components/ErrorBoundary';
import { ToastProvider } from '@/client/hooks/useToast';
import { Suspense } from 'react';
import { ThemeProvider } from '@/client/context/ThemeContext';
import { NavigationProgress } from '@/client/components/PageTransition';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RISA BUR - Kantor Jasa Akuntan',
  description: 'Platform akuntansi modern untuk mengelola keuangan bisnis Anda dengan mudah',
  icons: {
    icon: '/logo-risabur.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider>
            <ToastProvider>
              <Suspense fallback={null}>
                <NavigationProgress />
              </Suspense>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}