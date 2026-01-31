'use client';

import { useState } from 'react';

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Toggle({ 
  checked: controlledChecked,
  onChange
}: ToggleProps) {
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
    <button
      type="button"
      onClick={handleToggle}
      className={`relative w-10 h-5.5 rounded-full transition-colors ${
        checked ? 'bg-primary' : 'bg-gray-200'
      }`}
    >
      <span
        className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all ${
          checked ? 'left-5' : 'left-0.5'
        }`}
      />
    </button>
  );
}