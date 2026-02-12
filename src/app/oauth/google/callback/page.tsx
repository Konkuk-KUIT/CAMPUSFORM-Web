'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { exchangeGoogleCode } from '@/services/googleSheetService';

export default function GoogleOAuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code');

  useEffect(() => {
    if (!code) {
      alert('Google 인증에 실패했습니다.');
      router.replace('/home/addproject');
      return;
    }

    exchangeGoogleCode(code)
      .then(() => {
        // 저장해둔 sheetUrl 꺼내서 연동 페이지로 이동
        const sheetUrl = sessionStorage.getItem('pendingSheetUrl') ?? '';
        sessionStorage.removeItem('pendingSheetUrl');
        router.replace(`/home/addproject/connect?sheetUrl=${encodeURIComponent(sheetUrl)}`);
      })
      .catch(() => {
        alert('Google 인증에 실패했습니다.');
        router.replace('/home/addproject');
      });
  }, [code, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Google 인증 처리 중...</p>
    </div>
  );
}
