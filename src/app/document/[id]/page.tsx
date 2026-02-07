// 서류 상세 페이지
import Link from 'next/link';
import Image from 'next/image';
import DocumentDetailClient from '@/components/document/DocumentDetailClient';
import QuestionSection from '@/components/document/QuestionSection';

// async 추가!
export default async function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // params를 await로 unwrap
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 상세 페이지 헤더 */}
      <header className="flex items-center justify-between h-12 px-4 bg-white">
        <Link href="/document" className="w-6 h-6">
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </Link>
        <span className="text-title">오리쿵 6기 신입부원 모집</span>
        <button className="w-6 h-6">
          <Image src="/icons/notification.svg" alt="알림" width={24} height={24} />
        </button>
      </header>

      {/* DocumentDetailClient에 id 전달 */}
      <DocumentDetailClient applicantId={id} />

      {/* 질문 섹션 */}
      <div className="p-4 mx-4 bg-white rounded-10">
        <QuestionSection
          title="지원동기"
          content="요리에 대한 관심을 꾸준히 가져왔고, 기본기를 제대로 배우고 싶어 지원했습니다. 혼자 할 때보다 함께 조리하며 배우는 과정이 더 큰 동기부여가 된다고 생각합니다. 다양한 레시피를 시도해 보고 서로의 노하우를 나누며 실력을 키우고 싶습니다. 동아리 활동을 통해 배운 내용을 일상에서도 활용할 수 있을 것이라 기대합니다."
        />

        <QuestionSection
          title="이 동아리에 참여하고 싶은 이유를 서술해주세요."
          content="요리에 대한 관심을 꾸준히 가져왔고, 기본기를 제대로 배우고 싶어 지원했습니다. 혼자 할 때보다 함께 조리하며 배우는 과정이 더 큰 동기부여가 된다고 생각합니다. 다양한 레시피를 시도해 보고 서로의 노하우를 나누며 실력을 키우고 싶습니다. 동아리 활동을 통해 배운 내용을 일상에서도 활용할 수 있을 것이라 기대합니다."
          maxLength={700}
        />

        <QuestionSection title="질문내용" content="질문답변" />
      </div>
    </div>
  );
}