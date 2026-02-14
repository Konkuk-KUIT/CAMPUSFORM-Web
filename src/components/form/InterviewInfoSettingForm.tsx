'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { projectService } from '@/services/projectService';
import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { useNewProjectStore } from '@/store/newProjectStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Navbar from '@/components/Navbar';
import Btn from '@/components/ui/Btn';
import SmartScheduleDropdown from '@/components/ui/SmartScheduleDropdown';
import TimePicker from '@/components/ui/TimePicker';
import Calendar from '@/components/home/Calendar';

type TimeOption = { label: string; value: string };

export default function InterviewInfoSettingForm() {
  const router = useRouter();
  // Date state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Time state
  const hourOptions = useMemo<TimeOption[]>(() => {
    return Array.from({ length: 24 }, (_, h) => ({
      label: `${h.toString().padStart(2, '0')} :`,
      value: h.toString().padStart(2, '0'),
    }));
  }, []);
  const minuteOptions = useMemo<TimeOption[]>(() => {
    return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => ({
      label: m.toString().padStart(2, '0'),
      value: m.toString().padStart(2, '0'),
    }));
  }, []);

  const [startHour, setStartHour] = useState<string>('09');
  const [startMinute, setStartMinute] = useState<string>('00');
  const [endHour, setEndHour] = useState<string>('17');
  const [endMinute, setEndMinute] = useState<string>('00');

  // Counters
  const [maxApplicantsPerSlot, setMaxApplicantsPerSlot] = useState<number>(1);
  const [minInterviewersPerSlot, setMinInterviewersPerSlot] = useState<number>(1);
  const [maxInterviewersPerSlot, setMaxInterviewersPerSlot] = useState<number>(1);

  // Duration selections
  const durationOptions = [
    { id: '5', label: '5분' },
    { id: '10', label: '10분' },
    { id: '15', label: '15분' },
    { id: '20', label: '20분' },
    { id: '25', label: '25분' },
    { id: '30', label: '30분' },
    { id: '35', label: '35분' },
    { id: '40', label: '40분' },
    { id: '45', label: '45분' },
    { id: '50', label: '50분' },
    { id: '55', label: '55분' },
    { id: '60', label: '60분' },
  ];
  const restOptions = [
    { id: '5', label: '5분' },
    { id: '10', label: '10분' },
    { id: '15', label: '15분' },
    { id: '20', label: '20분' },
    { id: '25', label: '25분' },
    { id: '30', label: '30분' },
    { id: '35', label: '35분' },
    { id: '40', label: '40분' },
    { id: '45', label: '45분' },
    { id: '50', label: '50분' },
    { id: '55', label: '55분' },
    { id: '60', label: '60분' },
  ];
  const [estimatedDuration, setEstimatedDuration] = useState<string>('');
  const [restDuration, setRestDuration] = useState<string>('');

  const isTimeValid = () => {
    const startTotalMin = parseInt(startHour) * 60 + parseInt(startMinute);
    const endTotalMin = parseInt(endHour) * 60 + parseInt(endMinute);
    return startTotalMin < endTotalMin;
  };

  const handleDateConfirm = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleDateChange = (date: Date | [Date | null, Date | null] | null) => {
    if (Array.isArray(date)) {
      const [start, end] = date;
      setStartDate(start);
      setEndDate(end);
    }
  };

  const formatDateRange = () => {
    if (!startDate || !endDate) return '날짜를 선택해주세요';
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}.${month}.${day}`;
    };
    return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
  };

  // zustand store에서 현재 projectId 받아오기
  const projectId = useCurrentProjectStore(state => state.projectId);
  const setProjectId = useCurrentProjectStore(state => state.setProjectId);
  const createdProjectId = useNewProjectStore(state => state.createdProjectId);

  // projectId가 없으면 프로젝트 목록에서 가져오기
  useEffect(() => {
    const initializeProjectId = async () => {
      console.log('[InterviewSetting] 현재 projectId:', projectId);
      console.log('[InterviewSetting] 생성된 projectId:', createdProjectId);
      
      // 1순위: 이미 currentStore에 projectId가 있으면 사용
      if (projectId) {
        console.log('[InterviewSetting] 기존 projectId 사용:', projectId);
        return;
      }
      
      // 2순위: 방금 생성한 프로젝트 ID가 있으면 사용
      if (createdProjectId) {
        console.log('[InterviewSetting] 생성된 projectId 설정:', createdProjectId);
        setProjectId(createdProjectId);
        return;
      }
      
      // 3순위: 프로젝트 목록에서 가져오기
      try {
        console.log('[InterviewSetting] 프로젝트 목록 조회 중...');
        const projects = await projectService.getProjects();
        console.log('[InterviewSetting] 프로젝트 목록:', projects);
        
        if (projects.length > 0) {
          console.log('[InterviewSetting] 첫 번째 프로젝트 사용:', projects[0].id);
          setProjectId(projects[0].id);
        } else {
          console.warn('[InterviewSetting] 프로젝트가 없습니다');
        }
      } catch (error) {
        console.error('[InterviewSetting] 프로젝트 목록 조회 실패:', error);
      }
    };
    
    initializeProjectId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    console.log('[InterviewSetting] 제출 시도 - projectId:', projectId);
    console.log('[InterviewSetting] createdProjectId:', createdProjectId);
    
    // projectId 가져오기 (우선순위: projectId > createdProjectId > 프로젝트 목록)
    let targetProjectId = projectId;
    
    if (!targetProjectId && createdProjectId) {
      console.log('[InterviewSetting] createdProjectId 사용:', createdProjectId);
      targetProjectId = createdProjectId;
      setProjectId(createdProjectId); // store에도 저장
    }
    
    if (!targetProjectId) {
      console.log('[InterviewSetting] 프로젝트 목록에서 가져오기 시도');
      try {
        const projects = await projectService.getProjects();
        if (projects.length > 0) {
          targetProjectId = projects[0].id;
          setProjectId(targetProjectId);
          console.log('[InterviewSetting] 프로젝트 목록에서 가져옴:', targetProjectId);
        }
      } catch (error) {
        console.error('[InterviewSetting] 프로젝트 목록 조회 실패:', error);
      }
    }
    
    if (!targetProjectId) {
      console.error('[InterviewSetting] projectId를 가져올 수 없습니다');
      alert('프로젝트를 찾을 수 없습니다.\n프로젝트를 먼저 생성해주세요.');
      return;
    }
    
    console.log('[InterviewSetting] 최종 사용 projectId:', targetProjectId);
    
    if (!startDate) {
      alert('면접 시작 날짜를 선택해주세요');
      return;
    }
    if (!endDate) {
      alert('면접 종료 날짜를 선택해주세요');
      return;
    }
    if (!isTimeValid()) {
      alert('종료 시간이 시작 시간보다 늦어야 합니다');
      return;
    }
    if (!estimatedDuration) {
      alert('예상 소요 시간을 선택해주세요');
      return;
    }

    const payload = {
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      startTime: `${startHour}:${startMinute}`,
      endTime: `${endHour}:${endMinute}`,
      maxApplicantsPerSlot,
      minInterviewersPerSlot,
      maxInterviewersPerSlot,
      slotDurationMin: estimatedDuration ? parseInt(estimatedDuration) : 0,
      slotBreakMin: restDuration ? parseInt(restDuration) : 0,
    };
    
    console.log('[InterviewSetting] API 호출 - projectId:', targetProjectId, 'payload:', payload);
    
    try {
      await projectService.updateInterviewSetting(targetProjectId, payload);
      localStorage.setItem('interviewInfoConfigured', 'true');
      console.log('[InterviewSetting] 면접 정보 설정 성공');
      alert('면접 정보가 설정되었습니다');
      router.push('/smart-schedule');
    } catch (e) {
      console.error('[InterviewSetting] 면접 정보 설정 실패:', e);
      alert('면접 정보 설정에 실패했습니다.');
    }
  };

  return (
    <main className="min-h-screen flex justify-center bg-white font-['Pretendard']">
      <div className="relative w-[375px] bg-white min-h-screen flex flex-col overflow-x-hidden">
        {/* Top bar */}
        <Header title="면접 정보 설정" backTo="/smart-schedule" />

        {/* Scrollable content */}
        <div className="flex-1 px-4 pb-24 overflow-y-auto">
          {/* 면접 날짜 */}
          <div className="mt-2">
            <div className="flex items-center gap-2 py-1 mb-3">
              <Image src="/icons/calendar-black.svg" alt="calendar" width={15.75} height={15.75} />
              <span className="text-[15px] font-medium text-gray-950">면접 날짜</span>
            </div>

            <Calendar
              variant="modal"
              selected={startDate}
              onDateChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              disableTodayHighlight
            />
          </div>

          {/* 면접 시간대 */}
          <div className="mt-4">
            <div className="flex items-center gap-2 py-1">
              <Image src="/icons/clock.svg" alt="clock" width={15.75} height={15.75} />
              <span className="text-[15px] font-medium text-gray-950">면접 시간대</span>
            </div>

            <TimePicker
              startHour={startHour}
              startMinute={startMinute}
              endHour={endHour}
              endMinute={endMinute}
              onTimeChange={(field, value) => {
                if (field === 'startHour') setStartHour(value);
                if (field === 'startMinute') setStartMinute(value);
                if (field === 'endHour') setEndHour(value);
                if (field === 'endMinute') setEndMinute(value);
              }}
            />
          </div>

          {/* 타임 당 지원자 수 */}
          <div className="mt-3 px-2">
            <div className="flex flex-col gap-2">
              <span className="text-[15px] font-medium text-gray-950">타임 당 지원자 수</span>
              <div className="flex items-center justify-end gap-2">
                <span className="text-[12px] text-gray-950">최대</span>
                <button
                  aria-label="decrease"
                  className="w-[29px] h-[29px] bg-blue-100 rounded-full flex items-center justify-center text-[18px]"
                  onClick={() => setMaxApplicantsPerSlot(v => Math.max(1, v - 1))}
                >
                  −
                </button>
                <span className="text-[16px] text-gray-600 w-[32px] text-center">{maxApplicantsPerSlot}</span>
                <button
                  aria-label="increase"
                  className="w-[29px] h-[29px] bg-blue-100 rounded-full flex items-center justify-center text-[18px]"
                  onClick={() => setMaxApplicantsPerSlot(v => v + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 타임 당 면접관 수 */}
          <div className="mt-3 px-2">
            <div className="flex flex-col gap-2">
              <span className="text-[15px] font-medium text-gray-950">타임 당 면접관 수</span>
              {/* 최소 */}
              <div className="flex items-center justify-end gap-2">
                <span className="text-[12px] text-gray-950">최소</span>
                <button
                  aria-label="min-dec"
                  className="w-[29px] h-[29px] bg-blue-100 rounded-full flex items-center justify-center text-[18px]"
                  onClick={() => setMinInterviewersPerSlot(v => Math.max(1, v - 1))}
                >
                  −
                </button>
                <span className="text-[16px] text-gray-600 w-[32px] text-center">{minInterviewersPerSlot}</span>
                <button
                  aria-label="min-inc"
                  className="w-[29px] h-[29px] bg-blue-100 rounded-full flex items-center justify-center text-[18px]"
                  onClick={() => setMinInterviewersPerSlot(v => v + 1)}
                >
                  +
                </button>
              </div>
              {/* 최대 */}
              <div className="flex items-center justify-end gap-2">
                <span className="text-[12px] text-gray-950">최대</span>
                <button
                  aria-label="max-dec"
                  className="w-[29px] h-[29px] bg-blue-100 rounded-full flex items-center justify-center text-[18px]"
                  onClick={() => setMaxInterviewersPerSlot(v => Math.max(1, v - 1))}
                >
                  −
                </button>
                <span className="text-[16px] text-gray-600 w-[32px] text-center">{maxInterviewersPerSlot}</span>
                <button
                  aria-label="max-inc"
                  className="w-[29px] h-[29px] bg-blue-100 rounded-full flex items-center justify-center text-[18px]"
                  onClick={() => setMaxInterviewersPerSlot(v => v + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 예상 소요 시간 / 휴식 시간 */}
          <div className="mt-3 px-2">
            <div className="grid grid-cols-2 gap-y-3 py-2">
              <div>
                <span className="text-[15px] font-medium text-gray-950">
                  예상 소요 시간 <span className="text-[12px] text-gray-600">(분/타임 당)</span>
                </span>
              </div>
              <div className="flex items-center justify-end">
                <SmartScheduleDropdown
                  options={durationOptions}
                  value={estimatedDuration}
                  onChange={setEstimatedDuration}
                  width="w-[109px]"
                />
              </div>

              <div>
                <span className="text-[15px] font-medium text-gray-950">휴식 시간</span>
              </div>
              <div className="flex items-center justify-end">
                <SmartScheduleDropdown
                  options={restOptions}
                  value={restDuration}
                  onChange={setRestDuration}
                  width="w-[109px]"
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="fixed bottom-20 left-0 right-0 px-5 max-w-93.75 mx-auto">
            <Btn variant="primary" size="lg" className="w-full" onClick={handleSubmit}>
              설정하기
            </Btn>
          </div>
          
          {/* Spacer for fixed button */}
          <div className="h-32" />
        </div>

        {/* Bottom nav */}
        <Navbar />
      </div>
    </main>
  );
}
