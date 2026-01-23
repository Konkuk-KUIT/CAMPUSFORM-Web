import InterviewHeader from '@/components/InterviewHeader';
import Navbar from '@/components/Navbar';

import InterviewInitialCards from '@/components/interview/InterviewInitialCards';

// 면접 지원자 초기 페이지
export default function InterviewInitialPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <InterviewHeader />
      <div className="flex-1 bg-gray-50 px-5 pt-[33px] pb-20">
        <InterviewInitialCards />
      </div>
      <Navbar />
    </div>
  );
}