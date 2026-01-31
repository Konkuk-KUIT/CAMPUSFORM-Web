'use client';

import Image from 'next/image';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/40 bg-opacity-50" onClick={onClose} />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-10 px-5 py-8 w-85.75 max-h-[80vh] overflow-y-auto">
        {/* x 버튼 */}
        <button onClick={onClose} className="absolute top-4 right-4">
          <Image src="/icons/close.svg" alt="닫기" width={30} height={30} />
        </button>

        {/* 내용 */}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
