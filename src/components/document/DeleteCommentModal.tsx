'use client';

import { createPortal } from 'react-dom';

interface DeleteCommentModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteCommentModal({ isOpen, onCancel, onConfirm }: DeleteCommentModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-xl py-5 px-8 w-[330px]">
        {/* 메시지 */}
        <p className="text-base font-medium text-gray-900 mt-6 ml-2">댓글을 삭제하시겠습니까?</p>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-1 mt-8 pb-1">
          <button onClick={onCancel} className="w-16 h-12 text-base font-medium text-gray-500">
            취소
          </button>
          <button onClick={onConfirm} className="w-16 h-12 text-base font-medium text-gray-900">
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
