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
       * 중요:
       * preview가 409여도 확정된 interview-slots가 있을 수 있음.
       * 확정 이후 상태는 이 API로 확인한다.
       */
      try {
        const slotData = await projectService.getInterviewSlots(projectId);

        const summaries =
          slotData?.summaries ??
          slotData?.days ??
          slotData?.data?.summaries ??
          slotData?.data?.days ??
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