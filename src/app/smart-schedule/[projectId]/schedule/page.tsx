import AIInterviewScheduleTableForm from '@/components/form/AIInterviewScheduleTableForm';
import ProjectIdSetter from '@/components/ProjectIdSetter';

export default async function AIInterviewScheduleTablePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <>
      <ProjectIdSetter projectId={Number(projectId)} />
      <AIInterviewScheduleTableForm />
    </>
  );
}
