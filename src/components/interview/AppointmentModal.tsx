'use client';

import { useState, useRef, useEffect } from 'react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
  initialDate?: string;
  initialTime?: string;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onConfirm,
}: AppointmentModalProps) {
  const [selectedMonth, setSelectedMonth] = useState(11);
  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedHour, setSelectedHour] = useState(14);
  const [selectedMinute, setSelectedMinute] = useState(0);

  if (!isOpen) return null;

  const months = [9, 10, 11, 12, 1];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  // 무한 스크롤을 위해 배열 반복
  const infiniteMonths = [...months, ...months, ...months, ...months, ...months];
  const infiniteDays = [...days, ...days, ...days];
  const infiniteHours = [...hours, ...hours, ...hours];
  const infiniteMinutes = [...minutes, ...minutes, ...minutes];

  const handleConfirm = () => {
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][new Date(2024, selectedMonth - 1, selectedDay).getDay()];
    const formattedDate = `${selectedMonth}월 ${selectedDay}일 (${dayOfWeek})`;
    const formattedTime = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    onConfirm(formattedDate, formattedTime);
  };

  const handleScroll = (
    e: React.UIEvent<HTMLDivElement>,
    items: number[],
    setSelected: (val: number) => void
  ) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const itemHeight = 32; // py-1 기준 대략적인 높이
    const centerIndex = Math.round(scrollTop / itemHeight);
    const actualIndex = centerIndex % items.length;
    setSelected(items[actualIndex]);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50" 
      style={{ background: 'rgba(31, 31, 31, 0.40)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-10 w-[296px] h-[207px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 날짜/시간 선택 휠 */}
        <div className="flex-1 flex items-center justify-center gap-2 px-4">
          {/* 월 선택 */}
          <div 
            className="flex-1 h-24 overflow-y-auto scrollbar-hide"
            onScroll={(e) => handleScroll(e, months, setSelectedMonth)}
          >
            <div className="flex flex-col items-center">
              {infiniteMonths.map((month, idx) => (
                <button
                  key={`month-${idx}`}
                  onClick={() => setSelectedMonth(month)}
                  className={`py-1 text-center whitespace-nowrap ${
                    selectedMonth === month
                      ? 'text-primary text-[22px] font-normal leading-normal tracking-[0.4px]'
                      : 'text-gray-300 text-[22px] font-normal leading-normal tracking-[0.4px]'
                  }`}
                >
                  {month}월
                </button>
              ))}
            </div>
          </div>

          {/* 일 선택 */}
          <div 
            className="flex-1 h-24 overflow-y-auto scrollbar-hide"
            onScroll={(e) => handleScroll(e, days, setSelectedDay)}
          >
            <div className="flex flex-col items-center">
              {infiniteDays.map((day, idx) => (
                <button
                  key={`day-${idx}`}
                  onClick={() => setSelectedDay(day)}
                  className={`py-1 text-center whitespace-nowrap ${
                    selectedDay === day
                      ? 'text-primary text-[22px] font-normal leading-normal tracking-[0.4px]'
                      : 'text-gray-300 text-[22px] font-normal leading-normal tracking-[0.4px]'
                  }`}
                >
                  {day}일
                </button>
              ))}
            </div>
          </div>

          {/* 시간 선택 */}
          <div 
            className="flex-1 h-24 overflow-y-auto scrollbar-hide"
            onScroll={(e) => handleScroll(e, hours, setSelectedHour)}
          >
            <div className="flex flex-col items-center">
              {infiniteHours.map((hour, idx) => (
                <button
                  key={`hour-${idx}`}
                  onClick={() => setSelectedHour(hour)}
                  className={`py-1 text-center whitespace-nowrap ${
                    selectedHour === hour
                      ? 'text-primary text-[22px] font-normal leading-normal tracking-[0.4px]'
                      : 'text-gray-300 text-[22px] font-normal leading-normal tracking-[0.4px]'
                  }`}
                >
                  {String(hour).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          <span className="text-[22px] text-gray-950">:</span>

          {/* 분 선택 */}
          <div 
            className="flex-1 h-24 overflow-y-auto scrollbar-hide"
            onScroll={(e) => handleScroll(e, minutes, setSelectedMinute)}
          >
            <div className="flex flex-col items-center">
              {infiniteMinutes.map((minute, idx) => (
                <button
                  key={`minute-${idx}`}
                  onClick={() => setSelectedMinute(minute)}
                  className={`py-1 text-center whitespace-nowrap ${
                    selectedMinute === minute
                      ? 'text-primary text-[22px] font-normal leading-normal tracking-[0.4px]'
                      : 'text-gray-300 text-[22px] font-normal leading-normal tracking-[0.4px]'
                  }`}
                >
                  {String(minute).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-[37px] pb-[30px] pr-[30px]">
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