'use client';

import { useState } from 'react';
import Image from 'next/image';
import SelectModalWide from '@/components/SelectModalWide';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onFilterClick?: () => void;
  showSort?: boolean;
  sortValue?: string;
  onSortChange?: (value: string) => void;
}

export default function SearchBar({
  placeholder = '검색하세요.',
  onSearch,
  onFilterClick,
  showSort = false,
  sortValue,
  onSortChange,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { id: 'name-asc', label: '이름 오름차순' },
    { id: 'name-desc', label: '이름 내림차순' },
    { id: 'star', label: '별표 순' },
  ];

  const handleSortChange = (value: string) => {
    onSortChange?.(value);
    setIsOpen(false);
  };

  return (
    <div>
      <div className="bg-gray-50 mx-4 my-2 rounded-5 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 flex-1">
          <Image src="/icons/search.svg" alt="검색" width={13} height={13} />
          <input
            type="text"
            placeholder={placeholder}
            onChange={e => onSearch?.(e.target.value)}
            className="flex-1 outline-none text-gray-300 placeholder:text-gray-300 text-body-sm-rg"
          />
        </div>
        <button onClick={onFilterClick} className="cursor-pointer">
          <Image src="/icons/filter.svg" alt="필터" width={15} height={15} />
        </button>
      </div>

      {showSort && (
        <div className="flex justify-end px-4 py-1 relative ">
          <button onClick={() => setIsOpen(!isOpen)} className="flex items-center text-body-sm text-gray-700">
            정렬 방법
            <Image src="/icons/chevron-down.svg" alt="펼치기" width={15} height={15} />
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
              <div className="absolute top-full right-4 z-20">
                <SelectModalWide options={sortOptions} value={sortValue} onChange={handleSortChange} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
