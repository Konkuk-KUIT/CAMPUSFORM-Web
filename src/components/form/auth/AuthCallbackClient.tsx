'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

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

  return (
    // TODO : 로딩
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg font-semibold mb-2">로그인 처리 중...</p>
        <p className="text-sm text-gray-500">잠시만 기다려주세요</p>
      </div>
    </div>
  );
}
