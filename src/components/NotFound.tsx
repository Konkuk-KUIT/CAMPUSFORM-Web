'use client';

import { useRouter } from 'next/navigation';
import BtnRound from '@/components/ui/BtnRound';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="flex-shrink-0 flex items-center justify-between h-12 px-4">
        <Link href="/home" className="w-6 h-6">
          <Image src="/icons/logo.svg" alt="로고" width={22} height={22} />
        </Link>
        <button className="w-6 h-6">
          <Image src="/icons/notification.svg" alt="알림" width={24} height={24} />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 gap-4">
        {/* 404 텍스트 */}
        <p
          style={{
            fontFamily: 'Paperlogy, Pretendard, sans-serif',
            fontWeight: 300,
            fontSize: '52px',
            lineHeight: '40px',
            letterSpacing: '0.1em',
            fontVariantNumeric: 'lining-nums proportional-nums',
          }}
          className="text-gray-950 mb-4"
        >
          404
        </p>

        {/* 메인 문구 */}
        <p
          className="text-gray-950 text-center"
          style={{
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: '25px',
          }}
        >
          찾으시는 페이지가 없거나
          <br />
          오류가 발생하였습니다.
        </p>

        {/* 서브 문구 */}
        <p
          className="text-gray-950 text-center"
          style={{
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '25px',
          }}
        >
          입력하신 주소가 정확한지 다시 한 번 확인해주세요.
        </p>

        {/* 버튼 */}
        <div className="mt-4">
          <BtnRound variant="primary" size="lg" onClick={() => router.back()}>
            이전 화면으로
          </BtnRound>
        </div>
      </div>
    </div>
  );
}