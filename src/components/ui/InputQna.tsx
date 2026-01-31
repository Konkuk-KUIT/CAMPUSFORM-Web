'use client';

import { useState } from 'react';

interface InputQnaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function InputQna({ 
  label = 'Q1',
  placeholder = '질문 내용을 입력하세요',
  value: controlledValue,
  onChange
}: InputQnaProps) {
  const [internalValue, setInternalValue] = useState('');
  
  const value = controlledValue ?? internalValue;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  return (
    <div className="w-full">
      <label className="block mb-2 pl-2.5 text-body-xs">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-77.5 h-14.5 px-4 py-5 rounded-10 bg-gray-50 text-body-sm-rg text-gray-950 placeholder:text-gray-400 outline-none"
      />
    </div>
  );
}