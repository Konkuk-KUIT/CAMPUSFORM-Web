'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { exchangeGoogleCode } from '@/services/googleSheetService';
import Loading from '@/components/ui/Loading';

export default function GoogleOAuthCallbackContent({ code }: { code: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!code) {
      router.replace('/home/addproject');
      return;
    }

    exchangeGoogleCode(code)
      .then(() => {
        const sheetUrl = sessionStorage.getItem('pendingSheetUrl') ?? '';
        sessionStorage.removeItem('pendingSheetUrl');
        router.replace(`/home/addproject/connect?sheetUrl=${encodeURIComponent(sheetUrl)}`);
      })
      .catch(() => {
        router.replace('/home/addproject');
      });
  }, [code, router]);

  return <Loading />;
}
