'use client';

import { useState } from 'react';

interface SelectModalWideOption {
  id: string;
  label: string;
}

interface SelectModalWideProps {
  options: SelectModalWideOption[];
  value?: string;
  onChange?: (value: string) => void;
}

export default function SelectModalWide({ options, value: controlledValue, onChange }: SelectModalWideProps) {
  const [internalValue, setInternalValue] = useState('');

  const value = controlledValue ?? internalValue;

  const handleSelect = (id: string) => {
    if (onChange) {
      onChange(id);
    } else {
      setInternalValue(id);
    }
  };

  return (
    <div className="w-28.25 bg-gray-50 rounded-10 flex flex-col">
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
