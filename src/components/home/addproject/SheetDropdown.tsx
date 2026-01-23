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
      {/* 1. 버튼 부분 (원본 디자인 유지) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        // w-93.75 대신 w-full을 사용하여 부모 넓이에 맞춤 (스타일은 원본과 동일)
        className={`w-full h-[50px] px-6 flex items-center justify-between text-[14px] rounded-[10px] border transition-colors ${
          isOpen 
            ? 'bg-blue-50 border-primary text-gray-950' 
            : 'bg-white border-gray-100 text-gray-950'
        }`}
      >
        <span className={value ? 'text-gray-950' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <Image 
          src={isOpen ? '/icons/dropdown-up.svg' : '/icons/dropdown-down.svg'} 
          alt="dropdown" 
          width={24} 
          height={24}
        />
      </button>

      {/* 2. 옵션 목록 부분 (원본에 없어서 새로 추가한 부분) */}
      {isOpen && (
        <div className="absolute top-[56px] left-0 w-full max-h-[240px] overflow-y-auto bg-white border border-gray-100 rounded-[10px] shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100 scrollbar-hide">
          {showNoneOption && (
            <button
               onClick={() => handleSelect('선택사항 없음')}
               className="w-full h-[48px] px-6 text-left text-[14px] text-gray-950 hover:bg-gray-50 border-b border-gray-50"
            >
              선택사항 없음
            </button>
          )}

          {options.map((option, index) => (
            <button 
              key={index}
              onClick={() => handleSelect(option)}
              className="w-full h-[48px] px-6 text-left text-[14px] text-gray-950 hover:bg-gray-50"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
