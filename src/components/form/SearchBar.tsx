'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import SelectModalWide from '@/components/ui/SelectModalWide';

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
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const sortOptions = [
    { id: 'name-asc', label: '이름 오름차순' },
    { id: 'name-desc', label: '이름 내림차순' },
    { id: 'star', label: '별표 순' },
  ];

  // 새로고침 시간
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - lastRefreshTime.getTime()) / 1000 / 60);
      setElapsedMinutes(diff);
    }, 60000);

    return () => clearInterval(interval);
  }, [lastRefreshTime]);

  const handleSortChange = (value: string) => {
    onSortChange?.(value);
    setIsOpen(false);
  };

  const handleRefresh = () => {
    setLastRefreshTime(new Date());
    setElapsedMinutes(0);
    // TODO: 데이터 새로고침 로직
  };

  return (
    <div>
      {/* 검색바 */}
      <div className="bg-gray-50 mx-4 my-2 rounded-5 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 flex-1">
          <Image src="/icons/search.svg" alt="검색" width={13} height={13} />
          <input
            type="text"
            placeholder={placeholder}
            onChange={e => onSearch?.(e.target.value)}
            className="flex-1 outline-none bg-transparent text-black placeholder:text-gray-300 text-body-sm-rg"
          />
        </div>
        <button onClick={onFilterClick} className="cursor-pointer">
          <Image src="/icons/filter.svg" alt="필터" width={15} height={15} />
        </button>
      </div>

      {/* 새로고침, 정렬 */}
      {showSort && (
        <div className="flex justify-between items-center px-4 py-1.5 relative">
          <button onClick={handleRefresh} className="flex items-center gap-1 text-body-sm-rg text-gray-300">
            <Image src="/icons/arrow-refresh.svg" alt="새로고침" width={17} height={17} />
            {elapsedMinutes}분 전
          </button>

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