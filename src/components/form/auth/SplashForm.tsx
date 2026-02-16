'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authService } from '@/services/authService';

export default function SplashForm() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResponse = await authService.getCurrentUser();

        if (authResponse?.isAuthenticated) {
          if (!authService.isProfileCompleted(authResponse.user)) {
            router.push('/auth/setup');
          } else {
            router.push('/home');
          }
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center gap-3">
        <Image src="/icons/logo.svg" alt="캠퍼스폼 로고" width={52} height={53} />
        <Image src="/icons/campusform.svg" alt="캠퍼스폼" width={135} height={15} />
      </div>
    </div>
  );
}
