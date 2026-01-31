'use client';

import { useState } from 'react';
import Button from '@/components/ui/Btn';
import ConfirmModal from '@/components/document/ConfirmModal';

export default function DocumentCompleteButtons() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* 버튼 영역 */}
      <div className="px-4 pb-20 flex flex-col gap-2">
        {/* 안내 텍스트 */}
        <p className="text-body-rg text-gray-400 text-center">※ 다음 단계로 이동하면 서류 수정이 불가능합니다.</p>
        <Button variant="primary" size="lg" onClick={() => setIsModalOpen(true)}>
          다음 단계: 면접 설정하기
        </Button>
        <Button variant="outline" size="lg">
          면접 없이 모집 종료하기
        </Button>
      </div>

      <ConfirmModal isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)} />
    </>
  );
}
