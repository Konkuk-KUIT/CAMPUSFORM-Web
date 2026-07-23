'use client';

import { useEffect, useState } from 'react';

/** 오늘로부터 n일 뒤 평일 3일의 날짜를 YYYY-MM-DD로 반환 */
const buildDummyDates = (): string[] => {
  const dates: string[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 7);

  while (dates.length < 3) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      dates.push(d.toISOString().slice(0, 10));
    }
    d.setDate(d.getDate() + 1);
  }

  return dates;
};

export const TUTORIAL_DATES = buildDummyDates();

/**
 * localStorage의 smartScheduleTutorialCompleted 여부로 튜토리얼 모드 판단.
 * null = 아직 확인 중, true/false = 확정
 */
export function useTutorialMode(): boolean | null {
  const [isTutorial, setIsTutorial] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const completed = window.localStorage.getItem('smartScheduleTutorialCompleted');
    setIsTutorial(!completed);

    const handleCompleted = () => setIsTutorial(false);
    window.addEventListener('tutorialCompleted', handleCompleted);
    return () => window.removeEventListener('tutorialCompleted', handleCompleted);
  }, []);

  return isTutorial;
}
