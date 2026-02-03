'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Toggle from '@/components/Toggle';

// 가용여부 표시 색상
const BLUE_COLORS = [
  '#efefef',      // 0명 - gray-100
  '#eff3ff',      // 1명 - blue-50
  '#dbe3fe',      // 2명 - blue-100
  '#bfcefe',      // 3명 - blue-200
  '#93affd',      // 4명 - blue-300
  '#3b5cf6',      // 5명 - blue-500
  '#253beb',      // 6명 - blue-600
  '#1d28d8',      // 7명 - blue-700
  '#1e22af',      // 8명 - blue-800
  '#1e248a',      // 9명 - blue-900
  '#171954',      // 10명 - blue-950
];

// 개별 면접관용 2가지 색상
const GRAY1 = '#efefef';      // 그레이1 - 가용 면접관 적음
const BLUE2 = '#bfcefe';      // 블루2 - 가용 면접관 많음

const dayOfWeekLabels = ['일', '월', '화', '수', '목', '금', '토'];
const hours = ['12', '13', '14', '15', '16', '17'];
const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

interface DayData {
  dayOfWeek: string;
  date: number;
  availability: [number, number][]; // 각 시간대마다 [상반부, 하반부]
}

// 샘플 데이터 생성
const generateSampleData = (startDate: Date, seed: number = 0): DayData[] => {
  const daysToShow = 3;
  
  const days: DayData[] = [];
  for (let i = 0; i < daysToShow; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // 시드값을 기반으로 일정한 난수 생성 (0 또는 1: 가능/불가능)
    const seededRandom = (index: number) => {
      const x = Math.sin(seed + index + date.getDate()) * 10000;
      return Math.floor((x - Math.floor(x)) * 2); // 0 또는 1만 반환
    };
    
    days.push({
      dayOfWeek: dayOfWeekLabels[date.getDay()],
      date: date.getDate(),
      availability: hours.map((_, idx) => [
        seededRandom(idx * 2),        // 상반부 (위)
        seededRandom(idx * 2 + 1),    // 하반부 (아래)
      ]),
    });
  }
  return days;
};

interface Interviewer {
  name: string;
  isLeader?: boolean;
}

export default function SmartScheduleCalendarPreview({ 
  interviewerName, 
  seed = 0, 
  seeds, 
  showProfiles = true,
  interviewers,
  showRequiredSection = false
}: { 
  interviewerName?: string | null, 
  seed?: number, 
  seeds?: number[], 
  showProfiles?: boolean,
  interviewers?: Interviewer[],
  showRequiredSection?: boolean
}) {
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoveredCell, setHoveredCell] = useState<{day: number, time: number, half: 'top' | 'bottom'} | null>(null);
  const [requiredInterviewer, setRequiredInterviewer] = useState(false);
  
  // seeds가 있으면 모든 seed의 가용도를 합산, 아니면 단일 seed 사용
  const dayCols = useMemo(() => {
    if (seeds && seeds.length > 0) {
      // 모든 seed의 데이터를 생성하고 가용도 합산
      const allData = seeds.map(s => generateSampleData(currentStartDate, s));
      const daysToShow = 3;
      const mergedDays: DayData[] = [];
      
      for (let i = 0; i < daysToShow; i++) {
        const date = new Date(currentStartDate);
        date.setDate(date.getDate() + i);
        
        // 각 타임별로 모든 면접관의 가용도를 합산 (가능한 면접관 수)
        const combinedAvailability = hours.map((_, hourIdx) => [
          allData.reduce((sum, data) => sum + data[i].availability[hourIdx][0], 0), // 상반부
          allData.reduce((sum, data) => sum + data[i].availability[hourIdx][1], 0), // 하반부
        ]);
        
        mergedDays.push({
          dayOfWeek: dayOfWeekLabels[date.getDay()],
          date: date.getDate(),
          availability: combinedAvailability as [number, number][],
        });
      }
      return mergedDays;
    } else {
      return generateSampleData(currentStartDate, seed);
    }
  }, [currentStartDate, seed, seeds]);
  
  // 현재 년월
  const currentMonthYear = useMemo(() => {
    return `${currentStartDate.getFullYear()}년 ${currentStartDate.getMonth() + 1}월`;
  }, [currentStartDate]);

  const handlePrevDays = () => {
    setCurrentStartDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 3);
      return newDate;
    });
  };

  const handleNextDays = () => {
    setCurrentStartDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 3);
      return newDate;
    });
  };

  // 월간 캘린더 로직
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];
    
    // 이전 달 날짜 채우기
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // 이번 달 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  }, [selectedDate]);

  return (
    <div className="w-full">
      {/* 필수 면접관 섹션 - 개별 면접관 캘린더에서만 표시 */}
      {showRequiredSection && (
        <div className="bg-white px-[9px] py-[10px] mb-3 mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-medium text-gray-600">필수 면접관</span>
            <Toggle checked={requiredInterviewer} onChange={setRequiredInterviewer} />
          </div>
          <p className="text-[12px] text-gray-500 leading-[17px] tracking-[0.12px]">
            각 타임에 필수 면접관이 최소 1명씩 자동 배정됩니다.
          </p>
        </div>
      )}

      {/* Calendar Header with gray background */}
      <div className="rounded-[10px] bg-gray-50 p-4 mt-3">
        {/* Header with month and calendar icon */}
        <div className="flex items-center justify-center relative mb-4">
          <span className="text-[15px] font-medium text-gray-950">
            {currentMonthYear}
          </span>
          <button
            onClick={() => setShowCalendarModal(!showCalendarModal)}
            className="absolute right-0"
            aria-label="날짜 선택"
          >
            <Image src="/icons/calendar-black.svg" alt="calendar" width={20} height={20} />
          </button>
        </div>

        {/* Navigation arrows and day headers */}
        <div className="flex items-center gap-2 ">
          {/* Left arrow */}
          <button 
            onClick={handlePrevDays}
            className="w-6 h-6 flex items-center justify-center flex-shrink-0"
            aria-label="이전"
          >
            <Image src="/icons/chevron-right.svg" alt="prev" width={24} height={24} className="rotate-180" />
          </button>

          {/* Day headers */}
          <div className="flex-1 grid gap-4" style={{ gridTemplateColumns: `repeat(${dayCols.length}, 1fr)` }}>
            {dayCols.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[12px] text-gray-400">{day.dayOfWeek}</span>
                <span className={`text-[16px] font-semibold ${idx === 0 ? 'text-blue-600' : 'text-gray-950'}`}>{day.date}</span>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button 
            onClick={handleNextDays}
            className="w-6 h-6 flex items-center justify-center flex-shrink-0"
            aria-label="다음"
          >
            <Image src="/icons/chevron-right.svg" alt="next" width={24} height={24} />
          </button>
        </div>
      </div>

      {/* Calendar grid without background */}
      <div className="p-0 pt-3 pr-2">
        {/* Calendar grid */}
        <div className="flex gap-2" style={{ minHeight: `${hours.length * 60 + 16}px` }}>
          {/* Time labels */}
          <div className="flex flex-col pt-1" style={{ width: '30px' }}>
            {hours.map((hour) => (
              <div
                key={hour}
                className="text-[14px] text-gray-950 font-medium flex items-center justify-start flex-shrink-0"
                style={{ height: '60px' }}
              >
                {hour}
              </div>
            ))}
          </div>

          {/* Grid cells */}
          <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${dayCols.length}, 1fr)` }}>
            {dayCols.map((day, dayIdx) => (
              <div key={dayIdx} className="flex flex-col gap-1">
                {day.availability.map((timeSlot, timeIdx) => {
                  // timeSlot = [상반부, 하반부]
                  const topCount = timeSlot[0];
                  const bottomCount = timeSlot[1];
                  
                  let topColor: string;
                  let bottomColor: string;
                  
                  if (interviewerName) {
                    // 개별 면접관: 그레이1과 블루2 2가지만 사용
                    topColor = topCount >= 1 ? BLUE2 : GRAY1;
                    bottomColor = bottomCount >= 1 ? BLUE2 : GRAY1;
                  } else {
                    // 전체: 11가지 블루 색상 사용 (0~3 범위)
                    topColor = BLUE_COLORS[Math.min(topCount, 10)];
                    bottomColor = BLUE_COLORS[Math.min(bottomCount, 10)];
                  }
                  
                  // 전체 캘린더에서만 가능한 면접관 목록 계산
                  const getAvailableInterviewers = (half: 'top' | 'bottom') => {
                    if (!seeds || !interviewers) return [];
                    const count = half === 'top' ? topCount : bottomCount;
                    if (count === 0) return [];
                    
                    // 각 seed(면접관)의 가용 여부 확인
                    const available: Interviewer[] = [];
                    seeds.forEach((s, idx) => {
                      const data = generateSampleData(currentStartDate, s);
                      const isAvailable = half === 'top' 
                        ? data[dayIdx].availability[timeIdx][0] >= 1
                        : data[dayIdx].availability[timeIdx][1] >= 1;
                      if (isAvailable && interviewers[idx]) {
                        available.push(interviewers[idx]);
                      }
                    });
                    return available;
                  };
                  
                  return (
                    <div key={`${dayIdx}-${timeIdx}`} className="flex flex-col h-[60px] w-full relative">
                      {/* Top half - solid border */}
                      <div
                        className="flex-1 border-t border-white border-solid cursor-pointer hover:opacity-80"
                        style={{ backgroundColor: topColor }}
                        onMouseEnter={() => !interviewerName && setHoveredCell({day: dayIdx, time: timeIdx, half: 'top'})}
                        onMouseLeave={() => !interviewerName && setHoveredCell(null)}
                      />
                      {/* Bottom half - dashed border */}
                      <div
                        className="flex-1 border-t border-white cursor-pointer hover:opacity-80"
                        style={{
                          backgroundColor: bottomColor,
                          borderStyle: 'dashed',
                        }}
                        onMouseEnter={() => !interviewerName && setHoveredCell({day: dayIdx, time: timeIdx, half: 'bottom'})}
                        onMouseLeave={() => !interviewerName && setHoveredCell(null)}
                      />
                      
                      {/* Hover tooltip - 전체 캘린더에서만 표시 */}
                      {!interviewerName && hoveredCell?.day === dayIdx && hoveredCell?.time === timeIdx && (
                        <div 
                          className={`absolute ${dayIdx === dayCols.length - 1 ? 'right-full mr-2' : 'left-full ml-2'} bg-white rounded-[10px] px-[23px] py-[15px] w-[150px] z-50 flex flex-col gap-[10px] ${hoveredCell.half === 'top' ? 'top-0' : 'top-1/2'}`}
                        >
                          {getAvailableInterviewers(hoveredCell.half).map((interviewer, idx) => (
                            <div key={idx} className="flex items-start gap-[3px] text-[14px] text-black leading-[20px]">
                              <span>{interviewer.name}</span>
                              {interviewer.isLeader && (
                                <span className="text-[14px]">(필수)</span>
                              )}
                            </div>
                          ))}
                          {getAvailableInterviewers(hoveredCell.half).length === 0 && (
                            <div className="text-[14px] text-gray-400 leading-[20px]">가능한 면접관 없음</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interviewer avatars row (right-aligned) */}
      {showProfiles && (
        <div className="flex items-center justify-end gap-2 px-4 py-3">
          {/* Profile avatars (36px, overlap) */}
          <div className="flex items-center -space-x-2">
            <div className="w-9 h-9 rounded-full bg-gray-200 border-2 border-white" />
            <div className="w-9 h-9 rounded-full bg-gray-200 border-2 border-white" />
            <div className="w-9 h-9 rounded-full bg-gray-200 border-2 border-white" />
          </div>
          {/* More chevron (30px hit area) */}
          <button
            style={{ width: '30px', height: '30px' }}
            className="flex items-center justify-center"
            aria-label="더보기"
          >
            <Image src="/icons/chevron-right.svg" alt="more" width={16} height={16} />
          </button>
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="w-[282px] bg-white rounded-[10px] p-4 flex flex-col gap-4">
            {/* Month Label */}
            <div className="text-center text-[14px] font-medium text-gray-950">
              {selectedDate.getFullYear()}년 {String(selectedDate.getMonth() + 1).padStart(2, '0')}월
            </div>

            {/* Week Labels */}
            <div className="grid grid-cols-7 gap-2 text-center text-[12px] text-gray-500">
              {weekDays.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (day) {
                      const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                      setCurrentStartDate(newDate);
                      setShowCalendarModal(false);
                    }
                  }}
                  disabled={!day}
                  className={`
                    w-[30px] h-[30px] rounded-full flex items-center justify-center text-[14px]
                    ${!day ? 'invisible' : ''}
                    ${day === selectedDate.getDate() && selectedDate.getMonth() === new Date().getMonth()
                      ? 'bg-blue-500 text-white'
                      : day
                      ? 'hover:bg-gray-100'
                      : ''
                    }
                  `}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowCalendarModal(false)}
                className="px-4 py-2 text-[14px] text-gray-600 hover:bg-gray-50 rounded"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
