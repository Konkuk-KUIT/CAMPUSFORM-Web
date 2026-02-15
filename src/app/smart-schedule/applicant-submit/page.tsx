import { Suspense } from 'react';
import ApplicantInterviewSubmitForm from '@/components/form/ApplicantInterviewSubmitForm';

export default function ApplicantInterviewSubmitPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplicantInterviewSubmitForm />
    </Suspense>
  );
}

