'use client';

import { useState } from 'react';

type TabType = '합격자' | '불합격자';

interface ResultTabProps {
  onTabChange?: (tab: TabType) => void;
}

export default function ResultTab({ onTabChange }: ResultTabProps) {
  const [selected, setSelected] = useState<TabType>('합격자');

  const tabs: TabType[] = ['합격자', '불합격자'];

  const handleTabClick = (tabValue: TabType) => {
    setSelected(tabValue);
    onTabChange?.(tabValue);
  };

  return (
    <div className="flex">
      {tabs.map(tabItem => (
        <button key={tabItem} onClick={() => handleTabClick(tabItem)} className="flex-1 py-4 relative bg-white">
          <span className={`text-subtitle-sm-sb ${selected === tabItem ? 'text-black' : 'text-gray-400'}`}>
            {tabItem}
          </span>
          {selected === tabItem && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black block" />}
        </button>
      ))}
    </div>
  );
}
