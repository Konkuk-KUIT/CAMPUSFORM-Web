'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Btn';
import ConfirmModal from '@/components/document/ConfirmModal';
import { projectService } from '@/services/projectService';

export default function DocumentCompleteButtons({ projectId }: { projectId: number }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 파란 버튼: 면접 단계로 전환 (DOCUMENT → INTERVIEW)
  const handleStartInterview = async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      await projectService.startInterview(projectId);
      router.push(`/interview/${projectId}`);
    } catch (e) {
      console.error('면접 단계 전환 실패:', e);
      alert('면접 단계 전환에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  // 흰색 버튼: 면접 없이 모집 종료 (DOCUMENT → DOCUMENT_COMPLETE)
  const handleCompleteWithoutInterview = async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      await projectService.completeDocument(projectId);
      router.push('/home');
    } catch (e) {
      console.error('서류 마감 실패:', e);
      alert('서류 마감에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
      setIsEndModalOpen(false);
    }
  };

  return (
    <>
      <div className="px-4 pb-20 flex flex-col gap-2">
        <p className="text-body-rg text-gray-400 text-center">※ 다음 단계로 이동하면 서류 수정이 불가능합니다.</p>
        <Button variant="primary" size="lg" onClick={() => setIsModalOpen(true)} disabled={isLoading}>
          {isLoading ? '처리 중...' : '다음 단계: 면접 설정하기'}
        </Button>
        <Button variant="outline" size="lg" onClick={() => setIsEndModalOpen(true)} disabled={isLoading}>
          면접 없이 모집 종료하기
        </Button>
      </div>

      {/* 파란 버튼 확인 모달 */}
      <ConfirmModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleStartInterview}
      />

      {/* 흰색 버튼 확인 모달 */}
      <ConfirmModal
        isOpen={isEndModalOpen}
        onCancel={() => setIsEndModalOpen(false)}
        onConfirm={handleCompleteWithoutInterview}
      />
    </>
  );
}