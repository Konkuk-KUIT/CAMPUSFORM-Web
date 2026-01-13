// Updated filename to PascalCase

'use client';

import { useState } from 'react';

type TabType = '전체' | '보류' | '합격' | '불합격';

interface TabCounts {
  전체: number;
  보류: number;
  합격: number;
  불합격: number;
}

interface TopTabProps {
  counts: TabCounts;
}

export default function TopTab({ counts }: TopTabProps) {
  const [selected, setSelected] = useState<TabType>('전체');

  const tabs: TabType[] = ['전체', '보류', '합격', '불합격'];

  return (
    <div>
      <div className="flex">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setSelected(tab)} className="w-[85.75px] py-3 relative">
            <div className="flex items-center justify-center gap-1">
              <span
                className={`${selected === tab ? 'text-primary text-subtitle-sm-sb' : 'text-black text-subtitle-sm-md'}`}
              >
                {tab}
              </span>
              <span className="text-gray-400 text-12">({counts[tab]})</span>
            </div>
            {selected === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      <div className="p-4">
        {selected === '전체' && <div>전체</div>}
        {selected === '보류' && <div>보류</div>}
        {selected === '합격' && <div>합격</div>}
        {selected === '불합격' && <div>불합격</div>}
      </div>
    </div>
  );
}
