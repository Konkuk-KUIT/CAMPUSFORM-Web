'use client';

export interface TimeSelectButtonProps {
  time: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function TimeSelectButton({ time, isSelected, onClick }: TimeSelectButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-20 px-5.5 py-1.25 rounded-[5px] border text-body-sm-rg cursor-pointer
        ${isSelected ? 'bg-white border-primary text-primary' : 'bg-white border-gray-200 text-black'}
      `}
    >
      {time}
    </button>
  );
}
