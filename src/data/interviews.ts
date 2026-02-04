import type { InterviewApplicant } from '@/types/interview';

// 면접 대상 지원자 (서류 합격자)
export const mockInterviewApplicants: InterviewApplicant[] = [
  {
    id: '1',
    name: '최수아',
    gender: '여',
    university: '한양대',
    major: '산업디자인과',
    position: '매니저',
    phone: '010-1111-1111',
    email: 'sua.choi@example.com',
    documentStatus: '합격',
    interviewStatus: '보류',
    appointmentDate: '11월 15일 (수)',
    appointmentTime: '14:00',
    commentCount: 0,
  },
  {
    id: '2',
    name: '홍길동',
    gender: '남',
    university: '서울대',
    major: '컴퓨터공학과',
    position: '개발자',
    phone: '010-2222-2222',
    email: 'hong@example.com',
    documentStatus: '합격',
    interviewStatus: '합격',
    appointmentDate: undefined, // 일정 미정
    appointmentTime: undefined,
    commentCount: 2,
  },
  {
    id: '3',
    name: '김철수',
    gender: '남',
    university: '연세대',
    major: '경영학과',
    position: '기획자',
    phone: '010-3333-3333',
    email: 'chulsoo@example.com',
    documentStatus: '합격',
    interviewStatus: '불합격',
    appointmentDate: '11월 20일 (월)',
    appointmentTime: '16:30',
    commentCount: 5,
  },
  {
    id: '4',
    name: '박서준',
    gender: '남',
    university: '서울대',
    major: '전기공학과',
    position: '개발자',
    phone: '010-4444-4444',
    email: 'seojun@example.com',
    documentStatus: '합격',
    interviewStatus: '합격',
    appointmentDate: '11월 18일 (토)',
    appointmentTime: '10:00',
    commentCount: 1,
  },
  {
    id: '5',
    name: '이서연',
    gender: '여',
    university: '고려대',
    major: '시각디자인과',
    position: '디자이너',
    phone: '010-5555-5555',
    email: 'seoyeon@example.com',
    documentStatus: '합격',
    interviewStatus: '합격',
    appointmentDate: '11월 22일 (수)',
    appointmentTime: '15:00',
    commentCount: 3,
  },
  {
    id: '6',
    name: '강지원',
    gender: '여',
    university: '성균관대',
    major: '경제학과',
    position: '기획자',
    phone: '010-6666-6666',
    email: 'jiwon@example.com',
    documentStatus: '합격',
    interviewStatus: '불합격',
    appointmentDate: '11월 17일 (금)',
    appointmentTime: '13:30',
    commentCount: 2,
  },
];

// 면접 합격자만 필터링
export const getPassedInterviewApplicants = () => {
  return mockInterviewApplicants.filter((a) => a.interviewStatus === '합격');
};

// 면접 불합격자만 필터링
export const getFailedInterviewApplicants = () => {
  return mockInterviewApplicants.filter((a) => a.interviewStatus === '불합격');
};