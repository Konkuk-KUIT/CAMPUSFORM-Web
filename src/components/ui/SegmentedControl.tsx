'use client';

import { useState } from 'react';
import BtnRound from '@/components/ui/BtnRound';

type View = 'calendar' | 'project';

interface SegmentedControlProps {
  onTabChange?: (tab: View) => void;
}

export default function SegmentedControl({ onTabChange }: SegmentedControlProps) {
  const [view, setView] = useState<View>('calendar');

  const handleTabClick = (nextView: View) => {
    setView(nextView);
    onTabChange?.(nextView);
  };

  return (
    <div>
      <div className="inline-flex bg-gray-100 rounded-full">
        <BtnRound
          size="lg"
          variant={view === 'calendar' ? 'outline' : 'subtle'}
          onClick={() => handleTabClick('calendar')}
        >
          캘린더
        </BtnRound>

        <BtnRound
          size="lg"
          variant={view === 'project' ? 'outline' : 'subtle'}
          onClick={() => handleTabClick('project')}
        >
          프로젝트
        </BtnRound>
      </div>
    </div>
  );
}
