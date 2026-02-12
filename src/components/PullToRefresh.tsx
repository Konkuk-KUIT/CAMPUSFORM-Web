'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const PULL_THRESHOLD = 80;

  const handleTouchStart = (e: TouchEvent) => {
    const container = containerRef.current;
    if (container && container.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (refreshing) return;

    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0) {
      setPulling(true);
      setPullDistance(Math.min(distance * 0.5, PULL_THRESHOLD * 1.5));
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= PULL_THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullDistance(PULL_THRESHOLD);
      try {
        await onRefresh();
      } catch (error) {
        console.error('새로고침 실패:', error);
      }
      setRefreshing(false);
    }
    setPulling(false);
    setPullDistance(0);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, refreshing]);

  return (
    <div className="relative h-full flex flex-col">
      {/* 당김 인디케이터 */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all z-10 pointer-events-none"
        style={{
          height: `${pullDistance}px`,
          opacity: Math.min(pullDistance / PULL_THRESHOLD, 1),
        }}
      >
        <div className={refreshing ? 'animate-spin' : ''}>
          <Image src="/icons/loading.svg" alt="로딩" width={24} height={24} />
        </div>
      </div>

      {/* 스크롤 컨테이너 */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto transition-transform"
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}