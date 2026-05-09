'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Btn from '@/components/ui/Btn';
import Navbar from '@/components/Navbar';
import Header from '@/components/ui/Header';
import SmartScheduleStepIndicator from '@/components/ui/SmartScheduleStepIndicator';
import SmartScheduleCalendarPreview from '@/components/ui/SmartScheduleCalendarPreview';
import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { projectService } from '@/services/projectService';
import { authService } from '@/services/authService';
import { toast } from '@/components/Toast';

interface DateAvailability {
  date: string;
  startTimes: string[];
}

interface Interviewer {
  userId: number;
  name: string;
  email: string;
  profileImage?: string;
}

interface InterviewersCellActive {
  [userId: number]: {
    [cellKey: string]: { top: boolean; bottom: boolean };
  };
}

export default function InterviewerAvailabilityForm() {
  const router = useRouter();
  const projectId = useCurrentProjectStore(s => s.projectId);
  const [interviewDates, setInterviewDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [interviewersCellActive, setInterviewersCellActive] = useState<InterviewersCellActive>({});
  const [expandedInterviewers, setExpandedInterviewers] = useState<Set<number>>(new Set());
  const [requiredInterviewers, setRequiredInterviewers] = useState<Set<number>>(new Set());
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // 면접 설정 조회
  useEffect(() => {
    const fetchInterviewSetting = async () => {
      if (!projectId) return;

      try {
        const setting = await projectService.getInterviewSetting(projectId);
        if (setting && setting.interviewDates && Array.isArray(setting.interviewDates)) {
          setInterviewDates(setting.interviewDates);

          // 시간 슬롯 생성 (30분 단위)
          if (setting.startTime && setting.endTime) {
            const [startHour, startMin] = setting.startTime.split(':').map(Number);
            const [endHour, endMin] = setting.endTime.split(':').map(Number);
            const slots: string[] = [];

            let currentHour = startHour;
            let currentMin = startMin;

            while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
              slots.push(`${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`);
              currentMin += 30;
              if (currentMin >= 60) {
                currentMin = 0;
                currentHour += 1;
              }
            }

            setTimeSlots(slots);
          }
        }
      } catch (error) {
        console.error('면접 설정 조회 실패:', error);
      }
    };

    fetchInterviewSetting();
  }, [projectId]);

  // 면접관 목록 조회
  useEffect(() => {
    const fetchInterviewers = async () => {
      if (!projectId || interviewDates.length === 0 || timeSlots.length === 0) return;

      try {
        const currentUser = await authService.getCurrentUser();
        const interviewerList: Interviewer[] = [];

        // 현재 사용자 (Owner)
        if (currentUser.user) {
          interviewerList.push({
            userId: currentUser.user.userId,
            name: currentUser.user.nickname || '나(대표)',
            email: currentUser.user.email || ''
          });
        }

        // Admins
        try {
          const adminsData = await projectService.getProjectAdmins(projectId);
          if (adminsData && adminsData.admins && Array.isArray(adminsData.admins)) {
            adminsData.admins.forEach((admin: any) => {
              interviewerList.push({
                userId: admin.id || admin.userId,
                name: admin.name,
                email: admin.email
              });
            });
          }
        } catch (e) {
          console.log('Admin 조회 실패:', e);
        }

        setInterviewers(interviewerList);

        // cellActive 초기화
        const initialCellActive: InterviewersCellActive = {};
        interviewerList.forEach(interviewer => {
          initialCellActive[interviewer.userId] = {};
          interviewDates.forEach(date => {
            for (let i = 0; i < timeSlots.length; i++) {
              const cellKey = `${date}-${i}`;
              initialCellActive[interviewer.userId][cellKey] = { top: false, bottom: false };
            }
          });
        });
        setInterviewersCellActive(initialCellActive);

        // 첫 번째 면접관(대표자)의 아코디언 자동으로 열기
        if (interviewerList.length > 0) {
          setExpandedInterviewers(new Set([interviewerList[0].userId]));
        }
      } catch (error) {
        console.error('면접관 목록 조회 실패:', error);
      }
    };

    fetchInterviewers();
  }, [projectId, interviewDates, timeSlots]);
  const handleSelectAll = () => {
    const newCellActive: InterviewersCellActive = {};

    interviewers.forEach(interviewer => {
      newCellActive[interviewer.userId] = {};
      interviewDates.forEach(date => {
        for (let i = 0; i < timeSlots.length; i++) {
          const cellKey = `${date}-${i}`;
          newCellActive[interviewer.userId][cellKey] = { top: true, bottom: true };
        }
      });
    });

    setInterviewersCellActive(newCellActive);
  };

  const handleSave = async () => {
    if (!projectId) {
      toast.error('프로젝트 정보가 없습니다');
      return;
    }

    setLoading(true);

    try {
      for (const interviewer of interviewers) {
        const cellActive = interviewersCellActive[interviewer.userId] || {};
        const availability: Array<{ date: string; startTimes: string[] }> = [];

        interviewDates.forEach(date => {
          const startTimes: string[] = [];
          for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
            const cellKey = `${date}-${timeIndex}`;
            const cell = cellActive[cellKey];
            if (cell && (cell.top || cell.bottom)) {
              startTimes.push(timeSlots[timeIndex]);
            }
          }

          if (startTimes.length > 0) {
            availability.push({ date, startTimes });
          }
        });

        await projectService.updateInterviewerAvailability(projectId, interviewer.userId, {
          availabilities: availability,
          isRequired: requiredInterviewers.has(interviewer.userId)
        });
      }

      toast.success('면접관 가능 시간이 저장되었습니다');
      // Step 3으로 이동
      if (projectId) {
        router.push(`/smart-schedule/${projectId}/applicant-submit`);
      }
    } catch (error) {
      console.error('저장 실패:', error);
      toast.error('저장에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayDates = () => {
    if (interviewDates.length === 0) return [];
    const start = currentDateIndex;
    const end = Math.min(start + 3, interviewDates.length);
    return interviewDates.slice(start, end);
  };

  const toggleInterviewerExpand = (userId: number) => {
    setExpandedInterviewers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const toggleRequiredInterviewer = (userId: number) => {
    setRequiredInterviewers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleCellActiveChange = (userId: number, newCellActive: { [cellKey: string]: { top: boolean; bottom: boolean } }) => {
    setInterviewersCellActive(prev => ({
      ...prev,
      [userId]: newCellActive
    }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <Header title="면접관 시간 등록" backTo={projectId ? `/smart-schedule/${projectId}` : '/smart-schedule'} />

      {/* Step Indicator */}
      <SmartScheduleStepIndicator currentStep={2} onStepClick={(step: number) => {
        if (projectId) {
          const paths: { [key: number]: string } = {
            1: `/smart-schedule/${projectId}/setting`,
            2: `/smart-schedule/${projectId}/interview-schedule`,
            3: `/smart-schedule/${projectId}/applicant-submit`,
            4: `/smart-schedule/${projectId}/result`,
          };
          router.push(paths[step]);
        }
      }} />

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto pb-80 px-4">

        {/* 전체 선택 버튼 */}
        <div className="mb-3">
          <button
            onClick={handleSelectAll}
            className="w-full h-9.5 px-3 py-1 border border-primary rounded-15 flex items-center justify-center text-15 text-primary bg-blue-50"
          >
            <span>전체</span>
            <Image
              alt="toggle"
              width={24}
              height={24}
              src="/icons/chevron-down.svg"
              className="absolute right-6"
            />
          </button>
        </div>

        {/* 캘린더 섹션 */}
        {interviewDates.length > 0 && (
          <div className="w-full bg-white mb-3">
            <div className="rounded-10 bg-gray-50 p-4">
              {/* 달 표시 */}
              <div className="flex items-center justify-center relative mb-15 gap-5 ml-8">
                <span className="text-15 font-medium leading-5 text-gray-950">
                  {format(new Date(interviewDates[Math.min(currentDateIndex, interviewDates.length - 1)]), 'yyyy년 M월', { locale: ko })}
                </span>
                <button className="cursor-pointer" aria-label="날짜 선택">
                  <Image alt="calendar" width={14.3} height={14.3} src="/icons/calendar-black.svg" />
                </button>
              </div>

              {/* 날짜 네비게이션 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentDateIndex(Math.max(0, currentDateIndex - 3))}
                  className="w-6 h-6 flex items-center justify-center shrink-0"
                  aria-label="이전"
                >
                  <Image alt="prev" width={24} height={24} src="/icons/chevron-right.svg" className="rotate-180" />
                </button>

                <div className="flex-1 grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {getDisplayDates().map(date => {
                    const d = new Date(date);
                    const dayName = format(d, 'E', { locale: ko });
                    const dayNum = format(d, 'd');
                    const isToday = format(new Date(), 'yyyy-MM-dd') === date;

                    return (
                      <div key={date} className="flex flex-col items-center gap-1">
                        <span className="text-12 text-gray-500">{dayName}</span>
                        <span className={`text-16 font-normal ${isToday ? 'text-primary' : 'text-gray-950'}`}>
                          {dayNum}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentDateIndex(Math.min(currentDateIndex + 3, Math.max(0, interviewDates.length - 3)))}
                  className="w-6 h-6 flex items-center justify-center shrink-0"
                  aria-label="다음"
                >
                  <Image alt="next" width={24} height={24} src="/icons/chevron-right.svg" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 면접관 목록 */}
        {interviewers.length > 0 && (
          <div className="bg-white">
            {interviewers.map((interviewer, idx) => (
              <div key={interviewer.userId}>
                {/* 면접관 헤더 */}
                <button
                  onClick={() => toggleInterviewerExpand(interviewer.userId)}
                  className="w-full h-16.5 px-4 py-1.25 flex items-center justify-between border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8.75 h-8.75 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-12 text-blue-500 font-medium">{interviewer.name.charAt(0)}</span>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <p className="text-14 text-black font-normal leading-5">{interviewer.name}</p>
                        {idx === 0 && (
                          <span className="flex items-center justify-center px-2 h-4 border border-primary rounded-full text-10 text-primary bg-white leading-tight">
                            대표자
                          </span>
                        )}
                      </div>
                      <p className="text-12 text-gray-500 leading-4.25 tracking-0.12">{interviewer.email}</p>
                    </div>
                  </div>
                  <Image
                    alt="toggle"
                    width={24}
                    height={24}
                    src="/icons/chevron-down.svg"
                    className={`shrink-0 w-6 h-6 transition ${expandedInterviewers.has(interviewer.userId) ? '' : 'rotate-180'}`}
                  />
                </button>

                {/* 면접관 상세 (펼침) */}
                {expandedInterviewers.has(interviewer.userId) && (
                  <div className="w-full bg-white border-b border-gray-200 pb-3">
                    {/* 필수 면접관 토글 */}
                    <div className="bg-white px-2.25 py-2.5 mb-3 mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-13 font-medium text-gray-600">필수 면접관</span>
                        <button
                          type="button"
                          onClick={() => toggleRequiredInterviewer(interviewer.userId)}
                          className={`relative w-10 h-5.5 rounded-full transition-colors ${
                            requiredInterviewers.has(interviewer.userId) ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all ${
                              requiredInterviewers.has(interviewer.userId) ? 'right-0.5' : 'left-0.5'
                            }`}
                          ></span>
                        </button>
                      </div>
                      <p className="text-12 text-gray-500 leading-4.25 tracking-0.12">
                        각 타임에 필수 면접관이 최소 1명씩 자동 배정됩니다.
                      </p>
                    </div>

                    {/* SmartScheduleCalendarPreview */}
                    {interviewDates.length > 0 && timeSlots.length > 0 && (
                      <SmartScheduleCalendarPreview
                        interviewerName={interviewer.name}
                        cellActive={interviewersCellActive[interviewer.userId] || {}}
                        onCellActiveChange={(newCellActive: any) => handleCellActiveChange(interviewer.userId, newCellActive)}
                        interviewDates={interviewDates.map(d => new Date(d))}
                        timeSlots={timeSlots}
                        showProfiles={false}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 저장 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-center border-t border-gray-100">
        <Btn
          onClick={handleSave}
          disabled={loading || interviewers.length === 0}
          variant="primary"
          size="lg"
        >
          {loading ? '저장 중...' : '나(대표) 시간 저장'}
        </Btn>
      </div>

      <Navbar />
    </div>
  );
}

