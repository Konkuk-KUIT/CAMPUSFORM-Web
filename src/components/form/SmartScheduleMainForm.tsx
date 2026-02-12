'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Btn from '@/components/ui/Btn';
import AllAccordion from '@/components/ui/AllAccordion';
import SmartScheduleButton from '@/components/ui/SmartScheduleButton';
import SmartScheduleCalendarPreview from '@/components/ui/SmartScheduleCalendarPreview';

export default function SmartScheduleMainForm() {
    const [mounted, setMounted] = useState(false);
    // useEffect to set mounted true after client hydration
    useEffect(() => {
      setMounted(true);
    }, []);
  const router = useRouter();
  const [selectedInterviewer, setSelectedInterviewer] = useState<number | null>(null);
  const [requiredInterviewers, setRequiredInterviewers] = useState<{ [key: number]: boolean }>({ 0: true });
  const hasSchedule = true; // 스마트 시간표 생성 여부 (가정)
  const isRepresentative = true; // 대표자 여부 (가정)
  const [showInterviewerView, setShowInterviewerView] = useState(false);

  // 면접 정보 설정 완료 여부 확인
  let isConfigured = null;
  if (typeof window !== 'undefined') {
    isConfigured = localStorage.getItem('interviewInfoConfigured');
  }
  const showOverlay = !isConfigured;

  // TODO: 실제 API에서 스마트 시간표 생성 여부와 대표자 여부를 가져와야 함

  const interviewers = [
    { name: '면접관 1', email: 'interview1@gmail.com', isLeader: true },
    { name: '면접관 2', email: 'interview2@gmail.com', isLeader: false },
    { name: '면접관 3', email: 'interview3@gmail.com', isLeader: false },
  ];

  // 생성된 스마트 시간표 가정: 면접 날짜 예시 (6일, 7일)
  const interviewDates = [
    new Date(2026, 1, 6), // 2월 6일
    new Date(2026, 1, 7), // 2월 7일
  ];

  return (
    <main className="min-h-screen flex justify-center bg-white ">
      <div className="relative w-[375px] bg-white min-h-screen flex flex-col overflow-x-hidden">
        {/* Top app bar with logo and alarm */}
        <header className="flex items-center justify-between h-12 px-4 bg-white">
          <Link href="/home" className="w-6 h-6">
            <Image src="/icons/logo.svg" alt="로고" width={22} height={22} className="w-[22px] h-[22px]" />
          </Link>
          <span className="text-title">스마트 시간표</span>
          <button className="w-6 h-6 cursor-pointer" onClick={() => router.push('/home/notification')}>
            <Image src="/icons/notification.svg" alt="알림" width={24} height={24} />
          </button>
        </header>

        {/* Main content */}
        <div className="flex-1 px-4 pt-4 pb-4 overflow-y-auto">
          {/* Step 1: Interview Info Setup */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/smart-schedule/setting')}
              className="w-full flex items-start justify-between mb-2 group"
            >
              <div className="text-left">
                <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">1. 면접 정보 설정</h3>
                <p className="text-body-xs text-gray-300">면접 일정과 운영 방식을 설정해 주세요.</p>
              </div>
              <div className="mt-1 flex-shrink-0">
                <Image src="/icons/chevron-right.svg" alt="next" width={24} height={7} className="w-6 h-[7px]" />
              </div>
            </button>
          </div>

          {/* Step 2: Interviewer Time Registration */}
          <div className="mb-6">
            <div className="text-left mb-3">
              <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">2. 면접관 시간 등록</h3>
              <p className="text-body-xs text-gray-300">각 면접관 별 가능한 시간을 선택해 입력합니다.</p>
            </div>

            {/* Calendar preview - 전체 시간표 (항상 표시) */}
            <div className="mb-3">
              <AllAccordion title="전체">
                <SmartScheduleCalendarPreview 
                  seeds={[1, 2, 3]} 
                  interviewers={interviewers.map((int, idx) => ({ ...int, isRequired: requiredInterviewers[idx] || false }))} 
                  interviewDates={interviewDates}
                  showInterviewerView={showInterviewerView}
                  onShowInterviewerViewChange={setShowInterviewerView}
                />
              </AllAccordion>
            </div>

            {/* Interviewer List (always visible) */}
            <div className="bg-white">
              {interviewers.map((interviewer, idx) => (
                <div key={idx}>
                  {/* 면접관 카드 */}
                  <button
                    onClick={() => {
                      if (selectedInterviewer === idx) {
                        setSelectedInterviewer(null);
                      } else {
                        setSelectedInterviewer(idx);
                      }
                    }}
                    className="w-full h-[66px] px-0 py-[5px] flex items-center justify-between border-b border-gray-200"
                  >
                    <div className="flex items-center gap-[10px]">
                      <div className="w-[35px] h-[35px] rounded-full bg-gray-200 flex-shrink-0" />
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[14px] text-black font-normal leading-[20px]">{interviewer.name}</p>
                          {interviewer.isLeader && (
                            <span className="flex items-center justify-center px-[13px] h-[15px] border-[0.5px] border-primary rounded-[20px] text-[9px] text-primary bg-white leading-[0]">
                              대표자
                            </span>
                          )}
                        </div>
                        <a className="text-[12px] text-gray-500 leading-[17px] tracking-[0.12px]">
                          {interviewer.email}
                        </a>
                      </div>
                    </div>
                    <Image
                      src="/icons/chevron-down.svg"
                      alt="toggle"
                      width={24}
                      height={24}
                      className={`flex-shrink-0 w-6 h-6 ${selectedInterviewer === idx ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Individual interviewer calendar directly below the card */}
                  {selectedInterviewer === idx && (
                    <div className="w-full bg-white border-b border-gray-200 pb-3">
                      <SmartScheduleCalendarPreview
                        interviewerName={interviewer.name}
                        seed={idx + 1}
                        showProfiles={false}
                        showRequiredSection={true}
                        requiredInterviewer={requiredInterviewers[idx] || false}
                        onRequiredInterviewerChange={(value) => setRequiredInterviewers(prev => ({ ...prev, [idx]: value }))} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Applicant Response */}
          <div className="mt-6">
            <div className="text-left mb-3">
              <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">3. 지원자 면접 가능 시간 모집</h3>
              <p className="text-body-xs text-gray-300">
                응답 종료 전까지 지원자가 면접 가능 시간을 입력 후 제출합니다.
              </p>
            </div>

            <div className="bg-white p-2.5 space-y-2.5">
              {/* URL input with copy icon */}
              <div className="relative">
                <input
                  type="text"
                  value="https://www.campusform.com/interview/apply"
                  readOnly
                  onClick={() => router.push('/smart-schedule/applicant-submit')}
                  className="w-full bg-gray-50 border border-gray-100 rounded-radius-5 px-3 py-3 pr-10 text-body-md text-gray-300 placeholder-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
                />
                <button
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                  aria-label="복사"
                  onClick={e => {
                    e.stopPropagation();
                    navigator.clipboard.writeText('https://www.campusform.com/interview/apply');
                  }}
                >
                  <Image src="/icons/copy-gray.svg" alt="copy" width={16} height={16} className="w-4 h-4" />
                </button>
              </div>

              {/* Info box - 지원자 시간 페이지 편집 */}
              <button
                onClick={() => router.push('/smart-schedule/interview-schedule')}
                className="w-full bg-blue-50 border-[0.5px] border-blue-200 rounded-[10px] px-2.5 py-2.5 flex items-center justify-center gap-1 hover:bg-blue-100 transition-colors"
              >
                <span className="text-body-sm text-gray-950">지원자 시간 페이지 편집</span>
                <Image src="/icons/edit-blue.svg" alt="edit" width={14} height={13} className="w-[14px] h-[13px]" />
              </button>

              {/* Action buttons */}
              <div className="flex gap-1.25">
                <SmartScheduleButton
                  icon="/icons/graph.svg"
                  iconWidth={7}
                  iconHeight={9.3}
                  onClick={() => router.push('/smart-schedule/response-result')}
                >
                  응답 결과 확인
                </SmartScheduleButton>
                <SmartScheduleButton showHash={true}>지원자 전화번호 복사</SmartScheduleButton>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="fixed bottom-20 left-0 right-0 px-5 max-w-93.75 mx-auto">
            <Btn variant="primary" size="lg" className="w-full">
              스마트 시간표 생성
            </Btn>
          </div>
          
          {/* Spacer for fixed button */}
          <div className="h-32" />

          {/* Overlay message - 면접 정보 미설정 */}
          {mounted && showOverlay && (
            <div className="absolute left-0 right-0 top-[115px] bottom-20 flex items-center justify-center z-50 bg-white/85">
              <div className="text-center">
                <p className="text-subtitle-md text-gray-950 font-medium">면접 정보 설정 후 이용 가능합니다.</p>
              </div>
            </div>
          )}

          {/* Overlay message - 스마트 시간표 미생성 & 대표자 아님 */}
          {!hasSchedule && !isRepresentative && !showOverlay && (
            <div className="absolute bg-white/85 left-0 right-0 top-12 bottom-0 flex items-center justify-center z-40">
              <div className="text-center">
                <p className="text-subtitle-md text-gray-950 mb-6">생성된 스마트 시간표가 없습니다.</p>
                <div className="text-body-rg text-gray-500">
                  <p>다음 단계를 진행하고 싶다면</p>
                  <p>
                    <span className="text-body-md">대표자에게 요청</span>해주세요.
                  </p>
                </div>
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
