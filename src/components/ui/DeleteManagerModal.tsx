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
      <div className="relative flex flex-col w-[330px] h-[135px] bg-white rounded-[10px] overflow-hidden">

        {/* 텍스트 영역 h-[80px] */}
        <div className="h-[80px] flex items-center px-6">
          <p className="text-body-md text-[#333333]">관리자를 삭제하시겠습니까?</p>
        </div>

        {/* 버튼 영역 h-[55px] */}
        <div className="h-[55px] border-t border-gray-50 flex">
          <button
            onClick={onClose}
            className="w-[165px] h-full flex items-center justify-center text-subtitle-sm-md text-[#1F1F1F]"
          >
            취소
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-[165px] h-full flex items-center justify-center text-subtitle-sm-md text-primary"
          >
            확인
          </button>
        </div>

      </div>
    </div>
  );
}