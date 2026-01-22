// 서류 완료 페이지

import DocumentCompleteButtons from '@/components/document/DocumentCompleteButtons';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function DocumentCompletePage() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* 헤더 */}
        <header className="flex items-center justify-between h-12 px-4 bg-white">
          <Link href="/document/result" className="w-6 h-6">
            <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
          </Link>
          <span className="text-title">서류 결과</span>
          <button className="w-6 h-6">
            <Image src="/icons/notification.svg" alt="알림" width={24} height={24} />
          </button>
        </header>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="mb-2">
            <Image src="/icons/celebration.svg" alt="축하" width={196} height={196} />
          </div>
          <h1 className="text-subtitle-sm-md text-center">와!&apos;요리퐁 6기 신입부원 모집&apos;</h1>
          <h2 className="text-subtitle-md text-center mb-6">서류 점수가 모두 끝났습니다!</h2>
          <p className="text-subtitle-md text-black text-center mb-8">이제 본격적으로 면접 준비만 남았어요</p>
        </div>

        {/* 버튼 영역 */}
        <DocumentCompleteButtons />
      </div>
      <Navbar />
    </>
  );
}
