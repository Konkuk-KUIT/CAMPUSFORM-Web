// app/document/[projectId]/result/page.tsx
import DocumentResultHeader from '@/components/document/DocumentResultHeader';
import DocumentResultContent from '@/components/document/DocumentResultContent';

export default async function DocumentResultPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <div className="min-h-screen">
      <DocumentResultHeader />
      <DocumentResultContent projectId={Number(projectId)} />
    </div>
  );
}
