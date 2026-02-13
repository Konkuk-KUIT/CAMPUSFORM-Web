// 서류 완료 페이지

import InterviewCompleteButtons from '@/components/interview/InterviewCompleteButtons';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default async function InterviewCompletePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="flex items-center justify-between h-12 px-4 bg-white">
          <Link href="/interview/result" className="w-6 h-6">
            <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
          </Link>
          <span className="text-title">면접 결과</span>
          <button className="w-6 h-6">
            <Image src="/icons/notification.svg" alt="알림" width={24} height={24} />
          </button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="mb-2">
            <Image src="/icons/celebration.svg" alt="축하" width={196} height={196} />
          </div>
          <h1 className="text-subtitle-sm-md text-center">와!&apos;요리퐁 6기 신입부원 모집&apos;</h1>
          <h2 className="text-subtitle-md text-center mb-6">절차가 모두 마무리 되었습니다!</h2>
          <p className="text-subtitle-md text-black text-center mb-8">긴 절차 동안 수고 많으셨어요</p>
        </div>

        <InterviewCompleteButtons projectId={Number(projectId)} />
      </div>
      <Navbar />
    </>
  );
}