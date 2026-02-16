import SmartScheduleResponseResultForm from '@/components/form/SmartScheduleResponseResultForm';
import ProjectIdSetter from '@/components/ProjectIdSetter';

export default async function SmartScheduleResultPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <>
      <ProjectIdSetter projectId={Number(projectId)} />
      <SmartScheduleResponseResultForm />
    </>
  );
}
