'use client';
//카드들 묶음

import { useRouter } from 'next/navigation';
import InterviewInitialCard from '@/components/interview/InterviewInitialCard';

export default function InterviewInitialCards() {
  const router = useRouter();

  const handleLoadApplicants = () => {
    router.push('/interview/list');
  };

  const handleCreateSchedule = () => {
    console.log('스마트 시간표 생성');
    // router.push('/interview/schedule');
  };

  return (
    <>
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
    </>
  );
}