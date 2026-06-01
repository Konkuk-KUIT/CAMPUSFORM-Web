// Updated filename to PascalCase

'use client';

import { useState } from 'react';
import Image from 'next/image';

export interface AllAccordionProps {
  title: string;
  children: React.ReactNode;
  alwaysOpen?: boolean;
}

export default function AllAccordion({ title, children, alwaysOpen = false }: AllAccordionProps) {
  const [isOpen, setIsOpen] = useState(alwaysOpen);

  const isAccordionOpen = alwaysOpen || isOpen;

  const handleToggle = () => {
    if (alwaysOpen) return;
    setIsOpen(prev => !prev);
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full h-9.5 px-3 py-1 border border-primary rounded-[15px] flex items-center justify-center text-15 text-primary relative ${
          isAccordionOpen ? 'bg-blue-50' : 'bg-white'
        }`}
      >
        <span>{title}</span>

        <Image
          src="/icons/chevron-down.svg"
          alt="toggle"
          width={24}
          height={24}
          className={`absolute right-6 transition-transform ${
            isAccordionOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isAccordionOpen && <div className="w-full bg-white">{children}</div>}
    </div>
  );
}