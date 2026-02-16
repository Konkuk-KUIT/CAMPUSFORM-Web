import { Suspense } from 'react';
import ApplicantInterviewSubmitForm from '@/components/form/ApplicantInterviewSubmitForm';
import ProjectIdSetter from '@/components/ProjectIdSetter';

export default async function ApplicantInterviewSubmitPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <>
      <ProjectIdSetter projectId={Number(projectId)} />
      <Suspense fallback={<div>Loading...</div>}>
        <ApplicantInterviewSubmitForm />
      </Suspense>
    </>
  );
}
