'use client';

import { useState } from 'react';
import Image from 'next/image';

export interface DropdownOption {
  id: string;
  label: string;
}

interface SmartScheduleDropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  width?: string;
}

export default function SmartScheduleDropdown({
  options,
  value: controlledValue,
  onChange,
  width = 'w-[109px]',
}: SmartScheduleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState('');

  const value = controlledValue ?? internalValue;
  const selectedOption = options.find(opt => opt.id === value);

  const handleSelect = (id: string) => {
    if (onChange) {
      onChange(id);
    } else {
      setInternalValue(id);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${width}`}>
      {/* 선택된 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[109px] h-[30px] bg-gray-50 border border-gray-200 rounded-[5px] px-[10px] py-[11px] flex items-center justify-between gap-[10px] font-['Pretendard'] font-normal text-[13px] leading-[18px]"
      >
        <span className="text-gray-950">{selectedOption?.label || ''}</span>
        <Image src="/icons/chevron-down.svg" alt="toggle" width={16} height={16} />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className={`absolute top-full right-0 mt-1 z-10 ${width} bg-white rounded-[10px] overflow-hidden shadow-sm border border-gray-200 max-h-[200px] overflow-y-auto`}>
          {options.map(option => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className="w-full px-3 py-2 text-[13px] text-center hover:bg-gray-50 font-['Pretendard'] font-normal leading-[18px] text-gray-950"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
