'use client';

interface ConfirmResetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmResetDialog({ isOpen, onClose, onConfirm }: ConfirmResetDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="flex flex-col w-[330px] bg-white rounded-[10px] shadow-[2px_2px_10px_0px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="mt-8 w-full px-6">
          <p className="text-[16px] font-medium text-black leading-[22px]">
            재설정 시 <span className="font-semibold">기존 데이터가 초기화</span>되며,
          </p>
          <p className="text-[16px] font-medium text-black leading-[22px]">
            지원자들에게 다시 응답을 받아야 합니다.
          </p>
          <p className="text-[16px] font-medium text-black leading-[22px]">
            진행하시겠습니까?
          </p>
        </div>

        <div className="mt-auto flex justify-end w-full pb-3 pr-3 pt-8">
          <button 
            onClick={onClose}
            className="w-16 h-12 flex items-center justify-center text-[16px] font-medium text-black tracking-[-0.5px] hover:text-gray-700 transition-colors"
          >
            취소
          </button>

          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-16 h-12 flex items-center justify-center text-[16px] font-medium text-black tracking-[-0.5px] hover:text-gray-900 transition-colors"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}
