// 면접 타입 정의
export interface Interview {
  id: string;
  applicantId: string; // 지원자 ID
  appointmentDate?: string; // "11월 15일 (수)"
  appointmentTime?: string; // "14:00"
  interviewStatus: '보류' | '합격' | '불합격'; // 면접 결과
  memo?: string;
}

// 면접 지원자 (기본 지원자 정보 + 면접 정보)
export interface InterviewApplicant {
  id: string;
  name: string;
  gender: '남' | '여';
  university: string;
  major: string;
  position: string;
  phone: string;
  email: string;
  documentStatus: '보류' | '합격' | '불합격'; // 서류 결과
  interviewStatus: '보류' | '합격' | '불합격'; // 면접 결과
  appointmentDate?: string;
  appointmentTime?: string;
  commentCount: number;
}