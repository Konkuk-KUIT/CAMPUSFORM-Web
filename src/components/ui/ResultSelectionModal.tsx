'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useCurrentProjectStore } from '@/store/currentProjectStore';

interface ResultSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResultSelectionModal({ isOpen, onClose }: ResultSelectionModalProps) {
  const projectId = useCurrentProjectStore(s => s.projectId);

  const documentResultHref = projectId ? `/document/${projectId}/result` : '/document';
  const interviewResultHref = projectId ? `/interview/${projectId}/result` : '/interview';

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
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex gap-5">
        <Link
          href={documentResultHref}
          onClick={onClose}
          className="flex items-center justify-center rounded-[15px] opacity-100 bg-[#BFCEFE] shadow-[2px_2px_10px_0px_#0000001A] py-[10px] px-[18px] gap-[10px]"
          style={{ width: '156px', height: '80px' }}
        >
          <span className="font-[Pretendard] font-medium text-[15px] leading-[20px] tracking-[0px] text-center align-middle [font-variant-numeric:lining-nums_proportional-nums] text-black">서류 결과</span>
        </Link>

        <Link
          href={interviewResultHref}
          onClick={onClose}
          className="flex items-center justify-center rounded-[15px] opacity-100 bg-[#BFCEFE] shadow-[2px_2px_10px_0px_#0000001A] py-[10px] px-[18px] gap-[10px]"
          style={{ width: '156px', height: '80px' }}
        >
          <span className="font-[Pretendard] font-medium text-[15px] leading-[20px] tracking-[0px] text-center align-middle [font-variant-numeric:lining-nums_proportional-nums] text-black">면접 결과</span>
        </Link>
      </div>
    </>,
    document.body
  );
}
