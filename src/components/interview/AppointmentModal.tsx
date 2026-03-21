'use client';

import { useState, useEffect, useRef } from 'react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string, rawDate: string) => void;
  initialDate?: string;
  initialTime?: string;
}

interface ScrollerWheelProps {
  items: (number | string)[];
  selectedIndex: number;
  onChange: (index: number) => void;
  formatLabel: (item: number | string) => string;
  align?: 'left' | 'right' | 'center';
}

function ScrollerWheel({ items, selectedIndex, onChange, formatLabel, align = 'center' }: ScrollerWheelProps) {
  const touchStartY = useRef<number | null>(null);
  const accumulatedDelta = useRef<number>(0);

  const getCircularIndex = (index: number) => {
    const len = items.length;
    return ((index % len) + len) % len;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
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

  const alignClass =
    align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';

  const ITEM_GAP = 28;

  const itemStyle = (offset: number): React.CSSProperties => ({
    position: 'absolute',
    top: `calc(50% + ${offset * ITEM_GAP}px - 12px)`,
  });

  const opacityMap: Record<number, string> = {
    0: 'opacity-100',
    1: 'opacity-40',
    2: 'opacity-20',
  };

  const colorClass = (offset: number) =>
    offset === 0 ? 'text-[#5A81FA] font-normal tracking-[0.4px]' : 'text-gray-300';

  return (
    <div
      className="relative w-[60px] h-[100px] overflow-hidden flex items-center justify-center select-none"
      style={{ touchAction: 'none' }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {[-2, -1, 0, 1, 2].map(offset => (
        <div
          key={offset}
          className={`absolute text-[22px] h-[24px] flex items-center justify-center w-[60px] tabular-nums
            ${colorClass(offset)} ${opacityMap[Math.abs(offset)]} ${alignClass}`}
          style={itemStyle(offset)}
        >
          {formatLabel(items[getCircularIndex(selectedIndex + offset)])}
        </div>
      ))}
    </div>
  );
}

const MONTHS  = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS    = Array.from({ length: 31 }, (_, i) => i + 1);
const HOURS   = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function parseInitialDate(initialDate?: string) {
  let month = new Date().getMonth() + 1;
  let day = new Date().getDate();
  if (initialDate) {
    const m = initialDate.match(/(\d+)월/);
    const d = initialDate.match(/(\d+)일/);
    if (m) month = Number(m[1]);
    if (d) day = Number(d[1]);
  }
  return { month, day };
}

function parseInitialTime(initialTime?: string) {
  let hour = 9, minute = 0;
  if (initialTime) {
    const [h, min] = initialTime.split(':').map(Number);
    if (!isNaN(h)) hour = h;
    if (!isNaN(min)) {
      minute = MINUTES.reduce((prev, cur) =>
        Math.abs(cur - min) < Math.abs(prev - min) ? cur : prev, 0
      );
    }
  }
  return { hour, minute };
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onConfirm,
  initialDate,
  initialTime,
}: AppointmentModalProps) {
  const [monthIdx,  setMonthIdx]  = useState(0);
  const [dayIdx,    setDayIdx]    = useState(0);
  const [hourIdx,   setHourIdx]   = useState(9);
  const [minuteIdx, setMinuteIdx] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const { month, day } = parseInitialDate(initialDate);
    const { hour, minute } = parseInitialTime(initialTime);
    setMonthIdx(MONTHS.indexOf(month) !== -1 ? MONTHS.indexOf(month) : month - 1);
    setDayIdx(DAYS.indexOf(day) !== -1 ? DAYS.indexOf(day) : day - 1);
    setHourIdx(hour);
    setMinuteIdx(MINUTES.indexOf(minute) !== -1 ? MINUTES.indexOf(minute) : 0);
  }, [isOpen, initialDate, initialTime]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const year = new Date().getFullYear();
    const month = MONTHS[monthIdx];
    const day   = DAYS[dayIdx];
    const hour  = HOURS[hourIdx];
    const min   = MINUTES[minuteIdx];

    const rawDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][new Date(year, month - 1, day).getDay()];
    const formattedDate = `${month}월 ${day}일 (${dayOfWeek})`;
    const formattedTime = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

    onConfirm(formattedDate, formattedTime, rawDate);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(31, 31, 31, 0.40)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[10px] flex flex-col overflow-hidden w-[330px] h-[207px]"
        onClick={e => e.stopPropagation()}
      >
        {/* 휠 영역 */}
        <div className="flex-1 flex items-center justify-center gap-1 px-4">
          <ScrollerWheel items={MONTHS} selectedIndex={monthIdx} onChange={setMonthIdx} formatLabel={v => `${v}월`} align="right" />
          <ScrollerWheel items={DAYS} selectedIndex={dayIdx} onChange={setDayIdx} formatLabel={v => `${v}일`} align="left" />
          <ScrollerWheel items={HOURS} selectedIndex={hourIdx} onChange={setHourIdx} formatLabel={v => String(v).padStart(2, '0')} align="right" />
          <span className="text-[22px] text-[#5A81FA] -mx-2">:</span>
          <ScrollerWheel items={MINUTES} selectedIndex={minuteIdx} onChange={setMinuteIdx} formatLabel={v => String(v).padStart(2, '0')} align="left" />
        </div>

        {/* 버튼 영역 */}
        <div className="h-[55px] border-t border-gray-50 flex">
          <button
            onClick={onClose}
            className="w-[165px] h-full flex items-center justify-center text-subtitle-sm-md text-[#1F1F1F]"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="w-[165px] h-full flex items-center justify-center text-subtitle-sm-md text-primary"
          >
            설정
          </button>
        </div>
      </div>
    </div>
  );
}