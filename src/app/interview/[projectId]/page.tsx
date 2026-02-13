import InterviewContent from '@/components/interview/InterviewContent';
import InterviewHeader from '@/components/ui/InterviewHeader';
import Navbar from '@/components/Navbar';

// 면접 지원자 관리 페이지
export default async function InterviewListPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <div className="">
      <InterviewHeader />
      <div className="">
        <InterviewContent projectId={Number(projectId)} />
      </div>
      <Navbar />
    </div>
  );
}