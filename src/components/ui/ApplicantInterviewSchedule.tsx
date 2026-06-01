'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import SmartScheduleStepIndicator from './SmartScheduleStepIndicator';
import SmartScheduleCalendarPreview from './SmartScheduleCalendarPreview';
import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { useNewProjectStore } from '@/store/newProjectStore';
import { authService } from '@/services/authService';
import { projectService } from '@/services/projectService';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from '@/components/Toast';
import Navbar from '@/components/Navbar';

interface InterviewSetting {
  interviewDates: string[];
  startTime?: string;
  endTime?: string;
  minInterviewers?: number;
  maxInterviewers?: number;
  interviewDuration?: number;
  breakDuration?: number;
}

interface Interviewer {
  userId: number;
  name: string;
  email: string;
  profileImageUrl?: string;
  isLeader: boolean;
}

export default function ApplicantInterviewSchedule() {
  const router = useRouter();
  const [interviewSetting, setInterviewSetting] = useState<InterviewSetting | null>(null);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [interviewersCellActive, setInterviewersCellActive] = useState<{
    [interviewerId: number]: { [key: string]: { top: boolean; bottom: boolean } };
  }>({});
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [requiredInterviewers, setRequiredInterviewers] = useState<{ [key: number]: boolean }>({});

  const projectId = useCurrentProjectStore(s => s.projectId);
  const createdProjectId = useNewProjectStore(s => s.createdProjectId);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // 현재 로그인 사용자 정보 조회
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.isAuthenticated && response.user) {
          setCurrentUserId(response.user.userId);
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  // 프로젝트 ID 초기화
  useEffect(() => {
    if (!projectId && createdProjectId) {
      useCurrentProjectStore.setState({ projectId: createdProjectId });
    }
  }, [createdProjectId]);

  // 면접 설정 조회
  useEffect(() => {
    const fetchInterviewSetting = async () => {
      if (!projectId) return;

      try {
        const setting = await projectService.getInterviewSetting(projectId);
        console.log('[InterviewerSchedule] 면접 설정:', setting);
        setInterviewSetting(setting);

        // 시간 슬롯 생성
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
      } catch (error) {
        console.error('면접 설정 조회 실패:', error);
      }
    };

    fetchInterviewSetting();
  }, [projectId]);

  // 면접관 목록 조회 및 가능시간 로드
  const fetchInterviewers = async () => {
    if (!projectId) return;

    try {
      const auth = await authService.getCurrentUser();
      const { owner, admins } = await projectService.getProjectAdmins(projectId);

      // 필수 면접관 목록 조회
      let requiredAdminIds: number[] = [];
      try {
        const requiredData = await projectService.getRequiredInterviewers(projectId);
        requiredAdminIds = requiredData.adminIds || [];
      } catch (error) {
        console.error('필수 면접관 목록 조회 실패:', error);
      }

      const adminList: Interviewer[] = [];
      const newRequiredInterviewers: { [key: number]: boolean } = {};
      const newInterviewersCellActive: {
        [interviewerId: number]: { [key: string]: { top: boolean; bottom: boolean } };
      } = {};

      // owner 정보 추가
      if (owner) {
        adminList.push({
          userId: owner.adminId,
          name: (auth.user && auth.user.userId === owner.adminId) ? '나(대표)' : owner.adminName,
          email: owner.email,
          profileImageUrl: owner.profileImageUrl ?? '',
          isLeader: true,
        });
        newRequiredInterviewers[owner.adminId] = requiredAdminIds.includes(owner.adminId);

        // owner availability 로드
        try {
          const availability = await projectService.getInterviewerAvailability(projectId, owner.adminId);
          const availabilities = availability?.availabilities || availability?.data?.availabilities || [];

          if (availabilities && Array.isArray(availabilities) && availabilities.length > 0 && interviewSetting) {
            const cellActive: { [key: string]: { top: boolean; bottom: boolean } } = {};
            const [startHour] = interviewSetting.startTime?.split(':').map(Number) || [9];

            availabilities.forEach((dayAvail: any) => {
              const date = dayAvail.date;
              const startTimes = dayAvail.startTimes || dayAvail.timeBlocks || [];

              startTimes.forEach((startTime: any) => {
                const timeString = typeof startTime === 'string' ? startTime : (startTime?.time || startTime?.startTime);
                if (!timeString || typeof timeString !== 'string') return;
                const [hour, min] = timeString.split(':').map(Number);
                const timeIndex = hour - startHour;
                const cellKey = `${date}-${timeIndex}`;
                if (!cellActive[cellKey]) {
                  cellActive[cellKey] = { top: false, bottom: false };
                }
                if (min === 0) cellActive[cellKey].top = true;
                else if (min === 30) cellActive[cellKey].bottom = true;
              });
            });

            if (Object.keys(cellActive).length > 0) {
              newInterviewersCellActive[owner.adminId] = cellActive;
            }
          }
        } catch (error: any) {
          console.error('면접관 가능시간 조회 실패:', error);
        }
      }

      // admins 정보 추가
      for (const admin of admins) {
        adminList.push({
          userId: admin.adminId,
          name: admin.adminName,
          email: admin.email,
          profileImageUrl: admin.profileImageUrl ?? '',
          isLeader: false,
        });
        newRequiredInterviewers[admin.adminId] = requiredAdminIds.includes(admin.adminId);

        // admin availability 로드
        try {
          const availability = await projectService.getInterviewerAvailability(projectId, admin.adminId);
          const availabilities = availability?.availabilities || availability?.data?.availabilities || [];

          if (availabilities && Array.isArray(availabilities) && availabilities.length > 0 && interviewSetting) {
            const cellActive: { [key: string]: { top: boolean; bottom: boolean } } = {};
            const [startHour] = interviewSetting.startTime?.split(':').map(Number) || [9];

            availabilities.forEach((dayAvail: any) => {
              const date = dayAvail.date;
              const startTimes = dayAvail.startTimes || dayAvail.timeBlocks || [];

              startTimes.forEach((startTime: any) => {
                const timeString = typeof startTime === 'string' ? startTime : (startTime?.time || startTime?.startTime);
                if (!timeString || typeof timeString !== 'string') return;
                const [hour, min] = timeString.split(':').map(Number);
                const timeIndex = hour - startHour;
                const cellKey = `${date}-${timeIndex}`;
                if (!cellActive[cellKey]) {
                  cellActive[cellKey] = { top: false, bottom: false };
                }
                if (min === 0) cellActive[cellKey].top = true;
                else if (min === 30) cellActive[cellKey].bottom = true;
              });
            });

            if (Object.keys(cellActive).length > 0) {
              newInterviewersCellActive[admin.adminId] = cellActive;
            }
          }
        } catch (error: any) {
          console.error('면접관 가능시간 조회 실패:', error);
        }
      }

      setInterviewers(adminList);
      setInterviewersCellActive(newInterviewersCellActive);
      setRequiredInterviewers(newRequiredInterviewers);
    } catch (error) {
      console.error('면접관 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    if (projectId && interviewSetting) {
      fetchInterviewers();
    }
  }, [projectId, interviewSetting]);

  const handleSaveInterviewerTime = async (userId: number, interviewerName: string, cellActive: { [key: string]: { top: boolean; bottom: boolean } }) => {
    if (!projectId) {
      toast.error('프로젝트가 선택되지 않았습니다.');
      return;
    }

    if (!interviewSetting) {
      toast.error('면접 설정을 먼저 완료해주세요.');
      return;
    }

    if (!cellActive || Object.keys(cellActive).length === 0) {
      toast.error('선택된 시간이 없습니다.');
      return;
    }

    const dateMap: { [date: string]: string[] } = {};

    Object.entries(cellActive).forEach(([cellKey, value]) => {
      const parts = cellKey.split('-');
      if (parts.length < 4) {
        // parts.length == 3인 경우 처리
        if (parts.length === 3) {
          const date = `${parts[0]}-${parts[1]}-${parts[2]}`;
          const timeIndex = parseInt(parts[3] || '0');

          if (!dateMap[date]) {
            dateMap[date] = [];
          }

          const [startHour] = interviewSetting.startTime?.split(':').map(Number) || [9];
          const actualHour = startHour + timeIndex;

          if (value.top) {
            dateMap[date].push(`${actualHour.toString().padStart(2, '0')}:00`);
          }

          if (value.bottom) {
            dateMap[date].push(`${actualHour.toString().padStart(2, '0')}:30`);
          }
        }
        return;
      }

      const date = `${parts[0]}-${parts[1]}-${parts[2]}`;
      const timeIndex = parseInt(parts[3]);

      if (!dateMap[date]) {
        dateMap[date] = [];
      }

      const [startHour] = interviewSetting.startTime?.split(':').map(Number) || [9];
      const actualHour = startHour + timeIndex;

      if (value.top) {
        dateMap[date].push(`${actualHour.toString().padStart(2, '0')}:00`);
      }

      if (value.bottom) {
        dateMap[date].push(`${actualHour.toString().padStart(2, '0')}:30`);
      }
    });

    const availabilities = Object.entries(dateMap)
      .map(([date, startTimes]) => ({
        date,
        startTimes: startTimes.sort(),
      }))
      .filter(item => item.startTimes.length > 0);

    if (availabilities.length === 0) {
      toast.error('선택된 시간이 없습니다.');
      return;
    }

    try {
      await projectService.updateInterviewerAvailability(projectId, userId, { availabilities });
      toast.success(`${interviewerName}님의 시간이 저장되었습니다.`);
      await fetchInterviewers();
    } catch (error: any) {
      console.error('시간 저장 실패:', error);
      toast.error('시간 저장에 실패했습니다.');
    }
  };

  const handleSaveAllInterviewers = async () => {
    if (!projectId) {
      toast.error('프로젝트가 선택되지 않았습니다.');
      return;
    }

    setLoading(true);

    try {
      let savedCount = 0;

      for (const interviewer of interviewers) {
        const cellActive = interviewersCellActive[interviewer.userId];
        if (cellActive && Object.keys(cellActive).length > 0) {
          await handleSaveInterviewerTime(interviewer.userId, interviewer.name, cellActive);
          savedCount++;
        }
      }

      if (savedCount > 0) {
        toast.success('면접관 시간이 모두 저장되었습니다.');
        // Step 3로 이동 (지원자 시간 모집)
        if (projectId) {
          router.push(`/smart-schedule/${projectId}/applicant-submit`);
        }
      } else {
        toast.error('저장할 시간 정보가 없습니다.');
      }
    } catch (error) {
      console.error('저장 실패:', error);
      toast.error('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const combinedCellActive = useMemo(() => {
    const combined: { [key: string]: { top: boolean; bottom: boolean } } = {};

    Object.entries(interviewersCellActive).forEach(([userId, cellActive]) => {
      Object.entries(cellActive).forEach(([key, value]) => {
        if (!combined[key]) {
          combined[key] = { top: false, bottom: false };
        }
        combined[key].top = combined[key].top || value.top;
        combined[key].bottom = combined[key].bottom || value.bottom;
      });
    });

    return combined;
  }, [interviewersCellActive]);

  const interviewDates = interviewSetting?.interviewDates || [];
  const dateLabel = interviewDates.length > 0 ? `${interviewDates[0]}~${interviewDates[interviewDates.length - 1]}` : '미설정';

  const getInterviewDuration = () => {
    if (interviewSetting?.interviewDuration) {
      return `${interviewSetting.interviewDuration}분`;
    }
    return '30분';
  };

  const getInterviewerCount = () => {
    const min = interviewSetting?.minInterviewers || 1;
    const max = interviewSetting?.maxInterviewers || 2;
    return `${min}~${max}명`;
  };

  const handleStepClick = (step: 1 | 2 | 3 | 4) => {
    if (!projectId) return;

    const paths: Record<1 | 2 | 3 | 4, string> = {
      1: `/smart-schedule/${projectId}/setting`,
      2: `/smart-schedule/${projectId}/interview-schedule`,
      3: `/smart-schedule/${projectId}/applicant-submit`,
      4: `/smart-schedule/${projectId}/result`,
    };

    router.push(paths[step]);
  };



  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <header className="flex items-center justify-between h-12 px-4 bg-white border-b border-gray-100">
        <Link href="/home" className="w-6 h-6">
          <Image src="/icons/logo.svg" alt="로고" width={22} height={22} className="w-5.5 h-5.5" />
        </Link>
        <span className="text-title">스마트 시간표</span>
        <button className="w-6 h-6 flex items-center justify-center">
          <Image src="/icons/alarm.svg" alt="알림" width={24} height={24} />
        </button>
      </header>

      {/* Step Indicator */}
      <SmartScheduleStepIndicator
        currentStep={2}
        maxAccessibleStep={3}
        onStepClick={handleStepClick}
      />

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* 조회 정보 카드 */}
        {interviewSetting && (
          <div className="mx-4 mt-4 p-4 bg-white border-[0.5px] border-gray-200 rounded-lg mb-6">
            {/* 날짜 정보 */}
            <div className="flex items-start gap-3 mb-5">
              <Image src="/icons/calendar.svg" alt="날짜" width={18} height={18} className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span className="text-xs text-gray-900 font-medium leading-4.5">{dateLabel}</span>
            </div>

            {/* 시간 정보 */}
            <div className="flex items-start gap-3 mb-5">
              <Image src="/icons/clock.svg" alt="시간" width={18} height={18} className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-gray-900 font-medium leading-4.5">
                  {interviewSetting.startTime} - {interviewSetting.endTime}
                </div>
                <div className="text-xs text-gray-600 leading-4.5 mt-0.5">
                  (면접 {getInterviewDuration()}{interviewSetting.breakDuration ? ` · 휴식 ${interviewSetting.breakDuration}분` : ''})
                </div>
              </div>
            </div>

            {/* 참여자 정보 */}
            <div className="flex items-start gap-3">
              <Image src="/icons/user.svg" alt="참여자" width={18} height={18} className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span className="text-xs text-gray-900 font-medium leading-4.5">지원자 최대 3명 · 면접관 {getInterviewerCount()}</span>
            </div>
          </div>
        )}

        {/* 면접관 별 시간 등록 */}
        <div className="px-4 mb-6">
          <h2 className="text-base font-bold text-gray-950 mb-2">면접관 시간 등록</h2>
          <p className="text-xs text-gray-400 mb-4">각 면접관 별 가능한 시간을 선택해 입력합니다.</p>

          <div className="space-y-4">
            {interviewers.map((interviewer) => (
              <div key={interviewer.userId} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* 면접관 정보 */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                      {interviewer.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-900">
                        {interviewer.name}
                        {interviewer.isLeader && <span className="ml-1 text-xs text-gray-500">(대표)</span>}
                      </div>
                      <div className="text-xs text-gray-600">{interviewer.email}</div>
                    </div>
                    {interviewersCellActive[interviewer.userId] && Object.keys(interviewersCellActive[interviewer.userId]).length > 0 && (
                      <div className="px-2 py-1 bg-blue-100 rounded text-xs text-blue-600 font-semibold">
                        {Object.keys(interviewersCellActive[interviewer.userId]).length}개 시간
                      </div>
                    )}
                  </div>
                </div>

                {/* 캘린더 프리뷰 */}
                <div className="p-4">
                  <SmartScheduleCalendarPreview
                    interviewerName={interviewer.name}
                    cellActive={interviewersCellActive[interviewer.userId] || {}}
                    onCellActiveChange={(newCellActive) =>
                      setInterviewersCellActive(prev => ({
                        ...prev,
                        [interviewer.userId]: newCellActive,
                      }))
                    }
                    interviewDates={interviewDates.map(d => new Date(d))}
                    timeSlots={timeSlots}
                    showProfiles={false}
                  />
                </div>

                {/* 저장 버튼 */}
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => {
                      const cellActive = interviewersCellActive[interviewer.userId];
                      if (cellActive && Object.keys(cellActive).length > 0) {
                        handleSaveInterviewerTime(interviewer.userId, interviewer.name, cellActive);
                      } else {
                        toast.error('선택된 시간이 없습니다.');
                      }
                    }}
                    className="w-full py-2.5 px-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    {interviewer.name} 시간 저장
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 모두 저장 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-center">
        <button
          onClick={handleSaveAllInterviewers}
          disabled={loading || interviewers.length === 0}
          className="w-full max-w-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3.5 px-6 rounded-xl transition-colors text-base"
        >
          {loading ? '저장 중...' : '다음 단계로'}
        </button>
      </div>

      {/* Navbar */}
      <Navbar />
    </div>
  );
}
