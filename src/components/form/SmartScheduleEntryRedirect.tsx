'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { projectService } from '@/services/projectService';

const getSmartScheduleLastPathKey = (projectId: number) => `smartScheduleLastPath:${projectId}`;

const isValidSmartScheduleLastPath = (path: string, projectId: number) => {
  const basePath = `/smart-schedule/${projectId}`;

  if (!path.startsWith(`${basePath}/`)) return false;

  return [
    `${basePath}/setting`,
    `${basePath}/interview-schedule`,
    `${basePath}/applicant`,
    `${basePath}/result`,
  ].some(validPath => path === validPath || path.startsWith(`${validPath}?`));
};

export default function SmartScheduleEntryRedirect() {
  const router = useRouter();
  const projectId = useCurrentProjectStore(s => s.projectId);

  useEffect(() => {
    const toArray = (value: any) => {
      if (Array.isArray(value)) return value;
      if (!value) return [];
      return [value];
    };

    const getRawDays = (data: any) => {
      return (
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
        []
      );
    };

    const hasAssignedSchedule = (data: any) => {
      const rawDays = getRawDays(data);

      if (!Array.isArray(rawDays)) return false;

      return rawDays.some((day: any) => {
        const slots = toArray(
          day?.slots ??
            day?.timeSlots ??
            day?.schedules ??
            day?.interviewSlots ??
            day?.interviews ??
            day?.items,
        );

        return slots.some((slot: any) => {
          const applicants = toArray(
            slot?.applicants ??
              slot?.assignedApplicants ??
              slot?.applicantSummaries ??
              slot?.applicationUsers ??
              slot?.applications ??
              slot?.participants ??
              slot?.applicantList ??
              slot?.applicantInfos ??
              slot?.applicationInfos,
          );

          const interviewers = toArray(
            slot?.interviewers ??
              slot?.assignedInterviewers ??
              slot?.interviewerSummaries ??
              slot?.admins ??
              slot?.adminList ??
              slot?.interviewerList ??
              slot?.interviewerInfos ??
              slot?.adminInfos,
          );

          return applicants.length > 0 || interviewers.length > 0;
        });
      });
    };

    const redirectBySmartScheduleStatus = async () => {
      if (!projectId) return;

      try {
        const confirmedData = await projectService.getConfirmedSmartSchedule(projectId);

        if (hasAssignedSchedule(confirmedData)) {
          router.replace(`/smart-schedule/${projectId}/result`);
          return;
        }
      } catch (error: any) {
        const status = error?.response?.status;

        if (status !== 404 && status !== 409) {
          console.warn('[SmartScheduleEntry] 확정된 스마트 시간표 조회 실패');
        }
      }

      if (typeof window !== 'undefined') {
        const cached = sessionStorage.getItem(`smartScheduleResult:${projectId}`);

        if (cached) {
          router.replace(`/smart-schedule/${projectId}/result?mode=preview`);
          return;
        }

        const savedPath = window.localStorage.getItem(getSmartScheduleLastPathKey(projectId));

        if (savedPath && isValidSmartScheduleLastPath(savedPath, projectId)) {
          router.replace(savedPath);
          return;
        }
      }

      /**
       * GET smart-schedule은 미리보기 계산 API라 DB 저장된 확정 결과 조회에 쓰지 않는다.
       * 확정 결과는 GET smart-schedule/confirmed API로 먼저 판단한다.
       */

      try {
        const setting = await projectService.getInterviewSetting(projectId);

        const hasInterviewSetting =
          setting &&
          Array.isArray(setting.interviewDates) &&
          setting.interviewDates.length > 0 &&
          setting.startTime &&
          setting.endTime;

        if (hasInterviewSetting) {
          router.replace(`/smart-schedule/${projectId}/interview-schedule`);
          return;
        }

        router.replace(`/smart-schedule/${projectId}/setting`);
      } catch {
        console.warn('[SmartScheduleEntry] 면접 설정 조회 실패');
        router.replace(`/smart-schedule/${projectId}/setting`);
      }
    };

    redirectBySmartScheduleStatus();
  }, [projectId, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-body-sm text-gray-400">
        스마트 시간표 정보를 불러오는 중입니다.
      </p>
    </main>
  );
}
