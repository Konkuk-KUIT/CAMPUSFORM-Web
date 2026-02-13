export type Stage = 'DOCUMENT' | 'INTERVIEW';

export interface Applicant {
  applicantId: number;
  name: string;
  gender: string;
  university: string;
  major: string;
  position: string;
  phoneNumber: string;
  email: string;
  status: string;
  answers: Answer[];
  favorite: boolean;
  commentCount: number;
  currentStatus?: string;
  updatedAt?: string;
}

export interface Answer {
  question: string;
  answer: string;
}

export interface ApplicantsResponse {
  status: {
    totalCount: number;
    pendingCount: number;
    passCount: number;
    failCount: number;
  };
  applicants: Applicant[];
}

// API 실제 응답 타입
export interface ApplicantRaw {
  id: number;
  name: string;
  major: string;
  bookmarked: boolean;
  status: string;
  commentCount: number;
  school?: string;
  position?: string;
  gender?: string;
  phoneNumber?: string;
  email?: string;
  interviewDate?: string | null;
  interviewStartTime?: string | null;
  interviewTimeSource?: string | null;
}

export interface ApplicantsRawResponse {
  status: {
    totalCount: number;
    pendingCount: number;
    passCount: number;
    failCount: number;
  };
  applicants: ApplicantRaw[];
}

export interface UpdateStatusRequest {
  status: string;
}
