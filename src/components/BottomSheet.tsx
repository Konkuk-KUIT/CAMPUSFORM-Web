'use client';

import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* 배경 */}
      <div className="fixed inset-0 bg-black/40 bg-opacity-50 z-40" onClick={onClose} />

      {/* 바텀시트 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-93.75 z-50 bg-white rounded-t-[20px] p-7 animate-slide-up max-h-[80vh] overflow-y-auto">
        {/* 핸들 바 */}
        <div className="flex justify-center -mt-3 mb-4">
          <div className="w-20 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* 내용 */}
        {children}
      </div>
    </>,
    document.body
  );
}
