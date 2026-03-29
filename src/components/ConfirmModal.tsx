'use client';

import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  description: ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function Modal({
  isOpen,
  description,
  onConfirm,
  onCancel,
  confirmText = '확인',
  cancelText = '취소',
}: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="absolute inset-0" onClick={onCancel} />

      <div className="relative flex flex-col w-[330px] bg-white rounded-[10px] overflow-hidden">

        {/* 텍스트 영역 */}
        <div className="min-h-[80px] flex items-center pt-[30px] pl-[40px] pr-6 pb-6">
          <p className="text-body-md text-[#333333] whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="h-[55px] border-t border-gray-50 flex">
          {onCancel ? (
            <>
              <button
                onClick={onCancel}
                className="w-[165px] h-full flex items-center justify-center text-subtitle-sm-md text-[#1F1F1F]"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="w-[165px] h-full flex items-center justify-center text-subtitle-sm-md text-primary"
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              onClick={onConfirm}
              className="w-full h-full flex items-center justify-center text-subtitle-sm-md text-primary"
            >
              {confirmText}
            </button>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
}