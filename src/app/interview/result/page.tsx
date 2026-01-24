// 면접 지원자 결과 페이지
import Link from 'next/link';
import Image from 'next/image';
import InterviewResultContent from '@/components/interview/InterviewResultContent';

export default function InterviewResultPage() {
  return (
    <div className="min-h-screen">
      {/* 결과 페이지 헤더 */}
      <header className="flex items-center justify-between h-12 px-4 bg-white">
        <Link href="/interview" className="w-6 h-6">
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </Link>
        <span className="text-title">면접 결과</span>
        <button className="w-6 h-6">
          <Image src="/icons/notification.svg" alt="알림" width={24} height={24} />
        </button>
      </header>

      {/* 동아리 */}
      <div className="bg-blue-50 h-10.75 flex items-center justify-center">
        <span className="text-subtitle-sm-md">요리퐁 6기 신입부원 모집</span>
      </div>
      {/* 결과 내용 */}
      <InterviewResultContent />
    </div>
  );
}
