// Updated filename to PascalCase

'use client';

import { useState } from 'react';
import Image from 'next/image';

type StatusType = '보류' | '합격' | '불합격';

interface StatusOption {
  value: StatusType;
  label: string;
  color: string;
}

export default function StatusDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<StatusType>('보류');

  const options: StatusOption[] = [
    { value: '합격', label: '합격', color: 'bg-point-green' },
    { value: '불합격', label: '불합격', color: 'bg-point-red' },
    { value: '보류', label: '보류', color: 'bg-gray-400' },
  ];

  const selectedOption = options.find(opt => opt.value === selected)!;

  const handleSelect = (value: StatusType) => {
    setSelected(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-20">
      {/* 선택된 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-6.5 bg-white border border-gray-200 rounded-5 px-2 py-1 flex items-center justify-between"
      >
        <div className="flex items-center gap-1.5">
          <div className={`w-1.75 h-1.75 rounded-full ${selectedOption.color} shrink-0`} />
          <span className="text-black text-body-sm-rg whitespace-nowrap">{selectedOption.label}</span>
        </div>
        {/* TODO 아이콘 chevron-up 바꾸기 */}
        <Image
          src={isOpen ? '/icons/chevron-down.svg' : '/icons/chevron-down.svg'}
          alt="toggle"
          width={15}
          height={15}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute top-full w-21.25 bg-white rounded-10 overflow-hidden z-10">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="w-full px-3 py-2.5 flex items-center gap-2"
            >
              <div className={`w-1.75 h-1.75 rounded-full ${option.color} shrink-0`} />
              <span className="text-body-sm-rg whitespace-nowrap">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
