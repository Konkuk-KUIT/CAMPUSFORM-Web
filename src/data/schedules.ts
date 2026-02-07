// src/data/schedules.ts
import { CalendarEvent, Schedule, InterviewSchedule } from '@/types/schedule';

export const mockCalendarEvents: CalendarEvent[] = [
  {
    date: new Date(2026, 0, 22),
    title: '요리퐁 신입부원 면접',
    timeRange: '오후 2:00 - 오후 3:00',
  },
  {
    date: new Date(2026, 0, 22),
    title: 'KUIT 동아리 설명회',
    timeRange: '오후 4:00 - 오후 5:00',
  },
  {
    date: new Date(2026, 0, 22),
    title: '학생회 정기 회의',
    timeRange: '오후 7:00 - 오후 9:00',
  },
  {
    date: new Date(2026, 0, 25),
    title: 'KUIT 신입부원 면접',
    timeRange: '오후 1:00 - 오후 2:00',
  },
  {
    date: new Date(2026, 0, 28),
    title: '동아리 정기 모임',
    timeRange: '오후 6:00 - 오후 8:00',
  },
];

export const mockSchedules: Schedule[] = [
  {
    date: new Date(2026, 0, 18),
    title: '요리퐁 6기 신입부원 모집 - 면접',
    timeRange: '오후 2:00 - 오후 2:30',
    isChecked: true,
  },
  {
    date: new Date(2026, 0, 18),
    title: '요리퐁 6기 신입부원 모집 - 면접',
    timeRange: '오후 2:00 - 오후 2:30',
    isChecked: false,
  },
  {
    date: new Date(2026, 0, 18),
    title: '요리퐁 6기 신입부원 모집 - 면접',
    timeRange: '오후 2:00 - 오후 2:30',
    isChecked: false,
  },
];

export const mockInterviewSchedules: InterviewSchedule[] = [
  {
    id: '1',
    candidateName: '김철수',
    position: '개발자',
    date: '2024-02-15',
    time: '14:00',
    interviewer: '이영희',
    status: 'scheduled',
    notes: '온라인 면접',
  },
  {
    id: '2',
    candidateName: '박영희',
    position: 'UI/UX 디자이너',
    date: '2024-02-16',
    time: '10:00',
    interviewer: '김철수',
    status: 'scheduled',
    notes: '오프라인 면접',
  },
  {
    id: '3',
    candidateName: '이순신',
    position: '개발자',
    date: '2024-02-10',
    time: '15:00',
    interviewer: '박민준',
    status: 'completed',
    notes: '합격 예정',
  },
];