'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({ isOpen, onCancel, onConfirm }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative bg-white rounded-10 py-5.25 px-8 w-82. h-44">
        <p className="text-subtitle-rg text-black whitespace-pre-line m-3">
          면접 단계로 이동하면
          <br />
          <span className="text-subtitle-md">서류 단계는 종료되며 수정할 수 없습니다.</span>
          <br />
          계속 진행하시겠습니까?
        </p>

        <div className="flex justify-end gap-5">
          <button onClick={onCancel} className="text-subtitle-md px-2 py-2 cursor-pointer">
            취소
          </button>
          <button onClick={onConfirm} className="text-subtitle-md px-2 py-2 cursor-pointer">
            확인
          </button>
        </div>
      </div>
    </div>
  );
}