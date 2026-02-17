import apiClient from '@/lib/apiClient';
import type { SmartScheduleResponse, InterviewSlotListResponse, CalendarEvent } from '@/types/schedule';

class ScheduleService {
  /**
   * 프로젝트의 스마트 시간표 조회 (확정된 면접 일정)
   */
  async getSmartSchedule(projectId: number): Promise<SmartScheduleResponse> {
    const response = await apiClient.get(`/api/projects/${projectId}/interview/smart-schedule`);
    return response.data;
  }

  /**
   * 프로젝트의 면접 슬롯 목록 조회
   */
  async getInterviewSlots(projectId: number): Promise<InterviewSlotListResponse> {
    const response = await apiClient.get(`/api/recruiting/projects/${projectId}/interview-slots`);
    return response.data;
  }

  /**
   * 모든 프로젝트의 스케줄을 CalendarEvent 형식으로 변환
   */
  async getAllSchedulesAsEvents(
    projectsMap: Map<number, string>
  ): Promise<CalendarEvent[]> {
    const events: CalendarEvent[] = [];

    for (const [projectId, projectTitle] of projectsMap.entries()) {
      try {
        const schedule = await this.getSmartSchedule(projectId);
        
        if (schedule.days && schedule.days.length > 0) {
          schedule.days.forEach(day => {
            day.slots.forEach(slot => {
              if (slot.applicants && slot.applicants.length > 0) {
                slot.applicants.forEach(applicant => {
                  events.push({
                    date: new Date(day.date),
                    title: `${projectTitle} - ${applicant.name} 면접`,
                    timeRange: `${slot.startTime} - ${slot.endTime}`,
                  });
                });
              } else {
                // 지원자가 없는 슬롯도 표시
                events.push({
                  date: new Date(day.date),
                  title: `${projectTitle} - 면접 슬롯`,
                  timeRange: `${slot.startTime} - ${slot.endTime}`,
                });
              }
            });
          });
        }
      } catch (error: any) {
        // 404나 500 에러는 스마트 시간표가 아직 생성되지 않은 것으로 간주
        if (error.response?.status === 404 || error.response?.status === 500) {
          console.log(`프로젝트 ${projectId}: 스마트 시간표가 아직 생성되지 않았습니다.`);
        } else {
          console.error(`프로젝트 ${projectId}의 스케줄 조회 실패:`, error);
        }
        // 오류가 발생해도 다른 프로젝트들은 계속 조회
      }
    }

    return events;
  }

  /**
   * 특정 날짜의 스케줄 조회
   */
  async getSchedulesByDate(
    projectsMap: Map<number, string>,
    targetDate: Date
  ): Promise<CalendarEvent[]> {
    const allEvents = await this.getAllSchedulesAsEvents(projectsMap);
    
    return allEvents.filter(event => {
      return event.date.toDateString() === targetDate.toDateString();
    });
  }
}

export const scheduleService = new ScheduleService();
