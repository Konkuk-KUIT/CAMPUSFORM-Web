'use client';

import Image from 'next/image';

interface SmartScheduleButtonProps {
  children: React.ReactNode;
  icon?: string;
  iconWidth?: number;
  iconHeight?: number;
  showHash?: boolean;
  onClick?: () => void;
}

export default function SmartScheduleButton({ 
  children, 
  icon, 
  iconWidth = 16, 
  iconHeight = 16,
  showHash = false,
  onClick 
}: SmartScheduleButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="flex-1 border border-[#bfcefe] rounded-[10px] px-4 py-3 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
    >
      <span className="font-['Pretendard'] font-normal text-[13px] leading-[18px] text-[#1f1f1f] text-center tracking-[0.13px] whitespace-nowrap">
        {children}
      </span>
      {icon && <Image src={icon} alt="icon" width={iconWidth} height={iconHeight} />}
      {showHash && <span className="text-[13px] text-[#1f1f1f]">#</span>}
    </button>
  );
}
