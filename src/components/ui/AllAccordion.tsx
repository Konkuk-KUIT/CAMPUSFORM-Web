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

  return (
    <div className="w-full">
      {/* 헤더 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-9.5 px-3 py-1 border border-primary rounded-[15px] flex items-center justify-center text-15 text-primary relative ${
          isOpen || alwaysOpen ? 'bg-blue-50' : 'bg-white'
        }`}
      >
        <span>{title}</span>
        {/* TODO 아이콘 바꾸기 */}
        <Image
          src={isOpen ? '/icons/chevron-down.svg' : '/icons/chevron-down.svg'}
          alt="toggle"
          width={24}
          height={24}
          className="absolute right-6"
        />
      </button>

      {/* 콘텐츠 */}
      {(isOpen || alwaysOpen) && <div className="w-full bg-white">{children}</div>}
    </div>
  );
}
