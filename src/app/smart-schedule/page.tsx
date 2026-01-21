'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import Btn from '@/components/Btn';
import AllAccordion from '@/components/AllAccordion';
import SmartScheduleCard from '@/components/SmartScheduleCard';
import SmartScheduleButton from '@/components/SmartScheduleButton';
import SmartScheduleCalendarPreview from '@/components/SmartScheduleCalendarPreview';

export default function SmartSchedulePage() {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(true);

  // 면접 정보 설정 완료 여부 확인
  useEffect(() => {
    const isConfigured = localStorage.getItem('interviewInfoConfigured');
    setShowOverlay(!isConfigured);
  }, []);

  const interviewers = [
    { name: '닉네임', email: 'xxxxx@gmail.com', isLeader: true },
    { name: '닉네임', email: 'xxxxx@gmail.com', isLeader: false },
    { name: '닉네임', email: 'xxxxx@gmail.com', isLeader: false },
  ];

  return (
    <main className="min-h-screen flex justify-center bg-white font-['Pretendard']">
      <div className="relative w-[375px] bg-white min-h-screen shadow-lg flex flex-col overflow-x-hidden">
        {/* Top app bar with logo and alarm */}
        <div className="relative flex items-center justify-center h-12 px-4 bg-white border-b border-gray-200">
        <div className="absolute left-4 flex items-center gap-2">
          <Image src="/icons/logo.svg" alt="logo" width={24} height={24} />
        </div>
        <span className="text-title font-semibold">스마트 시간표</span>
        <button aria-label="alarm" className="absolute right-4 p-1">
          <Image src="/icons/alarm.svg" alt="alarm" width={16.5} height={19.5} />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 pt-4 pb-4 overflow-y-auto">
        {/* Step 1: Interview Info Setup */}
        <div className="mb-6">
          <button 
            onClick={() => router.push('/smart-schedule/setting')}
            className="w-full flex items-start justify-between mb-2 group"
          >
            <div className="text-left">
              <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">
                1. 면접 정보 설정
              </h3>
              <p className="text-body-xs text-gray-300">
                면접 일정과 운영 방식을 설정해 주세요.
              </p>
            </div>
            <div className="mt-1 flex-shrink-0">
              <Image src="/icons/chevron-right.svg" alt="next" width={24} height={7} />
            </div>
          </button>
        </div>

        {/* Step 2: Interviewer Time Registration */}
        <div className="mb-6">
          <div className="text-left mb-3">
            <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">
              2. 면접관 시간 등록
            </h3>
            <p className="text-body-xs text-gray-300">
              각 면접관 별 가능한 시간을 선택해 입력합니다.
            </p>
          </div>

          {/* Calendar preview toggled by 전체 버튼 (위치 상단) */}
          <div className="mb-3">
            <AllAccordion title="전체">
              <SmartScheduleCalendarPreview />
            </AllAccordion>
          </div>

          {/* Interviewer List (always visible) */}
          <div className="bg-white rounded-[10px]">
            {interviewers.map((interviewer, idx) => (
              <SmartScheduleCard
                key={idx}
                name={interviewer.name}
                email={interviewer.email}
                isLeader={interviewer.isLeader}
                showDivider={true}
              />
            ))}
          </div>
        </div>

        {/* Step 3: Applicant Response */}
        <div>
          <div className="text-left mb-3">
            <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">
              3. 지원자 면접 가능 시간 모집
            </h3>
            <p className="text-body-xs text-gray-300">
              응답 종료 전까지 지원자가 면접 가능 시간을 입력 후 제출합니다.
            </p>
          </div>

          <div className="bg-white p-2.5 space-y-2.5">
            {/* URL input with copy icon */}
            <div className="relative">
              <input
                type="text"
                placeholder="https://www.campusform~"
                readOnly
                className="w-full bg-gray-50 border border-gray-100 rounded-radius-5 px-3 py-3 pr-10 text-body-md text-gray-300 placeholder-gray-300"
              />
              <button 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                aria-label="복사"
              >
                <Image src="/icons/copy-gray.svg" alt="copy" width={20} height={20} />
              </button>
            </div>

            {/* Info box - 지원자 시간 페이지 편집 */}
            <button className="w-full bg-[#eff3ff] border-[0.5px] border-[#bfcefe] rounded-[10px] px-2.5 py-2.5 flex items-center justify-center gap-1 hover:bg-[#e5ecff] transition-colors">
              <span className="text-body-sm text-gray-950">지원자 시간 페이지 편집</span>
              <Image src="/icons/edit-blue.svg" alt="edit" width={14} height={13} />
            </button>

            {/* Action buttons */}
            <div className="flex gap-1.25">
              <SmartScheduleButton icon="/icons/graph.svg" iconWidth={7} iconHeight={9.3}>
                응답 결과 확인
              </SmartScheduleButton>
              <SmartScheduleButton showHash={true}>
                지원자 전화번호 복사
              </SmartScheduleButton>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mb-12">
          <Btn variant="primary" size="lg" className="w-full">
            스마트 시간표 생성
          </Btn>
        </div>

        {/* Overlay message */}
        {showOverlay && (
          <div className="absolute left-0 right-0 top-[115px] bottom-20 flex items-center justify-center z-50 bg-white/60">
            <div className="text-center">
              <p className="text-subtitle-md text-gray-950 font-medium">
                면접 정보 설정 후 이용 가능합니다.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <Navbar />
    </div>
    </main>
  );
}
