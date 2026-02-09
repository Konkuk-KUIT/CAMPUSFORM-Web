'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative bg-white rounded-10 p-8 pt-12 w-full max-w-[330px]">
        <p className="text-subtitle-md mb-5">로그아웃 하시겠습니까?</p>

        <div className="flex gap-5 justify-end">
          <button onClick={onCancel} className="px-1 py-1 rounded-8 text-subtitle-md text-black cursor-pointer">
            취소
          </button>
          <button onClick={onConfirm} className="px-1 py-1 rounded-8 text-subtitle-md text-black cursor-pointer">
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
