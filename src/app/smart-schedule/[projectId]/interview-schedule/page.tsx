import InterviewerAvailabilityForm from '@/components/form/InterviewerAvailabilityForm';
import ProjectIdSetter from '@/components/ProjectIdSetter';

export default async function InterviewSchedulePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <>
      <ProjectIdSetter projectId={Number(projectId)} />
      <InterviewerAvailabilityForm />
    </>
  );
}
