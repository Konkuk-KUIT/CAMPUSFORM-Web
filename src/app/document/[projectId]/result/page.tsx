import ResultPageHeader from '@/components/ui/ResultPageHeader';
import DocumentResultContent from '@/components/document/DocumentResultContent';


export default async function DocumentResultPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <div className="min-h-screen">
      <ResultPageHeader 
        projectId={Number(projectId)}
        title="서류 결과"
        backHref={`/document/${projectId}`}
      />
      <DocumentResultContent projectId={Number(projectId)} />
    </div>
  );
}


