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

export interface UpdateStatusRequest {
  status: string;
}
