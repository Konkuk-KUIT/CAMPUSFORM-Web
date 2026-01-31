"use client";

interface DeleteManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  managerName: string;
}

export default function DeleteManagerModal({
  isOpen,
  onClose,
  onConfirm,
  managerName,
}: DeleteManagerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="flex flex-col w-[330px] bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="mt-12 w-full pl-6">
          <p className="text-base font-medium text-gray-900 leading-snug whitespace-pre-line">
            관리자를 삭제하시겠습니까?
          </p>
        </div>

        <div className="mt-auto flex justify-end w-full pb-3 pr-3 pt-8">
          <button 
            onClick={onClose}
            className="w-16 h-12 flex items-center justify-center text-base font-medium text-gray-900 hover:text-black transition-colors"
          >
            취소
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-16 h-12 flex items-center justify-center text-base font-medium text-gray-900 hover:text-black transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
