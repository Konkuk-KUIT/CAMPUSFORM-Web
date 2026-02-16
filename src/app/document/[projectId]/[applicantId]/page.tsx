import DocumentDetailHeader from '@/components/document/DocumentDetailHeader';
import DocumentDetailClient from '@/components/document/DocumentDetailClient';

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; applicantId: string }>;
}) {
  const { projectId, applicantId } = await params;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <DocumentDetailHeader projectId={Number(projectId)} />
      <div className="flex-1 overflow-hidden">
        <DocumentDetailClient applicantId={Number(applicantId)} projectId={Number(projectId)} stage="DOCUMENT" />
      </div>
    </div>
  );
}
