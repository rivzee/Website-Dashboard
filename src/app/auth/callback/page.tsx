'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Support both 'data' and 'user' parameters (for different auth flows)
        const data = searchParams.get('data') || searchParams.get('user');
        if (data) {
            try {
                const userData = JSON.parse(decodeURIComponent(data));
                localStorage.setItem('user', JSON.stringify(userData));

                // Redirect based on role
                if (userData.role === 'ADMIN') {
                    router.push('/dashboard/admin');
                } else if (userData.role === 'AKUNTAN') {
                    router.push('/dashboard/akuntan');
                } else {
                    router.push('/dashboard/klien');
                }
            } catch (error) {
                console.error('Failed to parse user data', error);
                router.push('/login?error=auth_failed');
            }
        } else {
            router.push('/login?error=no_data');
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900">Memproses Login...</h2>
                <p className="text-gray-500">Mohon tunggu sebentar</p>
            </div>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
