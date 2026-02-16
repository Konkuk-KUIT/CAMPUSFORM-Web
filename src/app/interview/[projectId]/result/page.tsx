import ResultPageHeader from '@/components/ui/ResultPageHeader';
import InterviewResultContent from '@/components/interview/InterviewResultContent';


export default async function DocumentResultPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <div className="min-h-screen">
      <ResultPageHeader
        projectId={Number(projectId)} 
        title="면접 결과" 
        backHref={`/interview/${projectId}`} 
      />
      <InterviewResultContent projectId={Number(projectId)} />
    </div>
  );
}


