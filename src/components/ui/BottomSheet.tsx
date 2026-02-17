'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export default function BottomSheet({ isOpen, onClose, children, className = '' }: BottomSheetProps) {
  const startYRef = useRef<number>(0);
  const currentYRef = useRef<number>(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (currentYRef.current > 120) {
      setTranslateY(0); // 다음 열릴 때를 위해 초기화
      onClose();
    } else {
      setTranslateY(0);
    }
    currentYRef.current = 0;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientY - startYRef.current;
    currentYRef.current = delta;
    if (delta < 0) return;
    setTranslateY(delta);
  };

  // 항상 렌더링, isOpen으로 transform 제어
  return createPortal(
    <>
      {/* 배경 */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* 바텀시트 */}
      <div
        style={{
          transform: `translateX(-50%) translateY(${isOpen ? `${translateY}px` : '100%'})`,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
        }}
        className={`fixed bottom-0 left-1/2 w-full max-w-93.75 z-50 bg-white rounded-t-[20px] p-7 max-h-[60vh] overflow-y-auto ${className}`}
      >
        {/* 핸들 바 */}
        <div
          className="flex justify-center -mt-3 mb-4 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-20 h-1 bg-gray-300 rounded-full" />
        </div>

        {children}
      </div>
    </>,
    document.body
  );
}
