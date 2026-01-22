'use client';

import { useState } from 'react';
import ResultTab from '@/components/ResultTab';
import ResultCard from '@/components/ResultCard';
import Navbar from '@/components/Navbar';
import InterviewPassedList from '@/components/interview/InterviewPassedList';
import InterviewFailedList from '@/components/interview/InterviewFailedList';

export default function InterviewResultContent() {
  const [selectedTab, setSelectedTab] = useState<'합격자' | '불합격자'>('합격자');

  // 면접 결과 데이터 (실제로는 API에서 가져올 데이터)
  const hasResults = true; // false로 변경하면 빈화면 표시

  // 결과가 없을 때 빈 화면
  if (!hasResults) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] px-5 bg-white">
          <h2 className="text-subtitle-md text-black text-center mb-2.5">
            진행 중인 면접이 없습니다.
          </h2>
          <p className="text-body-rg text-gray-500 text-center">
            면접 대상자 확정 또는 시간표 생성 후<br />면접 정보를 확인할 수 있습니다.
          </p>
        </div>
        <Navbar />
      </>
    );
  }

  return (
    <>
      {/* 면접 결과 */}
      <ResultCard type="면접결과" totalApplicants={48} passed={10} ratio="0:0" malePercent={80} femalePercent={20} />

      {/* 합격자, 불합격자 */}
      <ResultTab onTabChange={setSelectedTab} />
      <div className="p-4 bg-gray-50 min-h-screen">
        {selectedTab === '합격자' ? (
          <div>
            <InterviewPassedList />
          </div>
        ) : (
          <div>
            <InterviewFailedList />
          </div>
        )}
      </div>
      <Navbar />
    </>
  );
}