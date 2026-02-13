'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Btn';
import ConfirmModal from '@/components/document/ConfirmModal';
import { projectService } from '@/services/projectService';
import { useCurrentProjectStore } from '@/store/currentProjectStore';

export default function DocumentCompleteButtons() {
  const router = useRouter();
  const projectId = useCurrentProjectStore(s => s.projectId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      await projectService.completeDocument(projectId);
      router.push(`/interview/${projectId}`);
    } catch (e) {
      console.error('서류 마감 실패:', e);
      alert('서류 마감에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {/* 버튼 영역 */}
      <div className="px-4 pb-20 flex flex-col gap-2">
        {/* 안내 텍스트 */}
        <p className="text-body-rg text-gray-400 text-center">※ 다음 단계로 이동하면 서류 수정이 불가능합니다.</p>
        <Button variant="primary" size="lg" onClick={() => setIsModalOpen(true)} disabled={isLoading}>
          {isLoading ? '처리 중...' : '다음 단계: 면접 설정하기'}
        </Button>
        <Button variant="outline" size="lg">
          면접 없이 모집 종료하기
        </Button>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}