// 서류 상세 페이지
import Link from 'next/link';
import Image from 'next/image';
import DocumentDetailClient from '@/components/document/DocumentDetailClient';

export default async function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 고정 헤더 */}
      <header className="flex-shrink-0 flex items-center justify-between h-12 px-4 bg-white">
        <Link href="/document" className="w-6 h-6">
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </Link>
        <span className="text-title">요리퐁 6기 신입부원 모집</span>
        <button className="w-6 h-6">
          <Image src="/icons/notification.svg" alt="알림" width={24} height={24} />
        </button>
      </header>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className="flex-1 overflow-hidden">
        <DocumentDetailClient applicantId={id} />
      </div>
    </div>
  );
}