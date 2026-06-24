import ProjectIdSetter from '@/components/ProjectIdSetter';
import ApplicantEditAdminForm from '@/components/form/ApplicantEditAdminForm';

export default async function ApplicantEditAdminPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <>
      <ProjectIdSetter projectId={Number(projectId)} />
      <ApplicantEditAdminForm />
    </>
  );
}
