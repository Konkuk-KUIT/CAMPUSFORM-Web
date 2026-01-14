'use client';

import { useState } from 'react';
import Image from 'next/image';

interface TextboxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

export default function Textbox({
  placeholder = '',
  value: controlledValue,
  onChange,
  error = false,
  errorMessage = '오류메시지',
  disabled = false,
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
    if (disabled) return 'disabled';
    if (error) return 'error';
    if (isFocused) return 'pressed';
    if (value) return 'filled';
    return 'default';
  };

  const state = getState();

  // 상태별 스타일
  const styles = {
    default: {
      background: 'bg-white',
      border: 'border-gray-100',
      text: 'text-gray-300',
    },
    filled: {
      background: 'bg-white',
      border: 'border-gray-100',
      text: 'text-gray-950',
    },
    pressed: {
      background: 'bg-white',
      border: 'border-primary border-1.5',
      text: 'text-gray-950',
    },
    error: {
      background: 'bg-white',
      border: 'border-point-red',
      text: 'text-gray-300',
    },
    disabled: {
      background: 'bg-gray-100',
      border: 'border-gray-100',
      text: 'text-gray-300',
    },
  };

  return (
    <div className="w-full relative">
      {/* 에러 메시지 */}
      {error && (
        <div className="absolute -top-10 -right-2.5 z-10">
          <div className="bg-point-red text-white text-12 px-3 py-1.5 rounded-5 relative whitespace-nowrap">
            {errorMessage}
            <div className="absolute -bottom-1.5 right-3 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-point-red" />
          </div>
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-85.75 h-12.5 px-4 pr-12 rounded-5 border outline-none transition-colors text-body-rg placeholder:text-gray-300 ${styles[state].background} ${styles[state].border} ${styles[state].text} ${disabled ? 'cursor-not-allowed' : ''}`}
        />
        {/* 에러 아이콘 */}
        {error && (
          <div className="absolute -right-0.5 top-1/2 -translate-y-1/2">
            <Image src="/icons/error.svg" alt="에러" width={18} height={18} />
          </div>
        )}
      </div>
    </div>
  );
}
