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

        if (!authResponse?.isAuthenticated || !authResponse.user) {
          console.error('Authentication failed');
          router.push('/auth/login');
          return;
        }

        // /users/exists로 최초 가입 여부 확인
        const userDetail = await authService.getUserDetailByEmail(authResponse.user.email);

        // exists 필드로 판단
        if (userDetail.exists) {
          // 기존 유저 → 홈으로
          router.push('/home');
        } else {
          // 최초 가입 → 프로필 설정으로
          router.push('/auth/setup');
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
