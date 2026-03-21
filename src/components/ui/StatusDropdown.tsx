'use client';

import { useState, useRef } from 'react';

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
  const [openUpward, setOpenUpward] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selected = value ?? internalValue;

  const options: StatusOption[] = [
    { value: '합격', label: '합격', color: 'bg-point-green' },
    { value: '불합격', label: '불합격', color: 'bg-point-red' },
    { value: '보류', label: '보류', color: 'bg-gray-400' },
  ];

  const selectedOption = options.find(opt => opt.value === selected) ?? options[2];

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 120;
      setOpenUpward(rect.bottom + dropdownHeight > window.innerHeight);
    }
    setIsOpen(prev => !prev);
  };

  const handleSelect = (newValue: StatusType) => {
    onChange ? onChange(newValue) : setInternalValue(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-20">
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="w-[79px] h-[26px] bg-[#F2F2F2] border border-[#F0F0F0] rounded-[30px] pt-[11px] pr-[17px] pb-[11px] pl-[16px] flex items-center justify-center gap-[10px]"
      >
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${selectedOption.color} shrink-0`} />
          <span className="text-black text-body-sm-rg whitespace-nowrap">{selectedOption.label}</span>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className={`absolute ${openUpward ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 w-21.25 bg-gray-50 rounded-10 overflow-hidden z-50 shadow-md`}
          >
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="w-full pl-5 py-2.5 flex items-center gap-2 hover:bg-gray-100"
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
