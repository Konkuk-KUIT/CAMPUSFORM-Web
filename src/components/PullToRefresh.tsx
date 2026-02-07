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

  const PULL_THRESHOLD = 80; // 새로고침 트리거 거리

  const handleTouchStart = (e: TouchEvent) => {
    const scrollContainer = containerRef.current?.querySelector('.scroll-container');
    if (scrollContainer && scrollContainer.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (refreshing) return;

    const scrollContainer = containerRef.current?.querySelector('.scroll-container');
    if (!scrollContainer || scrollContainer.scrollTop > 0) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0) {
      setPulling(true);
      setPullDistance(Math.min(distance * 0.5, PULL_THRESHOLD * 1.2)); // 당기는 저항감
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= PULL_THRESHOLD && !refreshing) {
      setRefreshing(true);
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
    <div ref={containerRef} className="relative h-full">
      {/* 당김 인디케이터 */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all z-10"
        style={{
          height: `${pullDistance}px`,
          opacity: Math.min(pullDistance / PULL_THRESHOLD, 1),
        }}
      >
        <div className={`text-primary text-2xl ${refreshing ? 'animate-spin' : ''}`}>
          {refreshing ? '↻' : '↓'}
        </div>
      </div>

      {/* 실제 콘텐츠 */}
      <div
        className="transition-transform"
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}