import DocumentResultContent from '@/components/document/DocumentResultContent';
import DocumentPageHeader from '@/components/document/DocumentPageHeader';

export default async function DocumentResultPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <div className="min-h-screen">
      <DocumentPageHeader projectId={Number(projectId)} title="서류 결과" backHref={`/document/${projectId}`} />
      <DocumentResultContent projectId={Number(projectId)} />
    </div>
  );
}
