'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Btn from '@/components/ui/Btn';
import ConfirmModal from '@/components/ConfirmModal';
import UnassignedApplicantsAlert from '@/components/ui/UnassignedApplicantsAlert';
import AllAccordion from '@/components/ui/AllAccordion';
import SmartScheduleButton from '@/components/ui/SmartScheduleButton';
import SmartScheduleCalendarPreview from '@/components/ui/SmartScheduleCalendarPreview';
import NotificationBell from '@/components/ui/NotificationBell';
import SmartScheduleStepIndicator from '@/components/ui/SmartScheduleStepIndicator';
import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { useNewProjectStore } from '@/store/newProjectStore';
import { projectService } from '@/services/projectService';
import { authService } from '@/services/authService';
import { documentResultService } from '@/services/documentResultService';
import { toast } from '@/components/Toast';
import type { ProjectAdminRaw } from '@/types/project';

export default function SmartScheduleMainForm() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInfoAlert, setShowInfoAlert] = useState(false);

  const handleInfoAlertConfirm = () => {
    setShowInfoAlert(false);
    if (projectId) {
      router.push(`/smart-schedule/${projectId}/result`);
    }
  };

  // 서류 합격자 전화번호 복사 함수
  const handleCopyPhoneNumbers = async () => {
    if (!projectId) {
      toast.error('프로젝트를 선택해주세요.');
      return;
    }

    try {
      const response = await documentResultService.getDocumentResults(projectId, 'PASS');
      const applicants = response.applicants || [];

      const phoneNumbers = applicants.map(a => a.phoneNumber).filter(Boolean) as string[];

      if (phoneNumbers.length === 0) {
        toast.error('복사할 전화번호가 없습니다.');
        return;
      }

      const text = phoneNumbers.join(' ');
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      toast.success(`${phoneNumbers.length}명의 전화번호가 복사되었습니다.`);
    } catch (error) {
      console.error('전화번호 복사 실패:', error);
      toast.error('전화번호 복사에 실패했습니다.');
    }
  };

  const handleConfirm = async () => {
    if (!projectId) {
      toast.error('프로젝트를 선택해주세요');
      return;
    }

    setShowConfirmDialog(false);
    setIsGenerating(true);

    try {
      const auth = await authService.getCurrentUser();
      const userId = auth.user?.userId;

      if (!userId) {
        toast.error('사용자 정보를 확인하지 못했습니다. 다시 로그인해주세요.');
        setIsGenerating(false);
        return;
      }

      const result = await projectService.generateSmartSchedule(projectId, userId);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`smartScheduleResult:${projectId}`, JSON.stringify(result));
      }

      toast.success('스마트 시간표가 생성되었습니다');
      setIsGenerating(false);
      if (projectId) {
        router.push(`/smart-schedule/${projectId}/result`);
      }
    } catch (error: any) {
      let errorMessage = '스마트 시간표 생성에 실패했습니다.';

      if (error?.response?.data?.message?.includes('foreign key constraint')) {
        errorMessage = '기존 스케줄 데이터가 있어 생성할 수 없습니다.\n관리자에게 문의해주세요.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
      setIsGenerating(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const router = useRouter();
  const projectId = useCurrentProjectStore(s => s.projectId);
  const setProjectId = useCurrentProjectStore(s => s.setProjectId);
  const createdProjectId = useNewProjectStore(s => s.createdProjectId);

  const [interviewSetting, setInterviewSetting] = useState<{
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    slotDurationMin: number;
    interviewDates?: string[];
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkInterviewSetting = async () => {
      if (!projectId) return;

      try {
        // 현재 사용자의 role 확인 (오버레이 표시용)
        const auth = await authService.getCurrentUser();
        const { owner } = await projectService.getProjectAdmins(projectId);
        const userIsOwner = auth.user && auth.user.userId === owner?.adminId;
        setIsOwner(!!userIsOwner);

        // 모든 사용자가 면접 설정 조회 가능
        const setting = await projectService.getInterviewSetting(projectId);

        const isValid =
          setting &&
          setting.interviewDates &&
          Array.isArray(setting.interviewDates) &&
          setting.interviewDates.length > 0 &&
          setting.startTime &&
          setting.endTime;

        if (isValid) {
          setInterviewSetting(setting);
          setIsConfigured(true);
        } else {
          setInterviewSetting(null);
          setIsConfigured(false);
        }
      } catch (error: any) {
        console.error('[SmartSchedule] 면접 정보 설정 조회 실패:', error);
        setInterviewSetting(null);
        setIsConfigured(false);
      }
    };

    checkInterviewSetting();
  }, [projectId]);

  useEffect(() => {
    const fetchInvestigationLink = async () => {
      if (!projectId) return;

      try {
        const linkData = await projectService.getInvestigationLink(projectId);

        let link = linkData?.link || linkData?.url;

        if (link) {
          if (link.startsWith('/submit')) {
            link = link.replace('/submit', `/smart-schedule/${projectId}/applicant-submit`);
          }

          if (link.startsWith('/')) {
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            link = `${origin}${link}`;
          }
          setInvestigationLink(link);
        }
      } catch (error) {
        console.log('[SmartSchedule] Investigation Link 조회 실패:', error);
      }
    };

    fetchInvestigationLink();
  }, [projectId]);

  const [selectedInterviewer, setSelectedInterviewer] = useState<number | null>(null);
  const [requiredInterviewers, setRequiredInterviewers] = useState<{ [key: number]: boolean }>({ 0: true });
  const hasSchedule = true;
  const isRepresentative = true;
  const [showInterviewerView, setShowInterviewerView] = useState(false);
  const [investigationLink, setInvestigationLink] = useState<string>('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [overviewCalendarStartDate, setOverviewCalendarStartDate] = useState(new Date());

  const [interviewersCellActive, setInterviewersCellActive] = useState<{
    [interviewerId: number]: { [key: string]: { top: boolean; bottom: boolean } };
  }>({});

  // 면접 설정이 로드되면 캘린더 시작 날짜를 면접 시작일로 설정
  useEffect(() => {
    if (interviewSetting && interviewSetting.interviewDates && interviewSetting.interviewDates.length > 0) {
      const firstDate = new Date(interviewSetting.interviewDates[0]);
      setOverviewCalendarStartDate(firstDate);
    }
  }, [interviewSetting]);

  const [interviewers, setInterviewers] = useState<
    Array<{
      userId: number;
      name: string;
      email: string;
      profileImageUrl?: string;
      isLeader: boolean;
    }>
  >([]);

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
      if (parts.length < 4) return;

      const date = `${parts[0]}-${parts[1]}-${parts[2]}`;
      const timeIndex = parseInt(parts[3]);

      if (!dateMap[date]) {
        dateMap[date] = [];
      }

      const [startHour] = interviewSetting.startTime.split(':').map(Number);
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
      await fetchInterviewers();
    } catch (error: any) {
      console.error('시간 저장 실패:', error);
      toast.error('시간 저장에 실패했습니다.');
    }
  };

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

      const adminList: Array<{
        userId: number;
        name: string;
        email: string;
        profileImageUrl?: string;
        isLeader: boolean;
        participated?: boolean;
        role: string;
      }> = [];

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
          role: owner.role,
        });
        // owner availability
        try {
          const availability = await projectService.getInterviewerAvailability(projectId, owner.adminId);
          const availabilities = availability?.availabilities || availability?.data?.availabilities || [];
          
          if (availabilities && Array.isArray(availabilities) && availabilities.length > 0 && interviewSetting) {
            const cellActive: { [key: string]: { top: boolean; bottom: boolean } } = {};
            const [startHour] = interviewSetting.startTime.split(':').map(Number);
            
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
          role: admin.role,
        });
        // admin availability
        try {
          const availability = await projectService.getInterviewerAvailability(projectId, admin.adminId);
          const availabilities = availability?.availabilities || availability?.data?.availabilities || [];
          
          if (availabilities && Array.isArray(availabilities) && availabilities.length > 0 && interviewSetting) {
            const cellActive: { [key: string]: { top: boolean; bottom: boolean } } = {};
            const [startHour] = interviewSetting.startTime.split(':').map(Number);
            
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

      // 필수 면접관 상태 설정 (adminList의 인덱스 기반)
      const newRequiredInterviewers: { [key: number]: boolean } = {};
      adminList.forEach((admin, idx) => {
        newRequiredInterviewers[idx] = requiredAdminIds.includes(admin.userId);
      });
      setRequiredInterviewers(newRequiredInterviewers);
    } catch (error) {
      console.error('면접관 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchInterviewers();
  }, [projectId, interviewSetting]);

  const showOverlay = !isConfigured;

  const interviewDates = useMemo(() => {
    if (!interviewSetting || !interviewSetting.interviewDates) return [];

    return interviewSetting.interviewDates
      .map((dateStr: string) => new Date(dateStr))
      .sort((a, b) => a.getTime() - b.getTime());
  }, [interviewSetting]);

  const timeSlots = useMemo(() => {
    if (!interviewSetting || !interviewSetting.startTime || !interviewSetting.endTime) return [];

    const [startHour] = interviewSetting.startTime.split(':').map(Number);
    const [endHour, endMin] = interviewSetting.endTime.split(':').map(Number);

    const actualStartHour = startHour;
    const actualEndHour = endMin > 0 ? endHour : endHour - 1;

    const slots: string[] = [];
    for (let hour = actualStartHour; hour <= actualEndHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    return slots;
  }, [interviewSetting]);

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

  const interviewersWithParticipation = useMemo(() => {
    return interviewers.map((interviewer, idx) => ({
      ...interviewer,
      participated: interviewersCellActive[interviewer.userId]
        ? Object.keys(interviewersCellActive[interviewer.userId]).length > 0
        : false,
      isRequired: requiredInterviewers[idx] || false,
    }));
  }, [interviewers, interviewersCellActive, requiredInterviewers]);


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

  const maxAccessibleStep: 1 | 2 | 3 | 4 = isConfigured ? 3 : 1;

  return (
    <main className="min-h-screen flex justify-center bg-white">
      <div className="relative w-93.75 bg-white min-h-screen flex flex-col overflow-x-hidden">
        <header className="flex items-center justify-between h-12 px-4 bg-white">
          <Link href="/home" className="w-6 h-6">
            <Image src="/icons/logo.svg" alt="로고" width={22} height={22} className="w-5.5 h-5.5" />
          </Link>
          <span className="text-title">스마트 시간표</span>
          <NotificationBell />
        </header>

        {/* Step Indicator - 대시보드에서도 표시 */}
        <SmartScheduleStepIndicator
          currentStep={1}
          maxAccessibleStep={maxAccessibleStep}
          onStepClick={handleStepClick}
        />

        <div className="flex-1 px-4 pt-4 pb-32 overflow-y-auto space-y-6">
          {/* 1. 면접 정보 설정 */}
          <div>
            <button
              onClick={() => projectId && router.push(`/smart-schedule/${projectId}/setting`)}
              className="w-full flex items-start justify-between group cursor-pointer"
            >
              <div className="text-left">
                <h3 className="text-base font-bold text-gray-950 mb-1">1. 면접 정보 설정</h3>
                <p className="text-xs text-gray-400">면접 일정과 운영 방식을 설정해 주세요.</p>
              </div>
              <div className="mt-1 shrink-0">
                <Image src="/icons/chevron-right.svg" alt="next" width={24} height={24} className="w-6 h-6" />
              </div>
            </button>
          </div>

          {/* 2. 면접관 시간 등록 */}
          <div>
            <h2 className="text-base font-bold text-gray-950 mb-2">2. 면접관 시간 등록</h2>
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
                      interviewDates={interviewDates}
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

          {/* 3. 지원자 면접 가능 시간 모집 */}
          <div>
            <h3 className="text-base font-bold text-gray-950 mb-2">3. 지원자 면접 가능 시간 모집</h3>
            <p className="text-xs text-gray-400 mb-4">
              응답 종료 전까지 지원자가 면접 가능 시간을 입력 후 제출합니다.
            </p>

            {/* 지원자 링크 섹션 */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="space-y-3">
                {/* 링크 */}
                <div className="relative">
                  <input
                    type="text"
                    value={investigationLink || '링크를 생성해주세요'}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm text-gray-600 placeholder-gray-400"
                  />
                  <button
                    onClick={async () => {
                      if (investigationLink) {
                        const textarea = document.createElement('textarea');
                        textarea.value = investigationLink;
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textarea);
                        toast.success('링크가 복사되었습니다.');
                      }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <Image src="/icons/copy.svg" alt="copy" width={20} height={20} />
                  </button>
                </div>

                {/* 지원자 시간 페이지 편집 */}
                <button
                  onClick={() => projectId && router.push(`/smart-schedule/${projectId}/applicant-submit`)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  <Image src="/icons/edit-blue.svg" alt="edit" width={18} height={18} />
                  지원자 시간 페이지 편집
                </button>

                {/* 액션 버튼들 */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-3 rounded-lg transition-colors text-sm">
                    <Image src="/icons/graph.svg" alt="stats" width={16} height={16} />
                    응답 결과 확인
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-3 rounded-lg transition-colors text-sm">
                    <Image src="/icons/hashtag.svg" alt="tag" width={16} height={16} />
                    지원자 전화번호 복사
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 스마트 시간표 생성 버튼 */}
        <div className="fixed bottom-20 left-0 right-0 px-5">
          <div className="max-w-93.75 mx-auto w-full">
            <button
              onClick={() => setShowConfirmDialog(true)}
              disabled={!isConfigured || isGenerating}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-colors text-base"
            >
              {isGenerating ? '생성 중...' : '스마트 시간표 생성'}
            </button>
          </div>
        </div>

        {/* 컨펌 다이얼로그 */}
        <ConfirmModal
          isOpen={showConfirmDialog}
          description="스마트 시간표를 생성하시겠습니까?\n생성된 시간표는 면접관과 지원자에게 공유됩니다."
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmDialog(false)}
          confirmText="생성"
          cancelText="취소"
        />

        <UnassignedApplicantsAlert isOpen={showInfoAlert} onConfirm={handleInfoAlertConfirm} />

        <div className="h-32" />

        {mounted && showOverlay && isOwner && (
          <div className="absolute left-0 right-0 top-28.75 bottom-20 flex items-center justify-center z-50 bg-white/85">
            <div className="text-center">
              <p className="text-subtitle-md text-gray-950 font-medium">면접 정보 설정 후 이용 가능합니다.</p>
            </div>
          </div>
        )}

        {mounted && showOverlay && !isOwner && (
          <div className="absolute bg-white/85 left-0 right-0 top-12 bottom-0 flex items-center justify-center z-40">
            <div className="text-center">
              <p className="text-subtitle-md text-gray-950 mb-6">아직 면접 설정이 등록되지 않았습니다.</p>
              <div className="text-body-rg text-gray-500">
                <p>면접 정보 설정을 원하시면</p>
                <p>
                  <span className="text-body-md">대표자에게 요청</span>해주세요.
                </p>
              </div>
            </div>
          </div>
        )}

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

        <Navbar />
      </div>
    </main>
  );
}
