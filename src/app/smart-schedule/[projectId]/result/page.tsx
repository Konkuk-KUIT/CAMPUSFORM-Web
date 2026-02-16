import SmartScheduleResultForm from '@/components/form/SmartScheduleResultForm';
import ProjectIdSetter from '@/components/ProjectIdSetter';

export default async function SmartScheduleResultPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <>
      <ProjectIdSetter projectId={Number(projectId)} />
      <SmartScheduleResultForm />
    </>
  );
}
