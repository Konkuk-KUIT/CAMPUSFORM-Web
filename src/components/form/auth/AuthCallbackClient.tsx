'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import Loading from '@/components/ui/Loading';

export default function AuthCallbackClient() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 잠깐 대기 (백엔드 세션 처리 시간)
        await new Promise(resolve => setTimeout(resolve, 500));

        // 현재 사용자 정보 가져오기
        const authResponse = await authService.getCurrentUser();

        if (!authResponse?.isAuthenticated) {
          console.error('Authentication failed');
          router.push('/auth/login');
          return;
        }

        // nickname 없으면 setup, 있으면 home
        if (!authService.isProfileCompleted(authResponse.user)) {
          router.push('/auth/setup');
        } else {
          router.push('/home');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/auth/login');
      }
    };

    handleCallback();
  }, [router]);

  return <Loading />;
}
