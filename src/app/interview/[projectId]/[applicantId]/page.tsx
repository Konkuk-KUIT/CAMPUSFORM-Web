// 면접 상세 페이지
import Link from 'next/link';
import Image from 'next/image';
import InterviewDetailHeader from '@/components/interview/InterviewDetailHeader';
import InterviewDetailClient from '@/components/interview/InterviewDetailClient';

export default async function ApplicantDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string; applicantId: string }>;
  searchParams: Promise<{ date?: string; time?: string }>;
}) {
  const { projectId, applicantId } = await params;
  const { date, time } = await searchParams;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <InterviewDetailHeader projectId={Number(projectId)} />
      <div className="flex-1 overflow-hidden">
        <InterviewDetailClient
          projectId={Number(projectId)}
          applicantId={Number(applicantId)}
          initialDate={date}
          initialTime={time}
        />
      </div>
    </div>
  );
}