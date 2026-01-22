'use client';

import { useState } from 'react';
import ResultTab from '@/components/ResultTab';
import ResultCard from '@/components/ResultCard';
import Navbar from '@/components/Navbar';
import InterviewPassedList from '@/components/interview/InterviewPassedList';
import InterviewFailedList from '@/components/interview/InterviewFailedList';

export default function InterviewResultContent() {
  const [selectedTab, setSelectedTab] = useState<'합격자' | '불합격자'>('합격자');

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
