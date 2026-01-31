'use client';

import { useState } from 'react';

interface InputManagerProps {
  label?: string;
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (value: string) => void;
}

export default function InputManager({ 
  label = '관리자 추가하기',
  placeholder = '구글 계정을 입력해주세요',
  buttonText = '추가',
  onSubmit
}: InputManagerProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (onSubmit && value.trim()) {
      onSubmit(value);
      setValue('');
    }
  };

  return (
    <div className="w-full">
      <label className="block mb-2 pl-2.5 text-body">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-70.25 h-12.5 px-4 rounded-5 border border-gray-100 bg-gray-50 text-body-rg text-gray-950 placeholder:text-gray-300 outline-none"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="w-13.5 h-12.5 rounded-8 bg-primary radius-8 text-body-rg text-white"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}