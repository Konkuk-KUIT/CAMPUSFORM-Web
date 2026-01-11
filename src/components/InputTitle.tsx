'use client';

import { useState } from 'react';

interface InputTitleProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function InputTitle({ 
  label = '이름(닉네임)',
  placeholder = '이름 또는 닉네임을 입력해주세요.',
  value: controlledValue,
  onChange
}: InputTitleProps) {
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
      <label className="block mb-2 pl-2.5 text-body">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-85.75 h-12.5 px-4 rounded-5 border border-gray-100 bg-gray-50 text-body-rg text-gray-950 placeholder:text-gray-300 outline-none"
      />
    </div>
  );
}