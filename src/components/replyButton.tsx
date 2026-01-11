'use client';

export interface ReplyButtonProps {
  onClick: () => void;
}

export default function ReplyButton({ onClick }: ReplyButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-10 py-1 text-body-xs-rg bg-white border border-gray-200 text-gray-400 rounded-[5px] active:bg-gray-50"
    >
      답글
    </button>
  );
}
