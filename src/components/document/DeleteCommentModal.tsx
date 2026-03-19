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
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative flex flex-col w-[330px] h-[135px] bg-white rounded-[10px] overflow-hidden">
        
        {/* 텍스트 영역 h-[80px] */}
        <div className="h-[80px] flex items-center px-6">
          <p className="text-body-md text-[#333333]">댓글을 삭제하시겠습니까?</p>
        </div>

        {/* 버튼 영역 h-[55px] */}
        <div className="h-[55px] border-t border-gray-50 flex">
          <button
            onClick={onCancel}
            className="w-[165px] h-full flex items-center justify-center text-subtitle-sm-md text-[#1F1F1F]"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="w-[165px] h-full flex items-center justify-center text-subtitle-sm-md text-primary"
          >
            확인
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}