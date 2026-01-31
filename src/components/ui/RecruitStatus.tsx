'use client';

import { useState } from 'react';

interface RecruitStatusProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function RecruitStatus({ 
  value: controlledValue,
  onChange
}: RecruitStatusProps) {
  const [internalValue, setInternalValue] = useState('');
  
  const value = controlledValue ?? internalValue;
  
  const handleSelect = (status: string) => {
    if (onChange) {
      onChange(status);
    } else {
      setInternalValue(status);
    }
  };

  const options = [
    { id: 'ongoing', label: '모집 중' },
    { id: 'closed', label: '모집 마감' }
  ];

  return (
    <div className="w-85.75 bg-white rounded-[10px] flex flex-col">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => handleSelect(option.id)}
          className="h-8.75 px-5.75 py-1.75 text-body-sm-rg text-left"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}