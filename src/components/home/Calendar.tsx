'use client';

import { useState } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image';
import clsx from 'clsx';

registerLocale('ko', ko);

interface CalendarProps {
  selected?: Date | null;
  onDateChange: (date: Date | [Date | null, Date | null] | null) => void;
  startDate?: Date | null;
  endDate?: Date | null;
  events?: Array<{ date: Date; title: string }>;
  selectsRange?: boolean;
  disableTodayHighlight?: boolean;
  className?: string;
}

export default function Calendar({
  selected,
  onDateChange,
  startDate,
  endDate,
  events = [],
  selectsRange = false,
  disableTodayHighlight = false,
  className,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(selected || startDate || new Date());

  const handleDateChange = (date: Date | [Date | null, Date | null] | null) => {
    onDateChange(date);
    if (date && !Array.isArray(date)) {
      setCurrentDate(date);
    }
  };

  const handlePickerChange = (dates: Date | (Date | null)[] | null) => {
    if (Array.isArray(dates)) {
      const normalized: [Date | null, Date | null] = [dates[0] ?? null, dates[1] ?? null];
      handleDateChange(normalized);
      return;
    }
    handleDateChange(dates);
  };

  const datePickerRangeProps = selectsRange
    ? {
        selectsRange: true as const,
        startDate,
        endDate,
        onChange: (dates: [Date | null, Date | null] | null) => handlePickerChange(dates),
      }
    : {
        selectsRange: false as const,
        onChange: (date: Date | null) => handlePickerChange(date),
      };

  // 이벤트 맵 (날짜 문자열 -> 이벤트 배열)
  const eventMap = new Map<string, string[]>();
  events.forEach(({ date, title }) => {
    const key = date.toDateString();
    if (!eventMap.has(key)) {
      eventMap.set(key, []);
    }
    eventMap.get(key)?.push(title);
  });

  const containerClasses = clsx('w-full flex flex-col items-center justify-center', {
    'calendar-no-today': disableTodayHighlight,
  });

  return (
    <div className={containerClasses}>
      <div className={`${className ?? 'w-[343px]'} mx-auto`}>
        <style>{`
          .react-datepicker {
            border: none !important;
            background: transparent !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
          }
          .react-datepicker__header {
            background: transparent !important;
            border: none !important;
            padding: 0 0 5px 0 !important;
            text-align: center !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            color: var(--color-gray-950) !important;
          }
          .react-datepicker__month {
            margin: 0 !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .react-datepicker__month-container {
            width: 100% !important;
          }
          .react-datepicker__day-names {
            display: grid !important;
            grid-template-columns: repeat(7, 1fr) !important;
            width: 100% !important;
            height: 32px !important;
            margin-bottom: 10px !important;
            gap: 0 !important;
            text-align: center !important;
          }
          .react-datepicker__day-name {
            width: 100% !important;
            margin: 0 !important;
            font-size: 13px !important;
            color: var(--color-gray-400) !important;
            font-weight: 500 !important;
            line-height: 32px !important;
            padding: 0 !important;
          }
          .react-datepicker__week {
            display: grid !important;
            grid-template-columns: repeat(7, 1fr) !important;
            width: 100% !important;
            gap: 0 !important;
            margin-bottom: 8px !important;
          }
          .react-datepicker__day {
            width: 100% !important;
            margin: 0 !important;
            padding: 4px 0 !important;
            height: auto !important;
            min-height: 30px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            font-size: 14px !important;
            font-weight: 400 !important;
            line-height: 20px !important;
            color: black !important;
            background: transparent !important;
            border: none !important;
            cursor: pointer !important;
            gap: 2px !important;
          }
          .react-datepicker__day--outside-month {
            color: var(--color-gray-400) !important;
          }
          .react-datepicker__day--today {
            background: transparent;
            color: var(--color-gray-950);
            font-weight: normal;
          }
          .calendar-no-today .react-datepicker__day--today {
            background: transparent !important;
            color: var(--color-gray-950) !important;
            font-weight: normal !important;
          }
          .calendar-no-today .react-datepicker__day--today.react-datepicker__day--selected,
          .calendar-no-today .react-datepicker__day--today.react-datepicker__day--in-range,
          .calendar-no-today .react-datepicker__day--today.react-datepicker__day--range-start,
          .calendar-no-today .react-datepicker__day--today.react-datepicker__day--range-end {
            background-color: var(--color-primary) !important;
            color: white !important;
          }
          .react-datepicker__day--has-event {
            background: transparent;
          }
          .react-datepicker__day--selected {
            background-color: transparent !important;
            color: var(--color-gray-950) !important;
            border-radius: 0;
          }
          .react-datepicker__day--in-range {
            background-color: transparent !important;
            color: var(--color-gray-950) !important;
            border-radius: 0;
          }
          .calendar-no-today .react-datepicker__day--selected {
            background-color: var(--color-primary) !important;
            color: white !important;
            border-radius: 10px;
          }
          .calendar-no-today .react-datepicker__day--in-range {
            background-color: var(--color-primary) !important;
            color: white !important;
            border-radius: 0;
          }
          .react-datepicker__day--range-start {
            background-color: var(--color-primary) !important;
            color: white !important;
            border-top-left-radius: 10px !important;
            border-bottom-left-radius: 10px !important;
            border-top-right-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
          }
          .react-datepicker__day--range-end {
            background-color: var(--color-primary) !important;
            color: white !important;
            border-top-left-radius: 0 !important;
            border-bottom-left-radius: 0 !important;
            border-top-right-radius: 10px !important;
            border-bottom-right-radius: 10px !important;
          }
          .react-datepicker__day--in-range.react-datepicker__day--today {
            border-radius: 0 !important;
          }
          .calendar-no-today .react-datepicker__day--in-range.react-datepicker__day--today {
            background-color: var(--color-primary) !important;
            color: white !important;
          }
          .calendar-no-today .react-datepicker__day--range-start {
            border-top-left-radius: 10px !important;
            border-bottom-left-radius: 10px !important;
            border-top-right-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
          }
          .calendar-no-today .react-datepicker__day--range-end {
            border-top-left-radius: 0 !important;
            border-bottom-left-radius: 0 !important;
            border-top-right-radius: 10px !important;
            border-bottom-right-radius: 10px !important;
          }
          .react-datepicker__day:hover {
            background: var(--color-blue-50);
            border-radius: 4px;
          }
        `}</style>

        <ReactDatePicker
          key={`calendar-${currentDate.getFullYear()}-${currentDate.getMonth()}`}
          selected={selected}
          onMonthChange={date => setCurrentDate(date)}
          openToDate={currentDate}
          inline
          locale="ko"
          showMonthYearPicker={false}
          calendarClassName="w-full"
          dayClassName={date => {
            const eventKey = date.toDateString();
            const dayEvents = eventMap.get(eventKey) || [];
            return dayEvents.length > 0 ? 'react-datepicker__day--has-event' : '';
          }}
          {...datePickerRangeProps}
          {...(!selectsRange &&
            !disableTodayHighlight && {
              renderDayContents: (day: number, date?: Date) => {
                if (!date) return day;
                const eventKey = date.toDateString();
                const dayEvents = eventMap.get(eventKey) || [];
                const compareDate = new Date(date);
                compareDate.setHours(0, 0, 0, 0);
                const selectedDate = selected ? new Date(selected) : null;
                if (selectedDate) {
                  selectedDate.setHours(0, 0, 0, 0);
                }
                const isSelected = selectedDate && compareDate.getTime() === selectedDate.getTime();

                return (
                  <div className="flex flex-col items-center justify-start w-full h-full gap-[2px] pt-[4px]">
                    <span
                      className={`text-body-rg ${isSelected ? 'w-[24px] h-[24px] flex items-center justify-center rounded-full bg-primary text-white' : ''}`}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="w-[40px] h-[14px] bg-blue-200 rounded-[2px] flex items-center justify-center px-[1px] py-[2px]">
                        <span className="overflow-hidden text-gray-900 text-center text-ellipsis whitespace-nowrap text-[10px] font-normal leading-[17px] max-w-full">
                          {dayEvents[0]}
                        </span>
                      </div>
                    )}
                  </div>
                );
              },
            })}
          renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
            <div className="flex items-center justify-center gap-16">
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
  );
}
