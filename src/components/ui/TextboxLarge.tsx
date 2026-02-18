'use client';

import { useState, useRef, useEffect } from 'react';

interface TextboxLargeProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  color?: boolean;
}

export default function TextboxLarge({
  placeholder = '',
  value: controlledValue,
  onChange,
  color = false,
}: TextboxLargeProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isComposing = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 외부에서 value가 바뀌면 DOM에 직접 반영
  useEffect(() => {
    if (textareaRef.current && controlledValue !== undefined) {
      if (textareaRef.current.value !== controlledValue) {
        textareaRef.current.value = controlledValue;
      }
    }
  }, [controlledValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isComposing.current) return;
    onChange?.(e.target.value);
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLTextAreaElement>) => {
    isComposing.current = false;
    onChange?.((e.target as HTMLTextAreaElement).value);
  };

  const value = controlledValue ?? '';

  const getState = () => {
    if (color) return 'color';
    if (isFocused) return 'pressed';
    if (value) return 'filled';
    return 'default';
  };

  const state = getState();

  const styles = {
    default: {
      background: 'bg-gray-100',
      border: 'border-gray-200 border-0.5',
      text: 'text-gray-400',
      shadow: 'shadow-[2px_2px_20px_0px_rgba(0,0,0,0.03)]',
    },
    filled: {
      background: 'bg-white',
      border: 'border-gray-100 border',
      text: 'text-gray-950',
      shadow: 'shadow-[2px_2px_20px_0px_rgba(0,0,0,0.03)]',
    },
    pressed: {
      background: 'bg-white',
      border: 'border-primary border-1.5',
      text: 'text-gray-950',
      shadow: 'shadow-[2px_2px_20px_0px_rgba(0,0,0,0.03)]',
    },
    color: {
      background: 'bg-gray-50',
      border: 'border-gray-100 border',
      text: 'text-gray-400',
      shadow: 'shadow-[2px_2px_20px_0px_rgba(0,0,0,0.03)]',
    },
  };

  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          ref={textareaRef}
          defaultValue={value}
          onChange={handleChange}
          onCompositionStart={() => {
            isComposing.current = true;
          }}
          onCompositionEnd={handleCompositionEnd}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-85.75 h-41.25 p-4 rounded-10 outline-none resize-none transition-colors text-body-sm-rg placeholder:text-gray-400 ${styles[state].background} ${styles[state].border} ${styles[state].text} ${styles[state].shadow}`}
        />
        {(state === 'filled' || state === 'pressed') && (
          <span className="absolute bottom-4 right-4 text-10 text-gray-200">자동저장됨</span>
        )}
      </div>
    </div>
  );
}
