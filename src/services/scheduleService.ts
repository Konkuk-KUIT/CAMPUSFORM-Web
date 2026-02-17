import apiClient from '@/lib/api';
import type { SmartScheduleResponse, InterviewSlotListResponse } from '@/types/schedule';

class ScheduleService {
  /**
   * 프로젝트의 스마트 시간표 조회 (확정된 면접 일정)
   */
  async getSmartSchedule(projectId: number): Promise<SmartScheduleResponse> {
    const response = await apiClient.get(`/projects/${projectId}/interview/smart-schedule`);
    return response.data;
  }

  /**
   * 프로젝트의 면접 슬롯 목록 조회
   */
  async getInterviewSlots(projectId: number): Promise<InterviewSlotListResponse> {
    const response = await apiClient.get(`/recruiting/projects/${projectId}/interview-slots`);
    return response.data;
  }
}

export const scheduleService = new ScheduleService();
