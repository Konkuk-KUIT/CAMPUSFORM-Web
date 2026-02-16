'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Btn from '@/components/ui/Btn';
import ConfirmResetDialog from '@/components/ui/ConfirmResetDialog';
import UnassignedApplicantsAlert from '@/components/ui/UnassignedApplicantsAlert';
import AllAccordion from '@/components/ui/AllAccordion';
import SmartScheduleButton from '@/components/ui/SmartScheduleButton';
import SmartScheduleCalendarPreview from '@/components/ui/SmartScheduleCalendarPreview';
import NotificationBell from '@/components/ui/NotificationBell';
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
      const result = await projectService.generateSmartSchedule(projectId);
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
        setIsOwner(userIsOwner);

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

  useEffect(() => {
    if (!projectId || typeof window === 'undefined') return;

    const storageKey = `interviewersCellActive_${projectId}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setInterviewersCellActive(parsed);
      } catch (e) {
        console.error('[SmartSchedule] localStorage 파싱 실패:', e);
        setInterviewersCellActive({});
      }
    } else {
      setInterviewersCellActive({});
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId || typeof window === 'undefined') return;

    const storageKey = `interviewersCellActive_${projectId}`;
    if (Object.keys(interviewersCellActive).length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(interviewersCellActive));
    }
  }, [interviewersCellActive, projectId]);

  const [interviewers, setInterviewers] = useState<
    Array<{
      userId: number;
      name: string;
      email: string;
      profileImageUrl?: string;
      isLeader: boolean;
    }>
  >([]);

  const handleSaveInterviewerTime = async (userId: number, interviewerName: string) => {
    if (!projectId) {
      toast.error('프로젝트가 선택되지 않았습니다.');
      return;
    }

    if (!interviewSetting) {
      toast.error('면접 설정을 먼저 완료해주세요.');
      return;
    }

    const cellActive = interviewersCellActive[userId];
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
      if (isOwner) {
        // OWNER: 기존 방식
        await projectService.updateInterviewerAvailability(projectId, userId, { availabilities });
      } else {
        // ADMIN: 동일 API 사용 (명확히 분기)
        await projectService.updateInterviewerAvailability(projectId, userId, { availabilities });
      }
      toast.success(`${interviewerName}님의 시간이 저장되었습니다.`);
      fetchInterviewers();
    } catch (error) {
      console.error('시간 저장 실패:', error);
      toast.error('시간 저장에 실패했습니다.');
    }
  };

  const fetchInterviewers = async () => {
    if (!projectId) return;

    try {
      const auth = await authService.getCurrentUser();
      const { owner, admins } = await projectService.getProjectAdmins(projectId);


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
          if (availability && availability.availabilities && interviewSetting) {
            const cellActive: { [key: string]: { top: boolean; bottom: boolean } } = {};
            const [startHour] = interviewSetting.startTime.split(':').map(Number);
            availability.availabilities.forEach((dayAvail: any) => {
              const date = dayAvail.date;
              dayAvail.startTimes.forEach((startTime: string) => {
                const [hour, min] = startTime.split(':').map(Number);
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
        } catch (error) {
          console.log('OWNER availability 조회 실패 (미등록일 수 있음)');
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
          if (availability && availability.availabilities && interviewSetting) {
            const cellActive: { [key: string]: { top: boolean; bottom: boolean } } = {};
            const [startHour] = interviewSetting.startTime.split(':').map(Number);
            availability.availabilities.forEach((dayAvail: any) => {
              const date = dayAvail.date;
              dayAvail.startTimes.forEach((startTime: string) => {
                const [hour, min] = startTime.split(':').map(Number);
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
        } catch (error) {
          console.log(`ADMIN ${admin.adminName} availability 조회 실패`);
        }
      }

      setInterviewers(adminList);

      setInterviewersCellActive(prev => {
        if (Object.keys(prev).length === 0 && Object.keys(newInterviewersCellActive).length > 0) {
          return newInterviewersCellActive;
        }
        return prev;
      });
    } catch (error) {
      console.error('면접관 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchInterviewers();
  }, [projectId]);

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
    return interviewers.map(interviewer => ({
      ...interviewer,
      participated: interviewersCellActive[interviewer.userId]
        ? Object.keys(interviewersCellActive[interviewer.userId]).length > 0
        : false,
    }));
  }, [interviewers, interviewersCellActive]);

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

        <div className="flex-1 px-4 pt-4 pb-4 overflow-y-auto">
          <div className="mb-6">
            <button
              onClick={() => projectId && router.push(`/smart-schedule/${projectId}/setting`)}
              className="w-full flex items-start justify-between mb-2 group cursor-pointer"
            >
              <div className="text-left">
                <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">1. 면접 정보 설정</h3>
                <p className="text-body-xs text-gray-300">면접 일정과 운영 방식을 설정해 주세요.</p>
              </div>
              <div className="mt-1 shrink-0">
                <Image src="/icons/chevron-right.svg" alt="next" width={24} height={24} className="w-6 h-6" />
              </div>
            </button>
          </div>

          <div className="mb-6">
            <div className="text-left mb-3">
              <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">2. 면접관 시간 등록</h3>
              <p className="text-body-xs text-gray-300">각 면접관 별 가능한 시간을 선택해 입력합니다.</p>
            </div>

            <div className="mb-3">
              <AllAccordion title="전체">
                <SmartScheduleCalendarPreview
                  seeds={interviewersWithParticipation.map((_, idx) => idx + 1)}
                  interviewers={interviewersWithParticipation.map((int, idx) => ({
                    ...int,
                    isRequired: requiredInterviewers[idx] || false,
                  }))}
                  interviewDates={interviewDates}
                  timeSlots={timeSlots}
                  showInterviewerView={showInterviewerView}
                  onShowInterviewerViewChange={setShowInterviewerView}
                  interviewersCellActive={interviewersCellActive}
                  currentStartDate={overviewCalendarStartDate}
                  onCurrentStartDateChange={setOverviewCalendarStartDate}
                />
              </AllAccordion>
            </div>

            <div className="bg-white">
              {interviewersWithParticipation.map((interviewer, idx) => (
                <div key={idx}>
                  <button
                    onClick={() => {
                      if (selectedInterviewer === idx) {
                        setSelectedInterviewer(null);
                      } else {
                        setSelectedInterviewer(idx);
                      }
                    }}
                    className="w-full h-16.5 px-0 py-1.25 flex items-center justify-between border-b border-gray-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      {interviewer.profileImageUrl ? (
                        <Image
                          src={interviewer.profileImageUrl}
                          alt={interviewer.name}
                          width={35}
                          height={35}
                          className="w-8.75 h-8.75 rounded-full shrink-0"
                        />
                      ) : (
                        <div className="w-8.75 h-8.75 rounded-full bg-gray-200 shrink-0" />
                      )}
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <p className="text-14 text-black font-normal leading-5">{interviewer.name}</p>
                          {interviewer.isLeader && (
                            <span className="flex items-center justify-center px-3.25 h-3.75 border-[0.5px] border-primary rounded-10 text-9 text-primary bg-white leading-0">
                              대표자
                            </span>
                          )}
                        </div>
                        <a className="text-12 text-gray-500 leading-4.25 tracking-[0.12px]">
                          {interviewer.email}
                        </a>
                      </div>
                    </div>
                    <Image
                      src="/icons/chevron-down.svg"
                      alt="toggle"
                      width={24}
                      height={24}
                      className={`shrink-0 w-6 h-6 ${selectedInterviewer === idx ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {selectedInterviewer === idx && (
                    <div className="w-full bg-white border-b border-gray-200 pb-3">
                      <SmartScheduleCalendarPreview
                        interviewerName={interviewer.name}
                        seed={idx + 1}
                        showProfiles={false}
                        showRequiredSection={true}
                        requiredInterviewer={requiredInterviewers[idx] || false}
                        onRequiredInterviewerChange={value =>
                          setRequiredInterviewers(prev => ({ ...prev, [idx]: value }))
                        }
                        interviewDates={interviewDates}
                        timeSlots={timeSlots}
                        cellActive={interviewersCellActive[interviewer.userId] || {}}
                        onCellActiveChange={newCellActive => {
                          setInterviewersCellActive(prev => ({
                            ...prev,
                            [interviewer.userId]: newCellActive,
                          }));
                          handleSaveInterviewerTime(interviewer.userId, interviewer.name);
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-left mb-3">
              <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">3. 지원자 면접 가능 시간 모집</h3>
              <p className="text-body-xs text-gray-300">
                응답 종료 전까지 지원자가 면접 가능 시간을 입력 후 제출합니다.
              </p>
            </div>

            <div className="bg-white p-2.5 space-y-2.5">
              <div className="relative">
                <input
                  type="text"
                  value={investigationLink || '링크를 생성해주세요'}
                  readOnly
                  className="w-full bg-gray-50 border border-gray-100 rounded-radius-5 px-3 py-3 pr-10 text-body-md text-gray-300 placeholder-gray-300"
                />
                <button
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="복사"
                  disabled={!investigationLink}
                  onClick={e => {
                    e.stopPropagation();
                    if (investigationLink) {
                      navigator.clipboard.writeText(investigationLink);
                      toast.success('링크가 복사되었습니다.');
                    }
                  }}
                >
                  <Image src="/icons/copy-gray.svg" alt="copy" width={16} height={16} className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => projectId && router.push(`/smart-schedule/${projectId}/interview-schedule`)}
                className="w-full bg-blue-50 border-[0.5px] border-blue-200 rounded-10 px-2.5 py-2.5 flex items-center justify-center gap-1 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <span className="text-body-sm text-gray-950">지원자 시간 페이지 편집</span>
                <Image src="/icons/edit-blue.svg" alt="edit" width={14} height={13} className="w-3.5 h-3.25" />
              </button>

              <div className="flex gap-1.25">
                <SmartScheduleButton
                  icon="/icons/graph.svg"
                  iconWidth={7}
                  iconHeight={9.3}
                  onClick={() => projectId && router.push(`/smart-schedule/${projectId}/response-result`)}
                >
                  응답 결과 확인
                </SmartScheduleButton>
                <SmartScheduleButton showHash={true} onClick={handleCopyPhoneNumbers}>
                  지원자 전화번호 복사
                </SmartScheduleButton>
              </div>
            </div>
          </div>

          <div className="fixed bottom-20 left-0 right-0 px-5 max-w-93.75 mx-auto">
            <Btn
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setShowConfirmDialog(true)}
              disabled={isGenerating}
            >
              {isGenerating ? '생성 중...' : '스마트 시간표 생성'}
            </Btn>
          </div>

          <ConfirmResetDialog
            isOpen={showConfirmDialog}
            onClose={() => setShowConfirmDialog(false)}
            onConfirm={handleConfirm}
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
        </div>

        <Navbar />
      </div>
    </main>
  );
}
