'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import Header from '@/components/ui/Header';
import Navbar from '@/components/Navbar';
import Btn from '@/components/ui/Btn';
import AllAccordion from '@/components/ui/AllAccordion';
import SmartScheduleStepIndicator from '@/components/ui/SmartScheduleStepIndicator';
import SmartScheduleCalendarPreview from '@/components/ui/SmartScheduleCalendarPreview';
import SmartScheduleSummaryCard from '@/components/ui/SmartScheduleSummaryCard';
import SmartScheduleTutorialOverlay from '@/components/ui/SmartScheduleTutorialOverlay';
import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { projectService } from '@/services/projectService';
import { authService } from '@/services/authService';
import { toast } from '@/components/Toast';

type SmartScheduleStep = 1 | 2 | 3 | 4;

type CellActive = {
  [key: string]: {
    top: boolean;
    bottom: boolean;
  };
};

type InterviewersCellActive = {
  [interviewerId: number]: CellActive;
};

interface InterviewSetting {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  slotDurationMin: number;
  interviewDates?: string[];
}

interface Interviewer {
  userId: number;
  name: string;
  email: string;
  profileImageUrl?: string;
  isLeader: boolean;
  participated?: boolean;
  role?: string;
}

export default function InterviewerAvailabilityForm() {
  const router = useRouter();
  const projectId = useCurrentProjectStore(s => s.projectId);

  const [isLoading, setIsLoading] = useState(false);
  const [isTutorialVisible, setIsTutorialVisible] = useState(false);

  const [interviewSetting, setInterviewSetting] = useState<InterviewSetting | null>(null);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [selectedInterviewer, setSelectedInterviewer] = useState<number | null>(null);

  const [requiredInterviewers, setRequiredInterviewers] = useState<{ [key: number]: boolean }>({});
  const [showInterviewerView, setShowInterviewerView] = useState(false);
  const [overviewCalendarStartDate, setOverviewCalendarStartDate] = useState(new Date());

  const [interviewersCellActive, setInterviewersCellActive] = useState<InterviewersCellActive>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const completed = window.localStorage.getItem('smartScheduleTutorialCompleted');
    setIsTutorialVisible(!completed);
  }, []);

  const handleStepClick = (step: SmartScheduleStep) => {
    if (!projectId) return;

    const paths: Record<SmartScheduleStep, string> = {
      1: `/smart-schedule/${projectId}/setting`,
      2: `/smart-schedule/${projectId}/interview-schedule`,
      3: `/smart-schedule/${projectId}/applicant`,
      4: `/smart-schedule/${projectId}/result`,
    };

    router.push(paths[step]);
  };

  const handleGoToApplicantStep = () => {
    if (!projectId) {
      toast.error('프로젝트를 선택해주세요.');
      return;
    }

    router.push(`/smart-schedule/${projectId}/applicant`);
  };

  const fetchInterviewSetting = async () => {
    if (!projectId) return;

    try {
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
      } else {
        setInterviewSetting(null);
      }
    } catch (error) {
      console.error('[InterviewerAvailability] 면접 정보 설정 조회 실패:', error);
      setInterviewSetting(null);
    }
  };

  const fetchInterviewers = async () => {
    if (!projectId) return;

    try {
      setIsLoading(true);

      const auth = await authService.getCurrentUser();
      const { owner, admins } = await projectService.getProjectAdmins(projectId);

      let requiredAdminIds: number[] = [];

      try {
        const requiredData = await projectService.getRequiredInterviewers(projectId);
        requiredAdminIds = requiredData.adminIds || [];
      } catch (error) {
        console.error('필수 면접관 목록 조회 실패:', error);
      }

      const adminList: Interviewer[] = [];
      const newInterviewersCellActive: InterviewersCellActive = {};

      const convertAvailabilityToCellActive = (availabilities: any[]): CellActive => {
        const cellActive: CellActive = {};

        if (!interviewSetting) return cellActive;

        const [startHour] = interviewSetting.startTime.split(':').map(Number);

        availabilities.forEach((dayAvail: any) => {
          const date = dayAvail.date;
          const startTimes = dayAvail.startTimes || dayAvail.timeBlocks || [];

          startTimes.forEach((startTime: any) => {
            const timeString =
              typeof startTime === 'string'
                ? startTime
                : startTime?.time || startTime?.startTime;

            if (!timeString || typeof timeString !== 'string') return;

            const [hour, min] = timeString.split(':').map(Number);
            const timeIndex = hour - startHour;
            const cellKey = `${date}-${timeIndex}`;

            if (!cellActive[cellKey]) {
              cellActive[cellKey] = {
                top: false,
                bottom: false,
              };
            }

            if (min === 0) {
              cellActive[cellKey].top = true;
            } else if (min === 30) {
              cellActive[cellKey].bottom = true;
            }
          });
        });

        return cellActive;
      };

      if (owner) {
        adminList.push({
          userId: owner.adminId,
          name: auth.user && auth.user.userId === owner.adminId ? '나(대표)' : owner.adminName,
          email: owner.email,
          profileImageUrl: owner.profileImageUrl ?? '',
          isLeader: true,
          role: owner.role,
        });

        try {
          const availability = await projectService.getInterviewerAvailability(
            projectId,
            owner.adminId,
          );

          const availabilities =
            availability?.availabilities || availability?.data?.availabilities || [];

          if (
            availabilities &&
            Array.isArray(availabilities) &&
            availabilities.length > 0 &&
            interviewSetting
          ) {
            const cellActive = convertAvailabilityToCellActive(availabilities);

            if (Object.keys(cellActive).length > 0) {
              newInterviewersCellActive[owner.adminId] = cellActive;
            }
          }
        } catch (error) {
          console.error('대표자 가능시간 조회 실패:', error);
        }
      }

      for (const admin of admins || []) {
        adminList.push({
          userId: admin.adminId,
          name: admin.adminName,
          email: admin.email,
          profileImageUrl: admin.profileImageUrl ?? '',
          isLeader: false,
          role: admin.role,
        });

        try {
          const availability = await projectService.getInterviewerAvailability(
            projectId,
            admin.adminId,
          );

          const availabilities =
            availability?.availabilities || availability?.data?.availabilities || [];

          if (
            availabilities &&
            Array.isArray(availabilities) &&
            availabilities.length > 0 &&
            interviewSetting
          ) {
            const cellActive = convertAvailabilityToCellActive(availabilities);

            if (Object.keys(cellActive).length > 0) {
              newInterviewersCellActive[admin.adminId] = cellActive;
            }
          }
        } catch (error) {
          console.error('면접관 가능시간 조회 실패:', error);
        }
      }

      setInterviewers(adminList);
      setInterviewersCellActive(newInterviewersCellActive);

      const newRequiredInterviewers: { [key: number]: boolean } = {};

      adminList.forEach((admin, idx) => {
        newRequiredInterviewers[idx] = requiredAdminIds.includes(admin.userId);
      });

      setRequiredInterviewers(newRequiredInterviewers);
    } catch (error) {
      console.error('면접관 목록 조회 실패:', error);
      toast.error('면접관 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewSetting();
  }, [projectId]);

  useEffect(() => {
    if (!interviewSetting) return;

    fetchInterviewers();
  }, [projectId, interviewSetting]);

  useEffect(() => {
    if (
      interviewSetting &&
      interviewSetting.interviewDates &&
      interviewSetting.interviewDates.length > 0
    ) {
      const firstDate = new Date(interviewSetting.interviewDates[0]);
      setOverviewCalendarStartDate(firstDate);
    }
  }, [interviewSetting]);

  const interviewDates = useMemo(() => {
    if (!interviewSetting || !interviewSetting.interviewDates) return [];

    return interviewSetting.interviewDates
      .map((dateStr: string) => new Date(dateStr))
      .sort((a, b) => a.getTime() - b.getTime());
  }, [interviewSetting]);

  const timeSlots = useMemo(() => {
    if (!interviewSetting || !interviewSetting.startTime || !interviewSetting.endTime) {
      return [];
    }

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

  const interviewersWithParticipation = useMemo(() => {
    return interviewers.map((interviewer, idx) => ({
      ...interviewer,
      participated: interviewersCellActive[interviewer.userId]
        ? Object.keys(interviewersCellActive[interviewer.userId]).length > 0
        : false,
      isRequired: requiredInterviewers[idx] || false,
    }));
  }, [interviewers, interviewersCellActive, requiredInterviewers]);

  const handleSaveInterviewerTime = async (
    userId: number,
    interviewerName: string,
    cellActive: CellActive,
  ) => {
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
      const timeIndex = parseInt(parts[3], 10);

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
      await projectService.updateInterviewerAvailability(projectId, userId, {
        availabilities,
      });

      toast.success(`${interviewerName}님의 가능 시간이 저장되었습니다.`);
    } catch (error) {
      console.error('시간 저장 실패:', error);
      toast.error('시간 저장에 실패했습니다.');
    }
  };

  return (
    <main className="min-h-screen flex justify-center bg-white">
      <div className="relative w-93.75 bg-white min-h-screen flex flex-col overflow-x-hidden">
        <Header
          title="면접관 시간 등록"
          backTo={projectId ? `/smart-schedule/${projectId}` : '/smart-schedule'}
        />

        <SmartScheduleStepIndicator
          currentStep={2}
          maxAccessibleStep={2}
          onStepClick={handleStepClick}
        />

        <SmartScheduleSummaryCard interviewSetting={interviewSetting} />

        <div className="flex-1 px-4 pt-4 pb-32 overflow-y-auto">
          <div className="mb-6">
            <div className="text-left mb-3">
              <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">
                면접관 시간 등록
              </h3>
              <p className="text-body-xs text-gray-300">
                각 면접관 별 가능한 시간을 선택해 입력합니다.
              </p>
            </div>

            {!interviewSetting && (
              <div className="py-20 text-center">
                <p className="text-subtitle-md text-gray-950 mb-2">
                  면접 정보 설정 후 이용 가능합니다.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    projectId && router.push(`/smart-schedule/${projectId}/setting`)
                  }
                  className="mt-3 text-body-sm text-primary underline"
                >
                  면접 정보 설정하러 가기
                </button>
              </div>
            )}

            {interviewSetting && (
              <>
                <div className="mb-3">
                  <AllAccordion title="전체" alwaysOpen={isTutorialVisible}>
                    <SmartScheduleCalendarPreview
                      seeds={interviewersWithParticipation.map((_, idx) => idx + 1)}
                      interviewers={interviewersWithParticipation.map((interviewer, idx) => ({
                        ...interviewer,
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
                  {isLoading && interviewers.length === 0 && (
                    <div className="py-16 text-center text-body-sm text-gray-400">
                      면접관 정보를 불러오는 중입니다.
                    </div>
                  )}

                  {!isLoading && interviewersWithParticipation.length === 0 && (
                    <div className="py-16 text-center text-body-sm text-gray-400">
                      등록된 면접관이 없습니다.
                    </div>
                  )}

                  {interviewersWithParticipation.map((interviewer, idx) => (
                    <div key={interviewer.userId}>
                      <button
                        type="button"
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
                              className="w-8.75 h-8.75 rounded-full shrink-0 object-cover"
                            />
                          ) : (
                            <div className="w-8.75 h-8.75 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-body-sm text-gray-500">
                              {interviewer.name.charAt(0)}
                            </div>
                          )}

                          <div className="text-left">
                            <div className="flex items-center gap-1.5">
                              <p className="text-14 text-black font-normal leading-5">
                                {interviewer.name}
                              </p>

                              {interviewer.isLeader && (
                                <span className="flex items-center justify-center px-2 h-4 border border-primary rounded-full text-10 text-primary bg-white leading-tight">
                                  대표자
                                </span>
                              )}
                            </div>

                            <p className="text-12 text-gray-500 leading-4.25 tracking-[0.12px]">
                              {interviewer.email}
                            </p>
                          </div>
                        </div>

                        <Image
                          src="/icons/chevron-down.svg"
                          alt="toggle"
                          width={24}
                          height={24}
                          className={`shrink-0 w-6 h-6 ${
                            selectedInterviewer === idx ? 'rotate-180' : ''
                          }`}
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
                            onRequiredInterviewerChange={async value => {
                              if (!projectId) return;

                              try {
                                await projectService.updateRequiredInterviewer(
                                  projectId,
                                  interviewer.userId,
                                  value,
                                );

                                setRequiredInterviewers(prev => ({
                                  ...prev,
                                  [idx]: value,
                                }));

                                toast.success(
                                  value
                                    ? '필수 면접관으로 설정되었습니다.'
                                    : '필수 면접관에서 해제되었습니다.',
                                );
                              } catch (error) {
                                console.error('필수 면접관 설정 실패:', error);
                                toast.error('필수 면접관 설정에 실패했습니다.');
                              }
                            }}
                            interviewDates={interviewDates}
                            timeSlots={timeSlots}
                            cellActive={interviewersCellActive[interviewer.userId] || {}}
                            onCellActiveChange={newCellActive => {
                              setInterviewersCellActive(prev => ({
                                ...prev,
                                [interviewer.userId]: newCellActive,
                              }));

                              handleSaveInterviewerTime(
                                interviewer.userId,
                                interviewer.name,
                                newCellActive,
                              );
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="fixed bottom-20 left-0 right-0 px-5 max-w-93.75 mx-auto">
            <Btn
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleGoToApplicantStep}
              disabled={!interviewSetting}
            >
              설정하기
            </Btn>
          </div>

          <div className="h-32" />
        </div>

        <Navbar />

        <SmartScheduleTutorialOverlay
          currentStep={2}
          projectId={projectId ? Number(projectId) : null}
          onClose={() => setIsTutorialVisible(false)}
        />
      </div>
    </main>
  );
}