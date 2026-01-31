'use client';

import { useState } from 'react';
import ResultTab from '@/components/ui/ResultTab';
import ResultCard from '@/components/ui/ResultCard';
import Navbar from '@/components/Navbar';
import DocumentPassedList from '@/components/document/DocumentPassedList';
import DocumentFailedList from '@/components/document/DocumentFailedList';

export default function DocumentResultContent() {
  const [selectedTab, setSelectedTab] = useState<'합격자' | '불합격자'>('합격자');

  return (
    <>
      {/* 서류 결과 */}
      <ResultCard type="서류결과" totalApplicants={48} passed={10} ratio="0:0" malePercent={80} femalePercent={20} />

      {/* 합격자, 불합격자 */}
      <ResultTab onTabChange={setSelectedTab} />
      <div className="p-4 bg-gray-50 min-h-screen">
        {selectedTab === '합격자' ? (
          <div>
            <DocumentPassedList />
          </div>
        ) : (
          <div>
            <DocumentFailedList />
          </div>
        )}
      </div>
      <Navbar />
    </>
  );
}
