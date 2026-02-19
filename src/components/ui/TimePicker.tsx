'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// ── ScrollerWheel을 컴포넌트 밖으로 ──────────────────────────
interface ScrollerWheelProps {
  items: number[];
  selectedIndex: number;
  onChange: (idx: number) => void;
  isHourField: boolean;
}

function ScrollerWheel({ items, selectedIndex, onChange, isHourField }: ScrollerWheelProps) {
  const touchStartY = useRef<number | null>(null);
  const accumulatedDelta = useRef<number>(0);

  const getCircularIndex = (index: number) => {
    const len = items.length;
    return ((index % len) + len) % len;
  };

  const getItemLabel = (item: number) => String(item).padStart(2, '0');

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 1 : -1;
    onChange(getCircularIndex(selectedIndex + delta));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    accumulatedDelta.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (touchStartY.current === null) return;

    const deltaY = touchStartY.current - e.touches[0].clientY;
    accumulatedDelta.current += deltaY;
    touchStartY.current = e.touches[0].clientY;

    const THRESHOLD = 14;
    if (Math.abs(accumulatedDelta.current) >= THRESHOLD) {
      const steps = Math.round(accumulatedDelta.current / THRESHOLD);
      onChange(getCircularIndex(selectedIndex + steps));
      accumulatedDelta.current = 0;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
    accumulatedDelta.current = 0;
  };

  return (
    <div
      className="relative w-[73px] h-[151px] overflow-hidden flex items-center justify-center"
      style={{ touchAction: 'none' }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="absolute text-blue-500 text-[22px] font-medium h-[30px] flex items-center justify-center w-[50px] tabular-nums"
          style={{ top: 'calc(50% - 15px)', left: isHourField ? '0' : 'auto', right: isHourField ? 'auto' : '0' }}
        >
          {getItemLabel(items[selectedIndex])}
        </div>
        <div
          className="absolute text-gray-300 text-[22px] h-[30px] flex items-center justify-center opacity-50 w-[50px] tabular-nums"
          style={{ top: 'calc(50% - 50px)', left: isHourField ? '0' : 'auto', right: isHourField ? 'auto' : '0' }}
        >
          {getItemLabel(items[getCircularIndex(selectedIndex - 1)])}
        </div>
        <div
          className="absolute text-gray-300 text-[22px] h-[30px] flex items-center justify-center opacity-30 w-[50px] tabular-nums"
          style={{ top: 'calc(50% - 85px)', left: isHourField ? '0' : 'auto', right: isHourField ? 'auto' : '0' }}
        >
          {getItemLabel(items[getCircularIndex(selectedIndex - 2)])}
        </div>
        <div
          className="absolute text-gray-300 text-[22px] h-[30px] flex items-center justify-center opacity-50 w-[50px] tabular-nums"
          style={{ top: 'calc(50% + 20px)', left: isHourField ? '0' : 'auto', right: isHourField ? 'auto' : '0' }}
        >
          {getItemLabel(items[getCircularIndex(selectedIndex + 1)])}
        </div>
        <div
          className="absolute text-gray-300 text-[22px] h-[30px] flex items-center justify-center opacity-30 w-[50px] tabular-nums"
          style={{ top: 'calc(50% + 55px)', left: isHourField ? '0' : 'auto', right: isHourField ? 'auto' : '0' }}
        >
          {getItemLabel(items[getCircularIndex(selectedIndex + 2)])}
        </div>
      </div>
    </div>
  );
}

// ── TimePicker ────────────────────────────────────────────────
interface TimePickerProps {
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  onTimeChange: (field: 'startHour' | 'startMinute' | 'endHour' | 'endMinute', value: string) => void;
}

export default function TimePicker({ startHour, startMinute, endHour, endMinute, onTimeChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingField, setEditingField] = useState<'startHour' | 'startMinute' | 'endHour' | 'endMinute' | null>(null);
  const [tempStartHour, setTempStartHour] = useState(parseInt(startHour) || 0);
  const [tempStartMinute, setTempStartMinute] = useState(parseInt(startMinute) || 0);
  const [tempEndHour, setTempEndHour] = useState(parseInt(endHour) || 0);
  const [tempEndMinute, setTempEndMinute] = useState(parseInt(endMinute) || 0);

  useEffect(() => {
    setTempStartHour(parseInt(startHour) || 0);
    setTempStartMinute(parseInt(startMinute) || 0);
    setTempEndHour(parseInt(endHour) || 0);
    setTempEndMinute(parseInt(endMinute) || 0);
  }, [startHour, startMinute, endHour, endMinute]);

  useEffect(() => {
    let scrollY = 0;
    if (isOpen) {
      scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.width = '100vw';
      document.body.style.overflowY = 'scroll';
    } else {
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      if (top) window.scrollTo(0, -parseInt(top));
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
    };
  }, [isOpen]);

  const openModal = (field: 'startHour' | 'startMinute' | 'endHour' | 'endMinute') => {
    setEditingField(field);
    setIsOpen(true);
  };

  const handleCancel = () => {
    setTempStartHour(parseInt(startHour) || 0);
    setTempStartMinute(parseInt(startMinute) || 0);
    setTempEndHour(parseInt(endHour) || 0);
    setTempEndMinute(parseInt(endMinute) || 0);
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (editingField === 'startHour') onTimeChange('startHour', String(tempStartHour).padStart(2, '0'));
    if (editingField === 'startMinute') onTimeChange('startMinute', String(tempStartMinute).padStart(2, '0'));
    if (editingField === 'endHour') onTimeChange('endHour', String(tempEndHour).padStart(2, '0'));
    if (editingField === 'endMinute') onTimeChange('endMinute', String(tempEndMinute).padStart(2, '0'));
    setIsOpen(false);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const isStartField = editingField === 'startHour' || editingField === 'startMinute';
  const currentStartMinuteIdx = minutes.indexOf(tempStartMinute);
  const currentEndMinuteIdx = minutes.indexOf(tempEndMinute);

  return (
    <>
      <div className="px-2 py-1">
        <div className="grid grid-cols-2 items-center px-2 py-2">
          <span className="text-[14px] text-gray-500">시작 시간</span>
          <button
            onClick={() => openModal('startHour')}
            className="flex items-center justify-end gap-2 h-8 text-[14px] text-black"
          >
            <span className="min-w-[60px] text-right">{startHour} : {startMinute}</span>
            <Image src="/icons/chevron-down.svg" alt="dropdown" width={16} height={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 items-center px-2 py-2">
          <span className="text-[14px] text-gray-500">종료 시간</span>
          <button
            onClick={() => openModal('endHour')}
            className="flex items-center justify-end gap-2 h-8 text-[14px] text-black"
          >
            <span className="min-w-[60px] text-right">{endHour} : {endMinute}</span>
            <Image src="/icons/chevron-down.svg" alt="dropdown" width={16} height={16} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
          style={{ touchAction: 'none' }}
        >
          <div className="w-[241px] bg-white rounded-[10px] p-6 flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-2">
              <ScrollerWheel
                items={hours}
                selectedIndex={isStartField ? tempStartHour : tempEndHour}
                onChange={(idx) => isStartField ? setTempStartHour(idx) : setTempEndHour(idx)}
                isHourField={true}
              />
              <span className="text-[22px] font-medium text-gray-400">:</span>
              <ScrollerWheel
                items={minutes}
                selectedIndex={isStartField ? currentStartMinuteIdx : currentEndMinuteIdx}
                onChange={(idx) => {
                  const newMinute = minutes[idx];
                  isStartField ? setTempStartMinute(newMinute) : setTempEndMinute(newMinute);
                }}
                isHourField={false}
              />
            </div>
            <div className="flex gap-12 justify-end w-full">
              <button onClick={handleCancel} className="text-[16px] font-medium text-gray-800">취소</button>
              <button onClick={handleConfirm} className="text-[16px] font-medium text-gray-800">설정</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}