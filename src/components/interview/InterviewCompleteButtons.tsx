'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Btn';
import ConfirmModal from '@/components/interview/ConfirmModal';
import { projectService } from '@/services/interview/projectService';

interface InterviewCompleteButtonsProps {
  projectId: number;
}

export default function InterviewCompleteButtons({ projectId }: InterviewCompleteButtonsProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await projectService.completeAll(projectId);
      router.push('/interview');
    } catch (error) {
      console.error('Failed to complete interview:', error);
      alert('면접 종료에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {/* 버튼 영역 */}
      <div className="px-4 pb-20 flex flex-col gap-2">
        <Button 
          variant="primary" 
          size="lg" 
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : '종료하기'}
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