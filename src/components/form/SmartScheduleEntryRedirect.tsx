'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { projectService } from '@/services/projectService';
import { getSmartSchedulePreview } from '@/services/smartScheduleService';

export default function SmartScheduleEntryRedirect() {
  const router = useRouter();
  const projectId = useCurrentProjectStore(s => s.projectId);

  useEffect(() => {
    const redirectBySmartScheduleStatus = async () => {
      if (!projectId) return;

      /**
       * 1. 확정된 면접 슬롯을 먼저 확인
       * 확정 이후에는 smart-schedule preview API가 409를 줄 수 있으므로,
       * 네비바 진입점에서는 interview-slots를 먼저 봐야 함.
       */
      try {
        const slotData = await projectService.getInterviewSlots(projectId);

        const summaries =
          slotData?.summaries ??
          slotData?.days ??
          slotData?.data?.summaries ??
          slotData?.data?.days ??
          slotData?.interviewSchedules ??
          slotData?.data?.interviewSchedules ??
          slotData?.schedules ??
          slotData?.data?.schedules ??
          slotData?.slotsByDate ??
          slotData?.data?.slotsByDate ??
          [];

        const hasConfirmedSchedule = Array.isArray(summaries) && summaries.length > 0;

        if (hasConfirmedSchedule) {
          router.replace(`/smart-schedule/${projectId}/result`);
          return;
        }
      } catch (error: any) {
        const status = error?.response?.status;

        if (status !== 404 && status !== 409) {
          console.warn('[SmartScheduleEntry] 확정된 면접 슬롯 조회 실패');
        }
      }

      /**
       * 2. 확정 슬롯이 없을 때만 스마트 시간표 preview 확인
       */
      try {
        const previewResponse = await getSmartSchedulePreview(projectId);
        const previewData = previewResponse?.data;

        const days =
          previewData?.days ??
          previewData?.data?.days ??
          previewData?.schedule?.days ??
          previewData?.smartSchedule?.days ??
          [];

        const unassignedApplicants =
          previewData?.unassignedApplicants ??
          previewData?.data?.unassignedApplicants ??
          previewData?.schedule?.unassignedApplicants ??
          previewData?.smartSchedule?.unassignedApplicants ??
          [];

        const hasPreviewSchedule =
          (Array.isArray(days) && days.length > 0) ||
          (Array.isArray(unassignedApplicants) && unassignedApplicants.length > 0);

        if (hasPreviewSchedule) {
          router.replace(`/smart-schedule/${projectId}/result`);
          return;
        }
      } catch (error: any) {
        const status = error?.response?.status;

        if (status !== 409) {
          console.warn('[SmartScheduleEntry] 스마트 시간표 preview 조회 실패');
        }
      }

      /**
       * 3. 시간표가 아직 없으면 면접 정보 설정 여부에 따라 이동
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