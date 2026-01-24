'use client';

import Link from 'next/link';

interface ConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-10 py-5.25 px-8 w-82. h-[148px]">
        {/* 메시지 */}
        <p className="text-subtitle-md text-black whitespace-pre-line m-3">
          모든 절차가 종료되며 수정할 수 없습니다.
          <br />
          <span className="text-subtitle-rg">종료를 확정하시겠습니까?</span>
        </p>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-5">
          <button onClick={onCancel} className="text-subtitle-md px-2 py-2 cursor-pointer">
            취소
          </button>
          <Link href="/interview" className="text-subtitle-md px-2 py-2">
            확인
          </Link>
        </div>
      </div>
    </div>
  );
}
