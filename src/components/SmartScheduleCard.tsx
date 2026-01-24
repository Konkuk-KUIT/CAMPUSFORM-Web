'use client';

import Image from 'next/image';

interface SmartScheduleCardProps {
  name: string;
  email: string;
  isLeader?: boolean;
  showDivider?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function SmartScheduleCard({ name, email, isLeader = false, showDivider = false, isSelected = false, onSelect }: SmartScheduleCardProps) {
  return (
    <div 
      onClick={onSelect}
      className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer ${showDivider ? 'border-b border-gray-100' : ''}`}
    >
      <div className="flex items-center gap-2.5 flex-1">
        <div className="w-8.75 h-8.75 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <p className="text-body-md text-gray-950 font-medium">{name}</p>
            {isLeader && (
              <span className="flex items-center justify-center px-[5px] h-[15px] border border-primary rounded-[8px] text-[10px] text-primary bg-white leading-none">
                대표자
              </span>
            )}
          </div>
          <a href={`mailto:${email}`} className="text-body-xs text-gray-300 hover:text-primary">
            {email}
          </a>
        </div>
      </div>
      <div className="flex-shrink-0">
        <Image src="/icons/chevron-down.svg" alt="down" width={24} height={24} />
      </div>
    </div>
  );
}
