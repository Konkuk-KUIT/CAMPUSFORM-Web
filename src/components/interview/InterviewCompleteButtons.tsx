'use client';

import { useState } from 'react';
import Button from '@/components/Btn';
import ConfirmModal from '@/components/interview/ConfirmModal';

export default function InterviewCompleteButtons() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* 버튼 영역 */}
      <div className="px-4 pb-20 flex flex-col gap-2">
        <Button variant="primary" size="lg" onClick={() => setIsModalOpen(true)}>
          종료하기
        </Button>
      </div>

      <ConfirmModal isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)} />
    </>
  );
}
