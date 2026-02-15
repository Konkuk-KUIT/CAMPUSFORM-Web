export type Stage = 'DOCUMENT' | 'INTERVIEW';

export interface Answer {
  question: string;
  answer: string;
}

// 목록 API 응답
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
  answers?: Answer[];
}

// 상세 API 응답
export interface ApplicantDetail {
  applicantId: number;
  name: string;
  gender: string;
  school: string;
  major: string;
  position: string;
  phoneNumber: string;
  email: string;
  status: string;
  answers: Answer[];
  favorite: boolean;
  commentCount: number;
}

// UI에서 사용하는 통합 타입
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
