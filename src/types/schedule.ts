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

// API 응답 타입
export interface ApplicantInfo {
  id: number;
  name: string;
  school?: string;
  major?: string;
  position?: string;
}

export interface InterviewerInfo {
  id: number;
  name: string;
  required: boolean;
}

export interface SlotInfo {
  startTime: string;
  endTime: string;
  applicants: ApplicantInfo[];
  interviewers: InterviewerInfo[];
}

export interface DaySummary {
  date: string;
  slots: SlotInfo[];
}

export interface SmartScheduleResponse {
  days: DaySummary[];
  unassignedApplicants?: any[];
  statistics?: any;
}

export interface InterviewSlotListResponse {
  summaries: DaySummary[];
}