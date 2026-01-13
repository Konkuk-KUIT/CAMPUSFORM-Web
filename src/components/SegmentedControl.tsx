// Updated filename to PascalCase
'use client';

import { useState } from 'react';
import BtnRound from '@/components/BtnRound';

type View = 'calendar' | 'project';

export default function SegmentedControl() {
  const [view, setView] = useState<View>('calendar');

  return (
    <div>
      <div className="inline-flex bg-gray-100 rounded-full">
        <BtnRound size="lg" variant={view === 'calendar' ? 'outline' : 'subtle'} onClick={() => setView('calendar')}>
          캘린더
        </BtnRound>

        <BtnRound size="lg" variant={view === 'project' ? 'outline' : 'subtle'} onClick={() => setView('project')}>
          프로젝트
        </BtnRound>
      </div>

      <div>{view === 'calendar' ? <div>캘린더 화면</div> : <div>프로젝트 화면</div>}</div>
    </div>
  );
}
