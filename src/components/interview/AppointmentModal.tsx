'use client';

import { useState, useMemo, useEffect } from 'react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string, rawDate: string) => void;
  initialDate?: string;
  initialTime?: string;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onConfirm,
  initialDate,
  initialTime,
}: AppointmentModalProps) {
  // initialDate: "10월 2일 (수)", initialTime: "01:00"
  const parseInitial = () => {
    let month = 11, day = 15, hour = 14, minute = 0;
    if (initialDate) {
      const m = initialDate.match(/(\d+)월/);
      const d = initialDate.match(/(\d+)일/);
      if (m) month = Number(m[1]);
      if (d) day = Number(d[1]);
    }
    if (initialTime) {
      const [h, min] = initialTime.split(':').map(Number);
      if (!isNaN(h)) hour = h;
      if (!isNaN(min)) minute = min;
    }
    return { month, day, hour, minute };
  };

  const [selectedMonth, setSelectedMonth] = useState(parseInitial().month);
  const [selectedDay, setSelectedDay] = useState(parseInitial().day);
  const [selectedHour, setSelectedHour] = useState(parseInitial().hour);
  const [selectedMinute, setSelectedMinute] = useState(parseInitial().minute);

  // 모달 열릴 때마다 현재 배정값으로 리셋
  useEffect(() => {
    if (isOpen) {
      const { month, day, hour, minute } = parseInitial();
      setSelectedMonth(month);
      setSelectedDay(day);
      setSelectedHour(hour);
      setSelectedMinute(minute);
    }
  }, [isOpen, initialDate, initialTime]);

  if (!isOpen) return null;

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  // 무한 스크롤을 위해 배열 반복
  const infiniteMonths = [...months, ...months, ...months, ...months, ...months];
  const infiniteDays = [...days, ...days, ...days];
  const infiniteHours = [...hours, ...hours, ...hours];
  const infiniteMinutes = [...minutes, ...minutes, ...minutes];

  const handleConfirm = () => {
    const year = new Date().getFullYear();
    const rawDate = `${year}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][new Date(year, selectedMonth - 1, selectedDay).getDay()];
    const formattedDate = `${selectedMonth}월 ${selectedDay}일 (${dayOfWeek})`;
    const formattedTime = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    onConfirm(formattedDate, formattedTime, rawDate);
  };

  const handleScroll = (
    e: React.UIEvent<HTMLDivElement>,
    items: number[],
    setSelected: (val: number) => void
  ) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const itemHeight = 32;
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
        <div className="flex-1 flex items-center justify-center gap-7 px-4">
          {/* 월/일 그룹 */}
          <div className="flex items-center gap-3">
            {/* 월 선택 */}
            <div
              className="relative flex-1 h-24"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)',
              }}
            >
              <div
                className="w-full h-full overflow-y-auto no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onScroll={(e) => handleScroll(e, months, setSelectedMonth)}
              >
                <div className="flex flex-col items-center">
                  {infiniteMonths.map((month, idx) => (
                    <button
                      key={`month-${idx}`}
                      className={`py-0.2 text-center whitespace-nowrap ${
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
            </div>

            {/* 일 선택 */}
            <div
              className="relative flex-1 h-24"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)',
              }}
            >
              <div
                className="w-full h-full overflow-y-auto no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onScroll={(e) => handleScroll(e, days, setSelectedDay)}
              >
                <div className="flex flex-col items-center">
                  {infiniteDays.map((day, idx) => (
                    <button
                      key={`day-${idx}`}
                      className={`py-0.2 text-center whitespace-nowrap ${
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
            </div>
          </div>

          {/* 시/분 그룹 */}
          <div className="flex items-center gap-4">
            {/* 시간 선택 */}
            <div
              className="relative flex-1 h-24"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)',
              }}
            >
              <div
                className="w-full h-full overflow-y-auto no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onScroll={(e) => handleScroll(e, hours, setSelectedHour)}
              >
                <div className="flex flex-col items-center">
                  {infiniteHours.map((hour, idx) => (
                    <button
                      key={`hour-${idx}`}
                      className={`py-0.2 text-center whitespace-nowrap ${
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
            </div>

            <span className="text-[22px] text-gray-950">:</span>

            {/* 분 선택 */}
            <div
              className="relative flex-1 h-24"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)',
              }}
            >
              <div
                className="w-full h-full overflow-y-auto no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onScroll={(e) => handleScroll(e, minutes, setSelectedMinute)}
              >
                <div className="flex flex-col items-center">
                  {infiniteMinutes.map((minute, idx) => (
                    <button
                      key={`minute-${idx}`}
                      className={`py-0.2 text-center whitespace-nowrap ${
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