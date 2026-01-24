'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

interface ResultSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResultSelectionModal({ isOpen, onClose }: ResultSelectionModalProps) {
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
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* 선택 카드 */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex gap-5">
        <Link
          href="/document/result"
          className="w-24.5 h-18.75 bg-blue-50 rounded-10 flex items-center justify-center border border-blue-300 shadow-lg"
        >
          <span className="Body/14/Regular text-black">서류 결과</span>
        </Link>

        <Link
          href="/interview/result"
          className="w-24.5 h-18.75 bg-blue-50 rounded-10 flex items-center justify-center border border-blue-300 shadow-lg"
        >
          <span className="Body/14/Regular text-black">면접 결과</span>
        </Link>
      </div>
    </>,
    document.body
  );
}
