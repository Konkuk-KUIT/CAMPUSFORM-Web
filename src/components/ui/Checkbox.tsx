'use client';

import { useState } from 'react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

export default function Checkbox({ 
  checked: controlledChecked,
  onChange,
  label
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(false);
  
  const checked = controlledChecked ?? internalChecked;
  
  const handleToggle = () => {
    const newChecked = !checked;
    if (onChange) {
      onChange(newChecked);
    } else {
      setInternalChecked(newChecked);
    }
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          className="sr-only"
        />
        <div className="w-4.5 h-4.5 rounded-[3px] border border-[#D9D9D9] bg-white flex items-center justify-center">
          {checked && (
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 4.5L5 8.5L13 1"
                stroke="#0887FD"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      {label && <span className="text-body-rg">{label}</span>}
    </label>
  );
}