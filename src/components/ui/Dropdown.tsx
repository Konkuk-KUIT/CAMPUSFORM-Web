'use client';

import { useState } from 'react';
import Image from 'next/image';

interface DropdownProps {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function Dropdown({ 
  options,
  value: controlledValue,
  onChange,
  placeholder = '선택하세요'
}: DropdownProps) {
  const [internalValue, setInternalValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const value = controlledValue ?? internalValue;
  
  const handleSelect = (option: string) => {
    if (onChange) {
      onChange(option);
    } else {
      setInternalValue(option);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-93.75 h-12.5 px-6.5 flex items-center justify-between text-body transition-colors ${
          isOpen ? 'bg-blue-50' : 'bg-white'
        }`}
      >
        <span>{value || placeholder}</span>
        <Image 
          src={isOpen ? '/icons/dropdown-up.svg' : '/icons/dropdown-down.svg'} 
          alt="dropdown" 
          width={31} 
          height={31}
        />
      </button>
    </div>
  );
}