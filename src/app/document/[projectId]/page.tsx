import DocumentContent from '@/components/document/DocumentContent';
import DocumentHeader from '@/components/ui/DocumentHeader';
import Navbar from '@/components/Navbar';
import ProjectIdSetter from '@/components/ProjectIdSetter';

export default async function DocumentListPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <div>
      <ProjectIdSetter projectId={Number(projectId)} />
      <DocumentHeader />
      <DocumentContent projectId={Number(projectId)} />
      <Navbar />
    </div>
  );
}
