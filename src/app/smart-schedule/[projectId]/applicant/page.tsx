import ProjectIdSetter from '@/components/ProjectIdSetter';
import SmartScheduleApplicantStepForm from '@/components/form/SmartScheduleApplicantStepForm';

export default async function SmartScheduleApplicantPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <>
      <ProjectIdSetter projectId={Number(projectId)} />
      <SmartScheduleApplicantStepForm />
    </>
  );
}