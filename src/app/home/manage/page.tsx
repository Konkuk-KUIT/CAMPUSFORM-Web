import { Suspense } from 'react';
import ManageApplicationForm from '@/components/home/manage/ManageApplicationForm';

export default function ManagePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">로딩 중...</div>}>
      <ManageApplicationForm />
    </Suspense>
  );
}
