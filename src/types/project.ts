// src/types/project.ts
export interface Project {
  id: number;
  title: string;
  status: '모집 중' | '모집 완료';
  dateRange: string;
  applicantCount: number;
  googleFormUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  isLeader?: boolean;
}