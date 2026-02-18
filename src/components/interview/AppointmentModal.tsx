'use client';

import { useState, useEffect } from 'react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string, rawDate: string) => void;
  initialDate?: string;
  initialTime?: string;
}

// ── ScrollerWheel ─────────────────────────────────────────────
interface ScrollerWheelProps {
  items: (number | string)[];
  selectedIndex: number;
  onChange: (index: number) => void;
  formatLabel: (item: number | string) => string;
  align?: 'left' | 'right' | 'center';
}

function ScrollerWheel({ items, selectedIndex, onChange, formatLabel, align = 'center' }: ScrollerWheelProps) {
  const getCircularIndex = (index: number) => {
    const len = items.length;
    return ((index % len) + len) % len;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    onChange(getCircularIndex(selectedIndex + delta));
  };

  const alignClass =
    align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';

  const ITEM_GAP = 28; // px between each item center

  const itemStyle = (offset: number): React.CSSProperties => ({
    position: 'absolute',
    top: `calc(50% + ${offset * ITEM_GAP}px - 12px)`,
  });

  // offset → opacity 매핑 (|offset|이 클수록 더 흐리게)
  const opacityMap: Record<number, string> = {
    0: 'opacity-100',
    1: 'opacity-40',
    2: 'opacity-20',
  };

  const colorClass = (offset: number) =>
    offset === 0 ? 'text-[#5A81FA] font-normal tracking-[0.4px]' : 'text-gray-300'

  return (
    <div
      className="relative w-[60px] h-[100px] overflow-hidden flex items-center justify-center select-none"
      onWheel={handleWheel}
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

// ── 유틸 ──────────────────────────────────────────────────────
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);        // 1~12
const DAYS   = Array.from({ length: 31 }, (_, i) => i + 1);        // 1~31
const HOURS  = Array.from({ length: 24 }, (_, i) => i);            // 0~23
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];   // 5분 단위

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
      // 5분 단위로 가장 가까운 값으로 snap
      minute = MINUTES.reduce((prev, cur) =>
        Math.abs(cur - min) < Math.abs(prev - min) ? cur : prev, 0
      );
    }
  }
  return { hour, minute };
}

// ── AppointmentModal ──────────────────────────────────────────
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

  // 모달이 열릴 때마다 initialDate/Time 값으로 리셋
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
        className="bg-white rounded-10 flex flex-col overflow-hidden"
        style={{ width: 296, height: 207 }}
        onClick={e => e.stopPropagation()}
      >
        {/* 휠 영역 */}
        <div className="flex items-center justify-center gap-1 px-4 mt-8">
          {/* 월 */}
          <ScrollerWheel
            items={MONTHS}
            selectedIndex={monthIdx}
            onChange={setMonthIdx}
            formatLabel={v => `${v}월`}
            align="right"
          />

          {/* 일 */}
          <ScrollerWheel
            items={DAYS}
            selectedIndex={dayIdx}
            onChange={setDayIdx}
            formatLabel={v => `${v}일`}
            align="left"
          />

          {/* 시 */}
          <ScrollerWheel
            items={HOURS}
            selectedIndex={hourIdx}
            onChange={setHourIdx}
            formatLabel={v => String(v).padStart(2, '0')}
            align="right"
          />

          <span className="text-[22px] text-[#5A81FA] -mx-2">:</span>

          {/* 분 */}
          <ScrollerWheel
            items={MINUTES}
            selectedIndex={minuteIdx}
            onChange={setMinuteIdx}
            formatLabel={v => String(v).padStart(2, '0')}
            align="left"
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-[37px] pb-[30px] pr-[30px] pt-6">
          <button
            onClick={onClose}
            className="text-black text-[16px] font-medium leading-5 tracking-[-0.5px]"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="text-black text-[16px] font-medium leading-5 tracking-[-0.5px]"
          >
            설정
          </button>
        </div>
      </div>
    </div>
  );
}