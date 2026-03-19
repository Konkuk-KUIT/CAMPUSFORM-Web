'use client';

interface InfoModalProps {
  description: string;
  onConfirm: () => void;
}

export default function InfoModal({ description, onConfirm }: InfoModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="flex flex-col w-[330px] h-[155px] bg-white rounded-[10px] shadow-lg overflow-hidden">
        
        {/* 텍스트 영역 h-[102px] */}
        <div className="h-[102px] flex items-center px-6">
          <p className="text-body-md text-[#333333] whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* 버튼 영역 h-[55px] */}
        <div className="h-[55px] border-t border-gray-50 flex items-center justify-center">
          <button
            onClick={onConfirm}
            className="w-full h-full flex items-center justify-center text-subtitle-sm-md text-primary"
          >
            확인
          </button>
        </div>

      </div>
    </div>
  );
}