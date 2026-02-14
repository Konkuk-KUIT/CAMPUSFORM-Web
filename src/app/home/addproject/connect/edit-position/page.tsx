import { Suspense } from 'react';
import PositionEditForm from '@/components/home/addproject/PositionEditForm';

export default function EditPositionPage() {
  return (
    <Suspense>
      <PositionEditForm />
    </Suspense>
  );
}
