import DocumentCompleteButtons from '@/components/document/DocumentCompleteButtons';
import DocumentCompleteContent from '@/components/document/DocumentCompleteContent';
import DocumentPageHeader from '@/components/document/DocumentPageHeader';
import Navbar from '@/components/Navbar';

export default async function DocumentCompletePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <DocumentPageHeader
          projectId={Number(projectId)}
          title="서류 결과"
          backHref={`/document/${projectId}/result`}
          showSubtitle={false}
        />
        <DocumentCompleteContent projectId={Number(projectId)} />
        <DocumentCompleteButtons projectId={Number(projectId)} />
      </div>
      <Navbar />
    </>
  );
}
