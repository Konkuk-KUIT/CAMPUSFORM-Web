'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authService } from '@/services/authService';

export default function LoginForm() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const authResponse = await authService.getCurrentUser();

        if (authResponse?.isAuthenticated) {
          // 프로필 완성 여부에 따라 분기
          if (!authService.isProfileCompleted(authResponse.user)) {
            router.push('/auth/setup');
          } else {
            router.push('/home');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkExistingAuth();
  }, [router]);

  // 인증 체크 중이면 로딩 표시
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>확인 중...</p>
      </div>
    );
  }

  // 로그인 폼
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center p-3 gap-3 mb-7">
        <Image src="/icons/logo.svg" alt="캠퍼스폼 로고" width={52} height={53} />
        <Image src="/icons/campusform.svg" alt="캠퍼스폼" width={135} height={15} />
      </div>

      <button
        onClick={() => {
          authService.loginWithGoogle();
        }}
        className="flex items-center justify-center gap-3 w-75 h-12 border border-[#e7e7e7] rounded-[100px] mb-3 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <Image src="/icons/google.svg" alt="구글 로고" width={20} height={20} />
        <span className="text-14 font-semibold">구글 계정으로 로그인</span>
      </button>
      <span className="text-body-sm text-gray-500">로그인을 위해서는 구글 계정이 필요해요.</span>
    </div>
  );
}
