'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log('Checking user role:', user.role);
            const role = user.role ? user.role.toUpperCase() : '';

            // Redirect based on role
            switch (role) {
                case 'ADMIN':
                    router.push('/dashboard/admin');
                    break;
                case 'AKUNTAN':
                case 'ACCOUNTANT': // Handle legacy role
                    router.push('/dashboard/akuntan');
                    break;
                case 'KLIEN':
                case 'CLIENT': // Handle legacy role
                    router.push('/dashboard/klien');
                    break;
                default:
                    console.log('Unknown role, redirecting to login:', role);
                    router.push('/login');
            }
        } else {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}