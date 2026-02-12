// 클라이언트 전용 ConnectForm 래퍼
'use client';
import { Suspense } from 'react';
import ConnectForm from './ConnectForm';

export default function ConnectFormClientWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConnectForm />
    </Suspense>
  );
}
