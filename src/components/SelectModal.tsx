'use client';

import { useState } from 'react';

interface SelectModalOption {
  id: string;
  label: string;
}

interface SelectModalProps {
  options: SelectModalOption[];
  value?: string;
  onChange?: (value: string) => void;
  backgroundColor?: 'white' | 'gray-50' | 'gray-100';
  width?: 'w-[102px]' | 'w-[113px]';
}

export default function SelectModal({
  options,
  value: controlledValue,
  onChange,
  backgroundColor = 'white',
  width = 'w-[102px]',
}: SelectModalProps) {
  const [internalValue, setInternalValue] = useState('');

  const value = controlledValue ?? internalValue;

  const handleSelect = (id: string) => {
    if (onChange) {
      onChange(id);
    } else {
      setInternalValue(id);
    }
  };

  const bgClass = {
    'gray-100': 'bg-gray-100',
    'gray-50': 'bg-gray-50',
    white: 'bg-white',
  }[backgroundColor];

  return (
    <div className={`${width} ${bgClass} rounded-10 flex flex-col`}>
      {options.map(option => (
        <button
          key={option.id}
          onClick={() => handleSelect(option.id)}
          className="h-8.75 text-body-sm-rg text-center cursor-pointer"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
