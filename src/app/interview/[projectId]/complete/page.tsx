import { Suspense } from 'react';
import InterviewCompleteButtons from '@/components/interview/InterviewCompleteButtons';
import InterviewCompleteContent from '@/components/interview/InterviewCompleteContent';
import Navbar from '@/components/Navbar';
import NotificationBell from '@/components/ui/NotificationBell';
import Image from 'next/image';
import Link from 'next/link';

export default async function InterviewCompletePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="flex items-center justify-between h-12 px-4 bg-white">
          <Link href={`/interview/${projectId}/result`} className="w-6 h-6">
            <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
          </Link>
          <span className="text-title">면접 결과</span>
          <NotificationBell />
        </header>

        <InterviewCompleteContent projectId={Number(projectId)} />
        <InterviewCompleteButtons projectId={Number(projectId)} />
      </div>
      <Suspense fallback={<div className="h-16.25" />}>
        <Navbar />
      </Suspense>
    </>
  );
}
