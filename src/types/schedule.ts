// src/types/schedule.ts
export interface CalendarEvent {
  date: Date;
  title: string;
  timeRange: string;
}

export interface Schedule {
  date: Date;
  title: string;
  timeRange: string;
  isChecked: boolean;
}

export interface InterviewSchedule {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}