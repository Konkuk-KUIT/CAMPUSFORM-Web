'use client';

export interface ReplyButtonProps {
  onClick: () => void;
  className?: string;
}

export default function ReplyButton({ onClick, className = '' }: ReplyButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-10 py-1 text-body-xs-rg bg-white border border-gray-200 text-gray-400 rounded-5 active:bg-gray-50 ${className}`}
    >
      답글
    </button>
  );
}
