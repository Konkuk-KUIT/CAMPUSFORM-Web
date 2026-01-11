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
}

export default function SelectModal({ 
  options,
  value: controlledValue,
  onChange
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

  return (
    <div className="w-25.5 bg-white rounded-[10px] flex flex-col">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => handleSelect(option.id)}
          className="h-8.75 text-body-sm-rg text-center"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}