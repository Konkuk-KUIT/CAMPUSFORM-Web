'use client';

import { useState } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import clsx from 'clsx';

registerLocale('ko', ko);

interface MultiSelectCalendarProps {
  selectedDates: Date[];
  onDateChange: (dates: Date[]) => void;
  className?: string;
}

export default function MultiSelectCalendar({
  selectedDates,
  onDateChange,
  className,
}: MultiSelectCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // 날짜 클릭 시 토글
  const handleDateClick = (date: Date) => {
    const dateStr = date.toDateString();
    const isAlreadySelected = selectedDates.some(d => d.toDateString() === dateStr);
    
    if (isAlreadySelected) {
      // 선택 해제
      onDateChange(selectedDates.filter(d => d.toDateString() !== dateStr));
    } else {
      // 선택 추가
      onDateChange([...selectedDates, date]);
    }
  };

  // 선택된 날짜인지 확인
  const isDateSelected = (date: Date): boolean => {
    const dateStr = date.toDateString();
    return selectedDates.some(d => d.toDateString() === dateStr);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className={`${className ?? 'w-[343px]'} mx-auto`}>
        <style>{`
          .multi-select-calendar .react-datepicker {
            border: none !important;
            background: transparent !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
          }
          .multi-select-calendar .react-datepicker__header {
            background: transparent !important;
            border: none !important;
            padding: 0 0 5px 0 !important;
            text-align: center !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            color: var(--color-gray-950) !important;
          }
          .multi-select-calendar .react-datepicker__month {
            margin: 0 !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .multi-select-calendar .react-datepicker__month-container {
            width: 100% !important;
          }
          .multi-select-calendar .react-datepicker__day-names {
            display: grid !important;
            grid-template-columns: repeat(7, 1fr) !important;
            width: 100% !important;
            height: 32px !important;
            margin-bottom: 10px !important;
            gap: 0 !important;
            text-align: center !important;
          }
          .multi-select-calendar .react-datepicker__day-name {
            width: 100% !important;
            margin: 0 !important;
            font-size: 13px !important;
            color: var(--color-gray-400) !important;
            font-weight: 400 !important;
            line-height: 32px !important;
            padding: 0 !important;
          }
          .multi-select-calendar .react-datepicker__week {
            display: grid !important;
            grid-template-columns: repeat(7, 1fr) !important;
            width: 100% !important;
            gap: 0 !important;
            margin-bottom: 8px !important;
          }
          .multi-select-calendar .react-datepicker__day {
            width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            height: 32px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 14px !important;
            font-weight: 400 !important;
            line-height: 20px !important;
            color: #1a1a1a !important;
            background: transparent !important;
            border: none !important;
            cursor: pointer !important;
          }
          .multi-select-calendar .react-datepicker__day--outside-month {
            color: #999999 !important;
          }
          .multi-select-calendar .react-datepicker__day:hover {
            background: transparent !important;
          }
        `}</style>

        <div className="multi-select-calendar">
          <ReactDatePicker
            key={`calendar-${currentDate.getFullYear()}-${currentDate.getMonth()}`}
            selected={null}
            onMonthChange={date => setCurrentDate(date)}
            openToDate={currentDate}
            inline
            locale="ko"
            showMonthYearPicker={false}
            calendarClassName="w-full"
            onChange={() => {}} // 빈 함수 (renderDayContents에서 직접 처리)
            dayClassName={date => {
              if (!date) return '';
              const selected = isDateSelected(date);
              return selected ? 'react-datepicker__day--selected' : '';
            }}
            renderDayContents={(day: number, date?: Date) => {
              if (!date) return day;
              
              const selected = isDateSelected(date);
              
              return (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDateClick(date);
                  }}
                  className={clsx(
                    'w-8 h-8 flex items-center justify-center cursor-pointer transition-colors',
                    selected ? 'bg-primary text-white rounded-full' : 'hover:bg-blue-50 hover:rounded-full'
                  )}
                >
                  {day}
                </div>
              );
            }}
            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
              <div className="flex items-center justify-center gap-16 mb-4">
                <button onClick={decreaseMonth} className="w-[33px] h-[33px] flex items-center justify-center">
                  <Image src="/icons/back-gray.svg" alt="이전 월" width={33} height={33} />
                </button>
                <div className="text-center text-body-md text-gray-950">
                  {date.getFullYear()}년 {(date.getMonth() + 1).toString().padStart(2, '0')}월
                </div>
                <button onClick={increaseMonth} className="w-[33px] h-[33px] flex items-center justify-center">
                  <Image src="/icons/back-gray.svg" alt="다음 월" width={33} height={33} className="rotate-180" />
                </button>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
