import DocumentContent from '@/components/document/DocumentContent';
import DocumentHeader from '@/components/ui/DocumentHeader';
import Navbar from '@/components/Navbar';

export default async function DocumentListPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <div>
      <DocumentHeader />
      <DocumentContent projectId={Number(projectId)} />
      <Navbar />
    </div>
  );
}
