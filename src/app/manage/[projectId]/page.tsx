import { Suspense } from 'react';
import ManageApplicationForm from '@/components/home/manage/ManageApplicationForm';
import Loading from '@/components/ui/Loading';

export default async function ManagePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <ManageApplicationForm projectId={Number(projectId)} />
    </Suspense>
  );
}
