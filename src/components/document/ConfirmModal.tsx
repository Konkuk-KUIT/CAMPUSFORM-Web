'use client';

import { ReactNode } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  description?: ReactNode;
  className?: string;
}

export default function ConfirmModal({ isOpen, onCancel, onConfirm, description, className }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className={`relative flex flex-col w-[330px] h-[175px] bg-white rounded-[10px] overflow-hidden ${className ?? ''}`}>

        {/* 텍스트 영역 h-[120px] */}
        <div className="h-[120px] flex items-center px-6">
          <p className="text-body-md text-[#333333] whitespace-pre-line">
            {description ?? (
              <>
                면접 단계로 이동하면
                <br />
                <span className="font-medium">서류 단계는 종료되며 수정할 수 없습니다.</span>
                <br />
                계속 진행하시겠습니까?
              </>
            )}
          </p>
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
    </div>
  );
}