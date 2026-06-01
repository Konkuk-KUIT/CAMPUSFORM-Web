import ProjectIdSetter from '@/components/ProjectIdSetter';
import ApplicantInterviewSubmitForm from '@/components/form/ApplicantInterviewSubmitForm';

export default async function ApplicantSubmitPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <>
      <ProjectIdSetter projectId={Number(projectId)} />
      <ApplicantInterviewSubmitForm />
    </>
  );
}