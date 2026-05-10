'use client';

import { useState, useEffect } from 'react';
import { getSmartSchedulePreview } from '@/services/smartScheduleService';
import { projectService } from '@/services/projectService';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/ui/Header';
import Navbar from '@/components/Navbar';
import Btn from '@/components/ui/Btn';
import SmartScheduleStepIndicator from '@/components/ui/SmartScheduleStepIndicator';
import SmartScheduleSummaryCard from '@/components/ui/SmartScheduleSummaryCard';
import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { toast } from '@/components/Toast';

type SmartScheduleStep = 1 | 2 | 3 | 4;

interface InterviewSetting {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  slotDurationMin: number;
  breakDurationMin?: number;
  breakTimeMin?: number;
  maxApplicantsPerSlot?: number;
  maxApplicantsPerInterview?: number;
  maxApplicantsPerTime?: number;
  minInterviewersPerSlot?: number;
  maxInterviewersPerSlot?: number;
  interviewDates?: string[];
}

interface Applicant {
  id: number;
  name: string;
  school: string;
  major: string;
  position: string;
}

interface Interviewer {
  id: number;
  name: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  applicants: Applicant[];
  interviewers: Interviewer[];
}

interface DateSchedule {
  date: string;
  slots: TimeSlot[];
}

interface UnassignedApplicant extends Applicant {
  reason: string;
}

export default function SmartScheduleResultForm() {
  const router = useRouter();
  const projectId = useCurrentProjectStore(s => s.projectId);

  const [showInfo, setShowInfo] = useState(false);
  const [interviewSetting, setInterviewSetting] = useState<InterviewSetting | null>(null);
  const [scheduleData, setScheduleData] = useState<DateSchedule[]>([]);
  const [unassignedApplicants, setUnassignedApplicants] = useState<UnassignedApplicant[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleStepClick = (step: SmartScheduleStep) => {
    if (!projectId) return;

    if (isConfirmed && step !== 4) {
      toast.warning('면접 시간이 확정되어 이전 단계로 이동할 수 없습니다.');
      return;
    }

    const paths: Record<SmartScheduleStep, string> = {
      1: `/smart-schedule/${projectId}/setting?readonly=true`,
      2: `/smart-schedule/${projectId}/interview-schedule?readonly=true`,
      3: `/smart-schedule/${projectId}/applicant?readonly=true`,
      4: `/smart-schedule/${projectId}/result`,
    };

    router.push(paths[step]);
  };

  const toArray = (value: any) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return [value];
  };

  const normalizeApplicant = (item: any): Applicant => {
    const applicant =
      item?.applicant ??
      item?.applicantInfo ??
      item?.application ??
      item?.applicationUser ??
      item?.user ??
      item?.userInfo ??
      item;

    return {
      id:
        applicant?.id ??
        applicant?.applicantId ??
        applicant?.applicationId ??
        applicant?.userId ??
        item?.applicantId ??
        item?.applicationId ??
        item?.id ??
        0,
      name:
        applicant?.name ??
        applicant?.applicantName ??
        applicant?.userName ??
        applicant?.applicant_name ??
        item?.applicantName ??
        item?.name ??
        '',
      school:
        applicant?.school ??
        applicant?.university ??
        applicant?.college ??
        applicant?.schoolName ??
        item?.school ??
        item?.university ??
        '',
      major:
        applicant?.major ??
        applicant?.department ??
        applicant?.majorName ??
        item?.major ??
        item?.department ??
        '',
      position:
        applicant?.position ??
        applicant?.part ??
        applicant?.role ??
        applicant?.field ??
        item?.position ??
        item?.part ??
        '',
    };
  };

  const normalizeInterviewer = (item: any): Interviewer => {
    const interviewer =
      item?.interviewer ??
      item?.interviewerInfo ??
      item?.admin ??
      item?.adminInfo ??
      item?.user ??
      item?.userInfo ??
      item;

    return {
      id:
        interviewer?.id ??
        interviewer?.adminId ??
        interviewer?.interviewerId ??
        interviewer?.userId ??
        item?.adminId ??
        item?.interviewerId ??
        item?.id ??
        0,
      name:
        interviewer?.name ??
        interviewer?.adminName ??
        interviewer?.interviewerName ??
        interviewer?.userName ??
        item?.adminName ??
        item?.interviewerName ??
        item?.name ??
        '',
    };
  };

  const normalizeScheduleDays = (data: any): DateSchedule[] => {
    const rawDays =
      data?.days ??
      data?.data?.days ??
      data?.summaries ??
      data?.data?.summaries ??
      data?.interviewSchedules ??
      data?.data?.interviewSchedules ??
      data?.schedules ??
      data?.data?.schedules ??
      data?.slotsByDate ??
      data?.data?.slotsByDate ??
      [];

    if (!Array.isArray(rawDays)) return [];

    return rawDays.map((day: any) => {
      const rawSlots =
        day?.slots ??
        day?.timeSlots ??
        day?.schedules ??
        day?.interviewSlots ??
        day?.interviews ??
        day?.items ??
        [];

      return {
        date: day?.date ?? day?.interviewDate ?? day?.day ?? day?.scheduleDate ?? '',
        slots: toArray(rawSlots).map((slot: any) => {
          const rawApplicants =
            slot?.applicants ??
            slot?.assignedApplicants ??
            slot?.applicantSummaries ??
            slot?.applicationUsers ??
            slot?.applications ??
            slot?.participants ??
            slot?.applicantList ??
            slot?.applicantInfos ??
            slot?.applicationInfos ??
            [];

          const rawInterviewers =
            slot?.interviewers ??
            slot?.assignedInterviewers ??
            slot?.interviewerSummaries ??
            slot?.admins ??
            slot?.adminList ??
            slot?.interviewerList ??
            slot?.interviewerInfos ??
            slot?.adminInfos ??
            [];

          return {
            startTime:
              slot?.startTime ??
              slot?.start ??
              slot?.interviewStartTime ??
              slot?.timeStart ??
              slot?.startedAt ??
              '',
            endTime:
              slot?.endTime ??
              slot?.end ??
              slot?.interviewEndTime ??
              slot?.timeEnd ??
              slot?.endedAt ??
              '',
            applicants: toArray(rawApplicants)
              .map(normalizeApplicant)
              .filter((applicant: Applicant) => applicant.name),
            interviewers: toArray(rawInterviewers)
              .map(normalizeInterviewer)
              .filter((interviewer: Interviewer) => interviewer.name),
          };
        }),
      };
    });
  };

  const hasAssignedSchedule = (days: DateSchedule[]) => {
    return days.some(day =>
      day.slots.some(slot => slot.applicants.length > 0 || slot.interviewers.length > 0),
    );
  };

  const applyScheduleResult = (data: any, confirmed: boolean) => {
    const normalized = normalizeScheduleDays(data);
    setScheduleData(normalized);
    setUnassignedApplicants(data?.unassignedApplicants ?? data?.data?.unassignedApplicants ?? []);
    setIsConfirmed(confirmed);

    return normalized;
  };

  const fetchAssignedSchedule = async () => {
    if (!projectId) return false;

    try {
      const slotData = await projectService.getInterviewSlots(projectId);
      const normalized = normalizeScheduleDays(slotData);

      if (hasAssignedSchedule(normalized)) {
        setScheduleData(normalized);
        setUnassignedApplicants([]);
        setIsConfirmed(true);
        return true;
      }

      return false;
    } catch (error: any) {
      const status = error?.response?.status;

      if (status !== 404 && status !== 409) {
        console.warn('[SmartScheduleResult] 확정된 면접 슬롯 조회 실패');
      }

      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
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

        setInterviewSetting(isValid ? setting : null);
      } catch {
        setInterviewSetting(null);
      }

      if (typeof window !== 'undefined') {
        const cached = sessionStorage.getItem(`smartScheduleResult:${projectId}`);

        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            const normalized = applyScheduleResult(parsed, true);

            if (normalized.length > 0) {
              return;
            }
          } catch {
            sessionStorage.removeItem(`smartScheduleResult:${projectId}`);
          }
        }
      }

      const hasAssigned = await fetchAssignedSchedule();

      if (hasAssigned) {
        return;
      }

      try {
        const res = await getSmartSchedulePreview(projectId);
        const data = res.data;
        const normalized = applyScheduleResult(data, false);

        const confirmed =
          data.confirmed === true ||
          data.isConfirmed === true ||
          data.status === 'CONFIRMED' ||
          data.scheduleStatus === 'CONFIRMED';

        setIsConfirmed(confirmed && hasAssignedSchedule(normalized));
      } catch (error: any) {
        const status = error?.response?.status;

        if (status === 409) {
          setScheduleData([]);
          setUnassignedApplicants([]);

          toast.warning('아직 생성된 스마트 시간표가 없습니다.');
          router.replace(`/smart-schedule/${projectId}/applicant`);
          return;
        }

        setScheduleData([]);
        setUnassignedApplicants([]);

        toast.error('스마트 시간표 결과를 불러오지 못했습니다.');
      }
    };

    fetchData();
  }, [projectId, router]);

  const formatDateToKorean = (dateStr: string) => {
    const date = new Date(dateStr);
    const week = ['일', '월', '화', '수', '목', '금', '토'];

    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${week[date.getDay()]})`;
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  return (
    <main className="min-h-screen flex justify-center bg-white">
      <div className="relative w-93.75 bg-white min-h-screen flex flex-col overflow-x-hidden">
        <Header
          title="스마트 시간표 결과"
          backTo={
            projectId
              ? isConfirmed
                ? `/smart-schedule/${projectId}/result`
                : `/smart-schedule/${projectId}/applicant?readonly=true`
              : '/smart-schedule'
          }
        />

        <SmartScheduleStepIndicator
          currentStep={4}
          maxAccessibleStep={4}
          onStepClick={handleStepClick}
          isLocked={isConfirmed}
        />

        <SmartScheduleSummaryCard interviewSetting={interviewSetting} />

        <div className="flex-1 overflow-y-auto pb-37.5">
          <div className="px-4 pt-4 pb-3">
            <h2 className="text-subtitle-sm-sb text-gray-950 mb-1">
              스마트 시간표 결과
            </h2>

            <div className="flex items-center gap-1.25">
              <button
                type="button"
                onClick={() => setShowInfo(true)}
                className="text-body-md text-gray-400 underline"
              >
                스마트 시간표 유의사항 안내
              </button>

              <div className="w-4.5 h-4.5 relative">
                <Image src="/icons/info-2.svg" alt="info" width={18} height={18} />
              </div>
            </div>
          </div>

          {unassignedApplicants.length > 0 && (
            <div className="px-4 pb-4">
              <h2 className="text-subtitle-sm-sb text-gray-950 mb-3">
                면접 배정 불가 인원({unassignedApplicants.length}명)
              </h2>

              <div className="space-y-2">
                {unassignedApplicants.map((applicant, index) => (
                  <div key={index} className="bg-gray-50 rounded-10 p-4">
                    <p className="text-body-rg text-gray-950 mb-1">
                      {applicant.name}({applicant.school}/{applicant.major}/{applicant.position})
                    </p>
                    <p className="text-body-rg text-gray-700">
                      사유: {applicant.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {scheduleData.map(
            (dateSchedule, dateIndex) =>
              dateSchedule.slots.length > 0 && (
                <div key={dateIndex} className="mb-4">
                  <div className="px-4 pb-3">
                    <h2 className="text-subtitle-sm-sb text-gray-950">
                      {formatDateToKorean(dateSchedule.date)}
                    </h2>
                  </div>

                  <div className="px-4 space-y-3">
                    {dateSchedule.slots.map((slot, index) => (
                      <div
                        key={index}
                        className="border-[1.5px] border-gray-200 rounded-10 p-4"
                      >
                        <p className="text-subtitle-rg text-primary mb-3">
                          {formatTimeRange(slot.startTime, slot.endTime)}
                        </p>

                        <div className="mb-3">
                          <div className="flex gap-4">
                            <span className="text-body-md text-gray-950 w-14 shrink-0">
                              지원자
                            </span>

                            <div className="flex-1 space-y-1">
                              {slot.applicants.length > 0 ? (
                                slot.applicants.map((applicant, appIndex) => (
                                  <p key={appIndex} className="text-body-rg text-gray-950">
                                    {applicant.name}
                                    {(applicant.school || applicant.major || applicant.position) &&
                                      `(${applicant.school || '-'}/${applicant.major || '-'}/${
                                        applicant.position || '-'
                                      })`}
                                  </p>
                                ))
                              ) : (
                                <p className="text-body-rg text-gray-400">
                                  배정된 지원자 없음
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <span className="text-body-md text-gray-950 w-14 shrink-0">
                            면접관
                          </span>

                          <p className="text-body-rg text-gray-950 flex-1">
                            {slot.interviewers.length > 0
                              ? slot.interviewers.map(interviewer => interviewer.name).join(', ')
                              : '배정된 면접관 없음'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
          )}

          {scheduleData.length === 0 && unassignedApplicants.length === 0 && (
            <div className="px-4 py-20 text-center">
              <p className="text-body-sm text-gray-400">
                생성된 스마트 시간표가 없습니다.
              </p>
            </div>
          )}

          <div className="h-32" />
        </div>

        {isConfirmed && (
          <div className="fixed bottom-16.25 left-0 right-0 bg-white border-t border-gray-100 px-5 max-w-93.75 mx-auto pt-2.5 pb-2.5">
            <Btn variant="primary" size="lg" className="w-full" disabled>
              면접 시간 확정 완료
            </Btn>
          </div>
        )}

        {showInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,31,31,0.40)]">
            <div className="bg-white rounded-10 w-85.75 px-6 py-8.5 relative">
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="absolute top-2.5 right-2.5 w-6 h-6"
              >
                <Image src="/icons/close.svg" alt="close" width={24} height={24} />
              </button>

              <div className="flex flex-col justify-center w-71.25 h-51.25">
                <p className="text-subtitle-sm-rg text-gray-950 mb-4">
                  지원자와 면접관의 가능 시간을 알고리즘
                  <br />
                  기반으로 최적의 면접 시간을 자동 추천합니다.
                  <br />
                  아래 유의사항을 확인해주세요.
                </p>

                <div className="space-y-2 text-subtitle-sm-md text-gray-950">
                  <p>
                    1. 입력된 가능한 시간대를 기준으로 자동배정
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;됩니다.
                  </p>
                  <p>
                    2. 겹치는 일정이 없도록 가장 효율적인 조합을
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;우선시합니다.
                  </p>
                  <p>3. 시간 확정 후에는 수동으로 변경 가능합니다.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Navbar />
      </div>
    </main>
  );
}
