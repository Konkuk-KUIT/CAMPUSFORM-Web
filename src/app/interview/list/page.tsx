import InterviewContent from '@/components/interview/InterviewContent';
import InterviewHeader from '@/components/InterviewHeader';
import Navbar from '@/components/Navbar';

// 면접 지원자 관리 페이지
export default function InterviewListPage() {
  return (
    <div className="">
      <InterviewHeader />
      <div className="">
        <InterviewContent />
      </div>
      <Navbar />
    </div>
  );
}
