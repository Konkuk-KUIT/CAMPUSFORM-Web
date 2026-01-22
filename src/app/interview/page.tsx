'use client';

import { useRouter } from 'next/navigation';
import InterviewHeader from '@/components/InterviewHeader';
import Navbar from '@/components/Navbar';
import InterviewInitialCard from '@/components/interview/InterviewInitialCard';

// 면접 지원자 초기 페이지
export default function InterviewInitialPage() {
  const router = useRouter();

  const handleLoadApplicants = () => {
    router.push('/interview/list');
  };

  const handleCreateSchedule = () => {
    console.log('스마트 시간표 생성');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <InterviewHeader />
      <div className="flex-1 bg-gray-50 px-5 pt-[33px] pb-20">
        <InterviewInitialCard
          icon="/icons/document-off.svg"
          title="서류 합격자 불러오기"
          description="면접 대상자 명단을 바로 확인합니다"
          note="* 스마트 시간표는 하단 메뉴에서 설정 가능합니다."
          onClick={handleLoadApplicants}
        />
        <div className="h-[15px]" />
        <InterviewInitialCard
          icon="/icons/schedule-off.svg"
          title="스마트 시간표 생성하기"
          description="면접 시간표를 자동으로 배정합니다"
          note="* 서류 합격자는 자동으로 연동됩니다."
          onClick={handleCreateSchedule}
        />
      </div>
      <Navbar />
    </div>
  );
}