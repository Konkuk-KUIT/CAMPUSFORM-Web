'use client';

import Image from 'next/image';

interface UnassignedApplicantsAlertProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export default function UnassignedApplicantsAlert({
  isOpen,
  onConfirm,
}: UnassignedApplicantsAlertProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(31, 31, 31, 0.40)' }}
      onClick={onConfirm}
    >
      <div 
        className="relative bg-white rounded-[10px] w-[337px] h-[312px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onConfirm}
          className="absolute right-[10px] top-[10px] w-[24px] h-[24px] flex items-center justify-center"
        >
          <Image src="/icons/close.svg" alt="close" width={24} height={24} />
        </button>

        {/* Content */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[285px] h-[205px] flex flex-col justify-center">
          <p className="text-subtitle-sm-rg text-gray-950 mb-4">
            지원자와 면접관의 가능 시간을 알고리즘
            <br />
            기반으로 최적의 면접 시간을 자동 추천합니다.
            <br />
            아래 유의사항을 확인해주세요.
          </p>

          <div className="space-y-2 text-subtitle-sm-md text-gray-950">
            <p>
              1. 입력된 가능한 시간대를 기준으로 자동배정
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;됩니다.
            </p>
            <p>
              2. 겹치는 일정이 없도록 가장 효율적인 조합을
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;우선시합니다.
            </p>
            <p>
              3. 시간 확정 후에는 수동으로 변경 가능합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
