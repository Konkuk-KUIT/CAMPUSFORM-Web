// 지원자 타입 정의
export interface Applicant {
  id: string;
  name: string;
  gender: '남' | '여';
  university: string;
  major: string;
  position: string;
  phone: string;
  email: string;
  status: '보류' | '합격' | '불합격';
  commentCount: number;
}

// 지원자 상세 타입 (추후 확장용)
export interface ApplicantDetail extends Applicant {
  appliedDate?: string;
  introduction?: string;
  skills?: string[];
  experience?: string[];
  portfolio?: string;
}