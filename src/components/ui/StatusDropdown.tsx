'use client';

import { useState } from 'react';
import Image from 'next/image';

type StatusType = '보류' | '합격' | '불합격';

interface StatusOption {
  value: StatusType;
  label: string;
  color: string;
}

interface StatusDropdownProps {
  value?: StatusType;
  onChange?: (value: StatusType) => void;
}

export default function StatusDropdown({ value, onChange }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<StatusType>('보류');

  const selected = value ?? internalValue;

  const options: StatusOption[] = [
    { value: '합격', label: '합격', color: 'bg-point-green' },
    { value: '불합격', label: '불합격', color: 'bg-point-red' },
    { value: '보류', label: '보류', color: 'bg-gray-400' },
  ];

  const selectedOption = options.find(opt => opt.value === selected)!;

  const handleSelect = (newValue: StatusType) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-6.5 bg-gray-50 border border-gray-200 rounded-5 px-2 py-1 flex items-center relative"
      >
        <div className="flex items-center gap-1 absolute left-[45%] -translate-x-1/2">
          <div className={`w-1.5 h-1.5 rounded-full ${selectedOption.color} shrink-0`} />
          <span className="text-black text-body-sm-rg whitespace-nowrap">{selectedOption.label}</span>
        </div>
        <Image src="/icons/chevron-down.svg" alt="toggle" width={15} height={15} className="ml-auto" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full w-21.25 bg-gray-50 rounded-10 overflow-hidden z-20">
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="w-full px-3 py-2.5 flex items-center gap-2 hover:bg-gray-100"
              >
                <div className={`w-1.75 h-1.75 rounded-full ${option.color} shrink-0`} />
                <span className="text-body-sm-rg whitespace-nowrap">{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}