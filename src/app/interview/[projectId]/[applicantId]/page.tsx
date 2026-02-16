// 면접 상세 페이지
import Link from 'next/link';
import Image from 'next/image';
import InterviewDetailHeader from '@/components/interview/InterviewDetailHeader';
import InterviewDetailClient from '@/components/interview/InterviewDetailClient';

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; applicantId: string }>;
}) {
  const { projectId, applicantId } = await params;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 고정 헤더 */}
      <InterviewDetailHeader projectId={Number(projectId)} />

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className="flex-1 overflow-hidden">
        <InterviewDetailClient
          projectId={Number(projectId)}
          applicantId={Number(applicantId)}
        />
      </div>
    </div>
  );
}