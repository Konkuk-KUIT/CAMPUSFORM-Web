'use client';

import { useState } from 'react';

interface SelectListProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function SelectList({ 
  value: controlledValue,
  onChange
}: SelectListProps) {
  const [internalValue, setInternalValue] = useState('');
  
  const value = controlledValue ?? internalValue;
  
  const handleSelect = (id: string) => {
    if (onChange) {
      onChange(id);
    } else {
      setInternalValue(id);
    }
  };

  const options = [
    { id: 'pass', label: '합격', color: 'bg-point-green' },
    { id: 'fail', label: '불합격', color: 'bg-point-red' },
    { id: 'hold', label: '보류', color: 'bg-gray-400' }
  ];

  return (
    <div className="w-21.25 h-26.25 bg-white rounded-[10px] flex flex-col">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => handleSelect(option.id)}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <div className={`w-1.75 h-1.75 rounded-full ${option.color}`} />
          <span className="text-body-sm-rg">{option.label}</span>
        </button>
      ))}
    </div>
  );
}