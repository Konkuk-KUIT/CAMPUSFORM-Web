'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { projectService } from '@/services/projectService';
import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { useNewProjectStore } from '@/store/newProjectStore';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/ui/Header';
import Navbar from '@/components/Navbar';
import SmartScheduleStepIndicator from '@/components/ui/SmartScheduleStepIndicator';
import Btn from '@/components/ui/Btn';
import SmartScheduleDropdown from '@/components/ui/SmartScheduleDropdown';
import TimePicker from '@/components/ui/TimePicker';
import MultiSelectCalendar from '@/components/home/MultiSelectCalendar';
import { toast } from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';
import SmartScheduleReadOnlyBanner from '@/components/ui/SmartScheduleReadOnlyBanner';
import SmartScheduleSummaryCard from '@/components/ui/SmartScheduleSummaryCard';
import { authService } from '@/services/authService';

type TimeOption = { label: string; value: string };

export default function InterviewInfoSettingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Date state - 여러 날짜를 선택할 수 있도록 배열로 변경
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

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
    { id: '0', label: '0분' },
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
  const [isOwner, setIsOwner] = useState(false);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const isTimeValid = () => {
    const startTotalMin = parseInt(startHour) * 60 + parseInt(startMinute);
    const endTotalMin = parseInt(endHour) * 60 + parseInt(endMinute);
    return startTotalMin < endTotalMin;
  };

  // 멀티 날짜 선택 핸들러
  const handleMultiDateChange = (dates: Date[]) => {
    if (isReadOnlyMode) return;
    setSelectedDates(dates);
  };

  // 날짜 배열을 YYYY-MM-DD 형식으로 변환 및 정렬
  const getFormattedDates = (): string[] => {
    return selectedDates.map(date => date.toISOString().slice(0, 10)).sort();
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

  useEffect(() => {
    setIsReadOnlyMode(searchParams.get('readonly') === 'true');
  }, [searchParams]);

  useEffect(() => {
    const fetchIsOwner = async () => {
      if (!projectId) return;

      try {
        const auth = await authService.getCurrentUser();
        const { owner } = await projectService.getProjectAdmins(projectId);
        setIsOwner(Boolean(owner && auth.user?.userId === owner.adminId));
      } catch {
        setIsOwner(false);
      }
    };

    fetchIsOwner();
  }, [projectId]);

  // 기존 면접 설정 불러오기
  useEffect(() => {
    const loadExistingSetting = async () => {
      if (!projectId) return;

      try {
        const setting = await projectService.getInterviewSetting(projectId);

        if (!setting || !setting.interviewDates || setting.interviewDates.length === 0) {
          return; // 설정이 없으면 기본값 유지
        }

        // 면접 날짜 설정
        if (setting.interviewDates && Array.isArray(setting.interviewDates)) {
          const dates = setting.interviewDates.map((dateStr: string) => new Date(dateStr));
          setSelectedDates(dates);
        }

        // 시작 시간 설정
        if (setting.startTime) {
          const [sHour, sMin] = setting.startTime.split(':');
          setStartHour(sHour);
          setStartMinute(sMin);
        }

        // 종료 시간 설정
        if (setting.endTime) {
          const [eHour, eMin] = setting.endTime.split(':');
          setEndHour(eHour);
          setEndMinute(eMin);
        }

        // 슬롯당 최대 지원자 수
        if (setting.maxApplicantsPerSlot !== undefined) {
          setMaxApplicantsPerSlot(setting.maxApplicantsPerSlot);
        }

        // 슬롯당 최소 면접관 수
        if (setting.minInterviewersPerSlot !== undefined) {
          setMinInterviewersPerSlot(setting.minInterviewersPerSlot);
        }

        // 슬롯당 최대 면접관 수
        if (setting.maxInterviewersPerSlot !== undefined) {
          setMaxInterviewersPerSlot(setting.maxInterviewersPerSlot);
        }

        // 예상 소요 시간
        if (setting.slotDurationMin !== undefined) {
          setEstimatedDuration(setting.slotDurationMin.toString());
        }

        // 휴식 시간
        if (setting.slotBreakMin !== undefined) {
          setRestDuration(setting.slotBreakMin.toString());
        }
      } catch (error) {
        console.error('[InterviewSetting] 기존 설정 불러오기 실패:', error);
        // 에러가 나도 계속 진행 (새로 설정하면 됨)
      }
    };

    loadExistingSetting();
  }, [projectId]);

  const handleSubmit = async () => {
    if (isReadOnlyMode) return;
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
      toast.error('프로젝트를 찾을 수 없습니다. 먼저 생성해주세요.');
      return;
    }

    console.log('[InterviewSetting] 최종 사용 projectId:', targetProjectId);

    if (selectedDates.length === 0) {
      toast.warning('면접 날짜를 선택해주세요.');
      return;
    }
    if (!isTimeValid()) {
      toast.warning('종료 시간이 시작 시간보다 늦어야 합니다.');
      return;
    }
    if (!estimatedDuration) {
      toast.warning('예상 소요 시간을 선택해주세요.');
      return;
    }

    const payload = {
      interviewDates: getFormattedDates(),
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
      console.log('[InterviewSetting] 면접 정보 설정 성공');
      toast.success('면접 정보가 설정되었습니다.');
      if (targetProjectId) {
        // Step 2 (면접관 시간 등록)로 이동
        router.push(`/smart-schedule/${targetProjectId}/interview-schedule`);
      }
    } catch (e) {
      console.error('[InterviewSetting] 면접 정보 설정 실패:', e);
      toast.error('면접 정보 설정에 실패했습니다.');
    }
  };

  const currentInterviewSetting = useMemo(() => ({
    startDate: getFormattedDates()[0] ?? '',
    endDate: getFormattedDates()[getFormattedDates().length - 1] ?? '',
    startTime: `${startHour}:${startMinute}`,
    endTime: `${endHour}:${endMinute}`,
    slotDurationMin: estimatedDuration ? Number(estimatedDuration) : 0,
    breakDurationMin: restDuration ? Number(restDuration) : 0,
    maxApplicantsPerSlot,
    minInterviewersPerSlot,
    maxInterviewersPerSlot,
    interviewDates: getFormattedDates(),
  }), [
    selectedDates,
    startHour,
    startMinute,
    endHour,
    endMinute,
    estimatedDuration,
    restDuration,
    maxApplicantsPerSlot,
    minInterviewersPerSlot,
    maxInterviewersPerSlot,
  ]);

  const handleResetFromStep1 = async () => {
    if (!projectId) return;

    try {
      await projectService.resetSmartScheduleFromStep(projectId, 1);
      toast.success('면접 정보를 다시 수정할 수 있습니다.');
      setIsReadOnlyMode(false);
      setShowResetConfirm(false);
      router.replace(`/smart-schedule/${projectId}/setting`);
    } catch {
      toast.error('초기화에 실패했습니다.');
    }
  };

  const handleStepClick = (step: 1 | 2 | 3 | 4) => {
  if (!projectId) return;

  const paths: Record<1 | 2 | 3 | 4, string> = {
    1: `/smart-schedule/${projectId}/setting${isReadOnlyMode ? '?readonly=true' : ''}`,
    2: `/smart-schedule/${projectId}/interview-schedule${isReadOnlyMode ? '?readonly=true' : ''}`,
    3: `/smart-schedule/${projectId}/applicant`,
    4: `/smart-schedule/${projectId}/result`,
  };

  router.push(paths[step]);
  };

  return (
    <main className="min-h-screen flex justify-center bg-white font-['Pretendard']">
      <div className="relative w-93.75 bg-white min-h-screen flex flex-col overflow-x-hidden">
        {/* Top bar */}
        <Header title="면접 정보 설정" backTo={projectId ? `/smart-schedule/${projectId}` : '/smart-schedule'} />

        {/* Step Indicator */}
        <SmartScheduleStepIndicator
          currentStep={1}
          maxAccessibleStep={1}
          onStepClick={handleStepClick}
        />

        {isReadOnlyMode && (
          <>
            <SmartScheduleSummaryCard interviewSetting={currentInterviewSetting} />
            <div className="mx-4 mt-3 flex items-start justify-between">
              <div>
                <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">면접 정보 설정</h3>
                <p className="text-body-xs text-gray-300">설정된 면접 정보를 확인할 수 있습니다.</p>
              </div>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="h-7 rounded-[4px] bg-primary px-3 text-[12px] font-semibold text-white"
                >
                  수정하기
                </button>
              )}
            </div>
            <div className="px-4">
              <SmartScheduleReadOnlyBanner />
            </div>
          </>
        )}

        {/* Scrollable content */}
        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          {/* 면접 날짜 */}
          <div className="mt-2">
            <div className="flex items-center gap-2 py-1 mb-3">
              <Image src="/icons/calendar-black.svg" alt="calendar" width={15.75} height={15.75} />
              <span className="text-[15px] font-medium text-gray-950">면접 날짜</span>
            </div>

            <MultiSelectCalendar selectedDates={selectedDates} onDateChange={handleMultiDateChange} />
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
                if (isReadOnlyMode) return;
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
                <span className="text-12 text-gray-950">최대</span>
                <button
                  aria-label="decrease"
                  className="w-7.25 h-7.25 bg-blue-100 rounded-full flex items-center justify-center text-18"
                  onClick={() => { if (!isReadOnlyMode) setMaxApplicantsPerSlot(v => Math.max(1, v - 1)); }}
                >
                  −
                </button>
                <span className="text-16 text-gray-600 w-8 text-center">{maxApplicantsPerSlot}</span>
                <button
                  aria-label="increase"
                  className="w-7.25 h-7.25 bg-blue-100 rounded-full flex items-center justify-center text-18"
                  onClick={() => { if (!isReadOnlyMode) setMaxApplicantsPerSlot(v => v + 1); }}
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
                <span className="text-12 text-gray-950">최소</span>
                <button
                  aria-label="min-dec"
                  className="w-7.25 h-7.25 bg-blue-100 rounded-full flex items-center justify-center text-18"
                  onClick={() => { if (!isReadOnlyMode) setMinInterviewersPerSlot(v => Math.max(1, v - 1)); }}
                >
                  −
                </button>
                <span className="text-16 text-gray-600 w-8 text-center">{minInterviewersPerSlot}</span>
                <button
                  aria-label="min-inc"
                  className="w-7.25 h-7.25 bg-blue-100 rounded-full flex items-center justify-center text-18"
                  onClick={() => { if (!isReadOnlyMode) setMinInterviewersPerSlot(v => v + 1); }}
                >
                  +
                </button>
              </div>
              {/* 최대 */}
              <div className="flex items-center justify-end gap-2">
                <span className="text-12 text-gray-950">최대</span>
                <button
                  aria-label="max-dec"
                  className="w-7.25 h-7.25 bg-blue-100 rounded-full flex items-center justify-center text-18"
                  onClick={() => { if (!isReadOnlyMode) setMaxInterviewersPerSlot(v => Math.max(1, v - 1)); }}
                >
                  −
                </button>
                <span className="text-16 text-gray-600 w-8 text-center">{maxInterviewersPerSlot}</span>
                <button
                  aria-label="max-inc"
                  className="w-7.25 h-7.25 bg-blue-100 rounded-full flex items-center justify-center text-18"
                  onClick={() => { if (!isReadOnlyMode) setMaxInterviewersPerSlot(v => v + 1); }}
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
                  예상 소요 시간 <span className="text-12 text-gray-600">(분/타임 당)</span>
                </span>
              </div>
              <div className="flex items-center justify-end">
                <SmartScheduleDropdown
                  options={durationOptions}
                  value={estimatedDuration}
                  onChange={(value) => { if (!isReadOnlyMode) setEstimatedDuration(value); }}
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
                  onChange={(value) => { if (!isReadOnlyMode) setRestDuration(value); }}
                  width="w-[109px]"
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          {!isReadOnlyMode && (
            <div className="fixed bottom-20 left-0 right-0 px-5 max-w-93.75 mx-auto">
              <Btn variant="primary" size="lg" className="w-full" onClick={handleSubmit}>
                설정하기
              </Btn>
            </div>
          )}

          {/* Spacer for fixed button */}
          <div className="h-32" />
        </div>

        <ConfirmModal
          isOpen={showResetConfirm}
          onCancel={() => setShowResetConfirm(false)}
          onConfirm={handleResetFromStep1}
          description={
            <>
              수정 시 기존 데이터가 초기화되며,
              <br />
              지원자들에게 다시 응답을 받아야 합니다.
              <br />
              진행하시겠습니까?
            </>
          }
          confirmText="확인"
        />

        {/* Bottom nav */}
        <Navbar />
      </div>
    </main>
  );
}
