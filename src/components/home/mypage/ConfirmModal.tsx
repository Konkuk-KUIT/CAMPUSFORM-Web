'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative flex flex-col w-[330px] h-[135px] bg-white rounded-[10px] overflow-hidden">

        {/* 텍스트 영역 h-[80px] */}
        <div className="h-[80px] flex items-center px-6">
          <p className="text-body-md text-[#333333]">로그아웃 하시겠습니까?</p>
        </div>

        {/* 버튼 영역 h-[55px] */}
        <div className="h-[55px] border-t border-gray-50 flex">
          <button
            onClick={onCancel}
            className="w-[165px] h-full flex items-center justify-center text-subtitle-sm-md text-[#1F1F1F]"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="w-[165px] h-full flex items-center justify-center text-subtitle-sm-md text-primary"
          >
            확인
          </button>
        </div>

      </div>
    </div>
  );
}