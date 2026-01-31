'use client';

import { useState } from 'react';

interface InputCommentProps {
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (value: string) => void;
}

export default function InputComment({
  placeholder = '댓글을 남겨주세요.',
  buttonText = '등록',
  onSubmit,
}: InputCommentProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (onSubmit && value.trim()) {
      onSubmit(value);
      setValue('');
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-1.5">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-72.25 h-10.75 px-4 rounded-5 border border-gray-200 bg-white text-body-sm-rg text-black placeholder:text-gray-200 outline-none"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="w-12 h-10.75 rounded-5 bg-primary text-body-xs-rg text-white"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
