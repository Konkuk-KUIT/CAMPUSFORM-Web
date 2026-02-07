'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface SheetDropdownProps {
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showNoneOption?: boolean;
}

export default function SheetDropdown({ 
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  showNoneOption = true,
}: SheetDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* 드롭다운 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-[50px] px-[15px] flex items-center justify-between text-[14px] font-normal leading-[20px] rounded-[5px] border border-solid transition-colors ${
          isOpen 
            ? 'bg-[var(--color-blue-50)] border-[var(--color-primary)] text-black' 
            : 'bg-white border-[var(--color-gray-200)] text-black'
        }`}
      >
        <span className={value ? 'text-black' : 'text-[#b0b0b0]'}>
          {value || placeholder}
        </span>
        <Image 
          src={isOpen ? '/icons/dropdown-up.svg' : '/icons/dropdown-down.svg'} 
          alt="dropdown" 
          width={24} 
          height={24}
        />
      </button>

      {/* 옵션 목록 */}
      {isOpen && (
        <div className="absolute top-[51px] left-0 w-full max-h-[385px] overflow-y-auto bg-[#f6f6f6] rounded-bl-[10px] rounded-br-[10px] shadow-[2px_5px_10px_0px_rgba(0,0,0,0.1)] z-50 scrollbar-hide">
          {showNoneOption && (
            <button
               onClick={() => handleSelect('선택사항 없음')}
               className="w-full h-[35px] pl-[23px] pr-[20px] py-[7px] text-left text-[13px] font-normal leading-[18px] text-black bg-[#f6f6f6] hover:bg-[#ececec] transition-colors"
            >
              선택사항 없음
            </button>
          )}

          {options.map((option, index) => (
            <button 
              key={index}
              onClick={() => handleSelect(option)}
              className="w-full h-[35px] pl-[23px] pr-[20px] py-[7px] text-left text-[13px] font-normal leading-[18px] text-black bg-[#f6f6f6] hover:bg-[#ececec] transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
