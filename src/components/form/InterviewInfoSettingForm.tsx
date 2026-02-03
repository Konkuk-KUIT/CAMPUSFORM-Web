'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Navbar from '@/components/Navbar';
import Btn from '@/components/ui/Btn';
import SmartScheduleDropdown from '@/components/ui/SmartScheduleDropdown';
import TimePicker from '@/components/ui/TimePicker';

type TimeOption = { label: string; value: string };

export default function InterviewInfoSettingForm() {
  const router = useRouter();
  // Date state
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Time state
  const hourOptions = useMemo<TimeOption[]>(() => {
    return Array.from({ length: 24 }, (_, h) => ({
      label: `${h.toString().padStart(2, '0')} :`,
      value: h.toString().padStart(2, '0'),
    }));
  }, []);
  const minuteOptions = useMemo<TimeOption[]>(() => {
    return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => ({
      label: m.toString().padStart(2, '0'),
      value: m.toString().padStart(2, '0'),
    }));
  }, []);

  const [startHour, setStartHour] = useState<string>('09');
  const [startMinute, setStartMinute] = useState<string>('00');
  const [endHour, setEndHour] = useState<string>('17');
  const [endMinute, setEndMinute] = useState<string>('00');

  // Counters
  const [maxApplicantsPerSlot, setMaxApplicantsPerSlot] = useState<number>(1);
  const [minInterviewersPerSlot, setMinInterviewersPerSlot] = useState<number>(1);
  const [maxInterviewersPerSlot, setMaxInterviewersPerSlot] = useState<number>(1);

  // Duration selections
  const durationOptions = [
    { id: '5', label: '5분' },
    { id: '10', label: '10분' },
    { id: '15', label: '15분' },
    { id: '20', label: '20분' },
    { id: '25', label: '25분' },
    { id: '30', label: '30분' },
    { id: '35', label: '35분' },
    { id: '40', label: '40분' },
    { id: '45', label: '45분' },
    { id: '50', label: '50분' },
    { id: '55', label: '55분' },
    { id: '60', label: '60분' },
  ];
  const restOptions = [
    { id: '5', label: '5분' },
    { id: '10', label: '10분' },
    { id: '15', label: '15분' },
    { id: '20', label: '20분' },
    { id: '25', label: '25분' },
    { id: '30', label: '30분' },
    { id: '35', label: '35분' },
    { id: '40', label: '40분' },
    { id: '45', label: '45분' },
    { id: '50', label: '50분' },
    { id: '55', label: '55분' },
    { id: '60', label: '60분' },
  ];
  const [estimatedDuration, setEstimatedDuration] = useState<string>('');
  const [restDuration, setRestDuration] = useState<string>('');

  // Calendar helpers
  const firstDayOfMonth = useMemo(() => new Date(year, month, 1), [year, month]);
  const startWeekday = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const calendarCells = useMemo(() => {
    const cells: { d: number; current: boolean }[] = [];
    // leading days from prev month
    for (let i = 0; i < startWeekday; i++) {
      cells.push({ d: prevMonthDays - startWeekday + 1 + i, current: false });
    }
    // current month days
    for (let d = 1; d <= daysInMonth; d++) cells.push({ d, current: true });
    // trailing to fill 6 rows * 7 cols = 42
    const trailing = 42 - cells.length;
    for (let i = 1; i <= trailing; i++) cells.push({ d: i, current: false });
    return cells;
  }, [startWeekday, prevMonthDays, daysInMonth]);

  const handlePrevMonth = () => {
    setMonth(m => {
      if (m === 0) {
        setYear(y => y - 1);
        return 11;
      }
      return m - 1;
    });
  };
  const handleNextMonth = () => {
    setMonth(m => {
      if (m === 11) {
        setYear(y => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  const isTimeValid = () => {
    const startTotalMin = parseInt(startHour) * 60 + parseInt(startMinute);
    const endTotalMin = parseInt(endHour) * 60 + parseInt(endMinute);
    return startTotalMin < endTotalMin;
  };

  const handleSubmit = () => {
    if (!selectedDate) {
      alert('면접 날짜를 선택해주세요');
      return;
    }
    if (!isTimeValid()) {
      alert('종료 시간이 시작 시간보다 늦어야 합니다');
      return;
    }
    if (!estimatedDuration) {
      alert('예상 소요 시간을 선택해주세요');
      return;
    }

    const payload = {
      date: selectedDate.toISOString().slice(0, 10),
      start: `${startHour}:${startMinute}`,
      end: `${endHour}:${endMinute}`,
      maxApplicantsPerSlot,
      minInterviewersPerSlot,
      maxInterviewersPerSlot,
      estimatedDuration: `${estimatedDuration}분`,
      restDuration: restDuration ? `${restDuration}분` : '없음',
    };
    console.log('면접 정보 설정', payload);

    // 설정 완료 상태 저장
    localStorage.setItem('interviewInfoConfigured', 'true');

    alert('면접 정보가 설정되었습니다');
    // TODO: API call to save data
    router.push('/smart-schedule');
  };

  return (
    <main className="min-h-screen flex justify-center bg-white font-['Pretendard']">
      <div className="relative w-[375px] bg-white min-h-screen shadow-lg flex flex-col overflow-x-hidden">
        {/* Top bar */}
        <Header title="면접 정보 설정" backTo="/smart-schedule" />

        {/* Scrollable content */}
        <div className="flex-1 px-4 pb-24 overflow-y-auto">
          {/* 면접 날짜 */}
          <div className="mt-2">
            <div className="flex items-center gap-2 py-1">
              <Image src="/icons/calendar-black.svg" alt="calendar" width={15.75} height={15.75} />
              <span className="text-[15px] font-medium text-gray-950">면접 날짜</span>
            </div>

            <div className="flex items-center justify-center px-6 py-2">
              <div className="w-[303px] rounded-radius-10 bg-white px-2.5 py-2">
                {/* Month label */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <button
                    aria-label="prev"
                    className="w-[33px] h-[33px] flex items-center justify-center rotate-180"
                    onClick={handlePrevMonth}
                  >
                    <Image src="/icons/chevron-right.svg" alt="prev" width={24} height={7} />
                  </button>
                  <span className="text-[14px] font-medium text-gray-950 w-[184px] text-center">
                    {year}년 {month + 1}월
                  </span>
                  <button
                    aria-label="next"
                    className="w-[33px] h-[33px] flex items-center justify-center"
                    onClick={handleNextMonth}
                  >
                    <Image src="/icons/chevron-right.svg" alt="next" width={24} height={7} />
                  </button>
                </div>

                {/* Week labels */}
                <div className="grid grid-cols-7 h-[18px] mb-1">
                  {['일', '월', '화', '수', '목', '금', '토'].map(w => (
                    <div key={w} className="flex items-center justify-center text-[12px] text-gray-400">
                      {w}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-y-[2px]">
                  {calendarCells.map((cell, idx) => {
                    const isSelected =
                      selectedDate &&
                      cell.current &&
                      selectedDate.getDate() === cell.d &&
                      selectedDate.getMonth() === month &&
                      selectedDate.getFullYear() === year;
                    return (
                      <button
                        key={idx}
                        className="h-[30px] flex items-center justify-center"
                        onClick={() => cell.current && setSelectedDate(new Date(year, month, cell.d))}
                      >
                        <div className="relative w-6 h-6 flex items-center justify-center">
                          <span
                            className={`text-[14px] z-10 ${
                              isSelected ? 'text-white font-semibold' : cell.current ? 'text-gray-950' : 'text-gray-300'
                            }`}
                          >
                            {cell.d}
                          </span>
                          {isSelected && <div className="absolute inset-0 rounded-full bg-blue-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 면접 시간대 */}
          <div className="mt-4">
            <div className="flex items-center gap-2 py-1">
              <Image src="/icons/clock.svg" alt="clock" width={15.75} height={15.75} />
              <span className="text-[15px] font-medium text-gray-950">면접 시간대</span>
            </div>

            <TimePicker
              startHour={startHour}
              startMinute={startMinute}
              endHour={endHour}
              endMinute={endMinute}
              onTimeChange={(field, value) => {
                if (field === 'startHour') setStartHour(value);
                if (field === 'startMinute') setStartMinute(value);
                if (field === 'endHour') setEndHour(value);
                if (field === 'endMinute') setEndMinute(value);
              }}
            />
          </div>

          {/* 타임 당 지원자 수 */}
          <div className="mt-3 px-2">
            <div className="flex flex-col gap-2">
              <span className="text-[15px] font-medium text-gray-950">타임 당 지원자 수</span>
              <div className="flex items-center justify-end gap-2">
                <span className="text-[12px] text-gray-950">최대</span>
                <button
                  aria-label="decrease"
                  className="w-[29px] h-[29px] bg-blue-100 rounded-full flex items-center justify-center text-[18px]"
                  onClick={() => setMaxApplicantsPerSlot(v => Math.max(1, v - 1))}
                >
                  −
                </button>
                <span className="text-[16px] text-gray-600 w-[32px] text-center">{maxApplicantsPerSlot}</span>
                <button
                  aria-label="increase"
                  className="w-[29px] h-[29px] bg-blue-100 rounded-full flex items-center justify-center text-[18px]"
                  onClick={() => setMaxApplicantsPerSlot(v => v + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 타임 당 면접관 수 */}
          <div className="mt-3 px-2">
            <div className="flex flex-col gap-2">
              <span className="text-[15px] font-medium text-gray-950">타임 당 면접관 수</span>
              {/* 최소 */}
              <div className="flex items-center justify-end gap-2">
                <span className="text-[12px] text-gray-950">최소</span>
                <button
                  aria-label="min-dec"
                  className="w-[29px] h-[29px] bg-blue-100 rounded-full flex items-center justify-center text-[18px]"
                  onClick={() => setMinInterviewersPerSlot(v => Math.max(1, v - 1))}
                >
                  −
                </button>
                <span className="text-[16px] text-gray-600 w-[32px] text-center">{minInterviewersPerSlot}</span>
                <button
                  aria-label="min-inc"
                  className="w-[29px] h-[29px] bg-blue-100 rounded-full flex items-center justify-center text-[18px]"
                  onClick={() => setMinInterviewersPerSlot(v => v + 1)}
                >
                  +
                </button>
              </div>
              {/* 최대 */}
              <div className="flex items-center justify-end gap-2">
                <span className="text-[12px] text-gray-950">최대</span>
                <button
                  aria-label="max-dec"
                  className="w-[29px] h-[29px] bg-blue-100 rounded-full flex items-center justify-center text-[18px]"
                  onClick={() => setMaxInterviewersPerSlot(v => Math.max(1, v - 1))}
                >
                  −
                </button>
                <span className="text-[16px] text-gray-600 w-[32px] text-center">{maxInterviewersPerSlot}</span>
                <button
                  aria-label="max-inc"
                  className="w-[29px] h-[29px] bg-blue-100 rounded-full flex items-center justify-center text-[18px]"
                  onClick={() => setMaxInterviewersPerSlot(v => v + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 예상 소요 시간 / 휴식 시간 */}
          <div className="mt-3 px-2">
            <div className="grid grid-cols-2 gap-y-3 py-2">
              <div>
                <span className="text-[15px] font-medium text-gray-950">
                  예상 소요 시간 <span className="text-[12px] text-gray-600">(분/타임 당)</span>
                </span>
              </div>
              <div className="flex items-center justify-end">
                <SmartScheduleDropdown
                  options={durationOptions}
                  value={estimatedDuration}
                  onChange={setEstimatedDuration}
                  width="w-[109px]"
                />
              </div>

              <div>
                <span className="text-[15px] font-medium text-gray-950">휴식 시간</span>
              </div>
              <div className="flex items-center justify-end">
                <SmartScheduleDropdown
                  options={restOptions}
                  value={restDuration}
                  onChange={setRestDuration}
                  width="w-[109px]"
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="fixed bottom-20 left-0 right-0 px-5 max-w-93.75 mx-auto">
            <Btn variant="primary" size="lg" className="w-full" onClick={handleSubmit}>
              설정하기
            </Btn>
          </div>
          
          {/* Spacer for fixed button */}
          <div className="h-32" />
        </div>

        {/* Bottom nav */}
        <Navbar />
      </div>
    </main>
  );
}
