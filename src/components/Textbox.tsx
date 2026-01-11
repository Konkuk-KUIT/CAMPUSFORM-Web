'use client';

import { useState } from 'react';

interface TextboxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
}

export default function Textbox({ 
  placeholder = '', 
  value: controlledValue,
  onChange,
  error = false,
  errorMessage = '오류메시지'
}: TextboxProps) {
  const [isFocused, setIsFocused] = useState(false);
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

  // 상태 결정
  const getState = () => {
    if (error) return 'error';
    if (isFocused) return 'pressed';
    if (value) return 'filled';
    return 'default';
  };

  const state = getState();

  // 상태별 스타일
  const styles = {
    default: {
      background: 'bg-gray-50',
      border: 'border-gray-100',
      text: 'text-gray-300'
    },
    filled: {
      background: 'bg-gray-50',
      border: 'border-gray-100',
      text: 'text-gray-950'
    },
    pressed: {
      background: 'bg-gray-50',
      border: 'border-primary border-1.5',
      text: 'text-gray-950'
    },
    error: {
      background: 'bg-white',
      border: 'border-[#FF383C]',
      text: 'text-gray-300'
    }
  };

  return (
    <div className="w-full">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`w-85.75 h-12.5 px-4 rounded-5 border outline-none transition-colors text-body-rg placeholder:text-gray-300 ${styles[state].background} ${styles[state].border} ${styles[state].text}`}
      />
      {error && (
        <p className="w-85.75 mt-1 text-[#FF383C] text-12 text-right">{errorMessage}</p>
      )}
    </div>
  );
}