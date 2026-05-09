import InterviewInfoSettingForm from '@/components/form/InterviewInfoSettingForm';
import ProjectIdSetter from '@/components/ProjectIdSetter';

export default async function SmartSchedulePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <>
      <ProjectIdSetter projectId={Number(projectId)} />
      <InterviewInfoSettingForm />
    </>
  );
}
