'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Toggle from '@/components/ui/Toggle';
import ConfirmResetDialog from '@/components/ui/ConfirmResetDialog';

const BLUE_COLORS = [
  '#efefef', // 0명 - gray-100
  '#eff3ff', // 1명 - blue-50
  '#dbe3fe', // 2명 - blue-100
  '#bfcefe', // 3명 - blue-200
  '#93affd', // 4명 - blue-300
  '#3b5cf6', // 5명 - blue-500
  '#253beb', // 6명 - blue-600
  '#1d28d8', // 7명 - blue-700
  '#1e22af', // 8명 - blue-800
  '#1e248a', // 9명 - blue-900
  '#171954', // 10명 - blue-950
];

// 개별 면접관용 2가지 색상
const GRAY1 = '#efefef'; // 그레이1 - gray-100
const BLUE2 = '#bfcefe'; // 블루2 - blue-200

const dayOfWeekLabels = ['일', '월', '화', '수', '목', '금', '토'];
const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

interface DayData {
  dayOfWeek: string;
  date: number;
  availability: [number, number][]; // 각 시간대마다 [상반부, 하반부]
}

// 샘플 데이터 생성
const generateSampleData = (startDate: Date, seed: number = 0, timeSlots: string[] = []): DayData[] => {
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
      availability: timeSlots.map((_, idx) => [
        seededRandom(idx * 2), // 상반부 (위)
        seededRandom(idx * 2 + 1), // 하반부 (아래)
      ]),
    });
  }
  return days;
};

interface Interviewer {
  name: string;
  isLeader?: boolean;
  isRequired?: boolean;
  profileImageUrl?: string;
  participated?: boolean; // 시간 등록 참여 여부
  userId?: number; // 면접관 ID
  email?: string; // 이메일
}

export default function SmartScheduleCalendarPreview({
  interviewerName,
  seed = 0,
  seeds,
  showProfiles = true,
  interviewers,
  showRequiredSection = false,
  requiredInterviewer,
  onRequiredInterviewerChange,
  interviewDates = [],
  timeSlots = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  showInterviewerView: externalShowInterviewerView,
  onShowInterviewerViewChange,
  cellActive: externalCellActive,
  onCellActiveChange,
  interviewersCellActive,
}: {
  interviewerName?: string | null;
  seed?: number;
  seeds?: number[];
  showProfiles?: boolean;
  interviewers?: Interviewer[];
  showRequiredSection?: boolean;
  requiredInterviewer?: boolean;
  onRequiredInterviewerChange?: (value: boolean) => void;
  interviewDates?: Date[];
  timeSlots?: string[];
  showInterviewerView?: boolean;
  onShowInterviewerViewChange?: (value: boolean) => void;
  cellActive?: { [key: string]: { top: boolean; bottom: boolean } };
  onCellActiveChange?: (cellActive: { [key: string]: { top: boolean; bottom: boolean } }) => void;
  interviewersCellActive?: { [interviewerId: number]: { [key: string]: { top: boolean; bottom: boolean } } };
}) {
  const [internalCellActive, setInternalCellActive] = useState<{ [key: string]: { top: boolean; bottom: boolean } }>({});
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // 캘린더 모달 내부에서만 사용
  const [hoveredCell, setHoveredCell] = useState<{ day: number; time: number; half: 'top' | 'bottom' } | null>(null);
  const [internalShowInterviewerView, setInternalShowInterviewerView] = useState(false);
  const [activeTab, setActiveTab] = useState<'participated' | 'notParticipated'>('participated');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingDate, setPendingDate] = useState<Date | null>(null);

  // Use external state if provided, otherwise use internal state
  const showInterviewerView = externalShowInterviewerView !== undefined ? externalShowInterviewerView : internalShowInterviewerView;
  const setShowInterviewerView = onShowInterviewerViewChange || setInternalShowInterviewerView;

  // cellActive도 외부/내부 상태 선택적 사용
  const cellActive = externalCellActive !== undefined ? externalCellActive : internalCellActive;
  const setCellActive = (newCellActive: { [key: string]: { top: boolean; bottom: boolean } } | ((prev: { [key: string]: { top: boolean; bottom: boolean } }) => { [key: string]: { top: boolean; bottom: boolean } })) => {
    if (onCellActiveChange) {
      // 외부 제어인 경우
      if (typeof newCellActive === 'function') {
        const computed = newCellActive(cellActive);
        onCellActiveChange(computed);
      } else {
        onCellActiveChange(newCellActive);
      }
    } else {
      // 내부 상태 사용
      setInternalCellActive(newCellActive);
    }
  };

  // seeds가 있으면 모든 seed의 가용도를 합산, 아니면 단일 seed 사용
  const dayCols = useMemo(() => {
    const daysToShow = 3;
    const emptyDays: DayData[] = [];
    
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(currentStartDate);
      date.setDate(date.getDate() + i);
      emptyDays.push({
        dayOfWeek: dayOfWeekLabels[date.getDay()],
        date: date.getDate(),
        availability: timeSlots.map(() => [0, 0]) as [number, number][],
      });
    }
    return emptyDays;
  }, [currentStartDate, timeSlots]);

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
    const prevMonthDays = getDaysInMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    const days: Array<{ day: number; isCurrentMonth: boolean; isPrevMonth: boolean; isNextMonth: boolean }> = [];

    // 이전 달 날짜 채우기
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false, isPrevMonth: true, isNextMonth: false });
    }

    // 이번 달 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, isPrevMonth: false, isNextMonth: false });
    }

    // 다음 달 날짜 채우기 (7의 배수로 만들기)
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push({ day: i, isCurrentMonth: false, isPrevMonth: false, isNextMonth: true });
      }
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
            <Toggle 
              checked={requiredInterviewer || false} 
              onChange={(value) => onRequiredInterviewerChange?.(value)} 
            />
          </div>
          <p className="text-[12px] text-gray-500 leading-[17px] tracking-[0.12px]">
            각 타임에 필수 면접관이 최소 1명씩 자동 배정됩니다.
          </p>
        </div>
      )}

      {/* Calendar - only show if not in interviewer view */}
      {!showInterviewerView && (
        <>
          {/* Calendar Header with gray background */}
          <div className="rounded-[10px] bg-gray-50 p-4 mt-3">
        {/* Header with month and calendar icon */}
        <div className="flex items-center justify-center relative mb-[15px] gap-5 ml-8">
          <span className="text-[15px] font-medium leading-[20px] text-gray-950">{currentMonthYear}</span>
            <button
              onClick={() => setShowCalendarModal(!showCalendarModal)}
              className="cursor-pointer"
              aria-label="날짜 선택"
            >
              <Image src="/icons/calendar-black.svg" alt="calendar" width={14.3} height={14.3} />
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
            {dayCols.map((day, idx) => {
              const dayDate = new Date(currentStartDate);
              dayDate.setDate(currentStartDate.getDate() + idx);
              const isInterviewDate = interviewDates.some(date => 
                date.getFullYear() === dayDate.getFullYear() &&
                date.getMonth() === dayDate.getMonth() &&
                date.getDate() === dayDate.getDate()
              );
              
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[12px] text-gray-500">{day.dayOfWeek}</span>
                  <span className={`text-[16px] font-normal ${isInterviewDate ? 'text-primary' : 'text-gray-950'}`}>
                    {day.date}
                  </span>
                </div>
              );
            })}
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
        {/* Calendar grid - Row by row */}
        <div className="flex flex-col gap-1">
          {timeSlots.map((timeSlot, timeIdx) => (
            <div key={timeSlot} className="flex gap-2" style={{ height: '50px' }}>
              {/* Time label */}
              <div className="text-[14px] text-gray-950 font-normal flex items-center justify-start flex-shrink-0" style={{ width: '30px' }}>
                {timeSlot.split(':')[0]}
              </div>

              {/* Grid cells for this time slot */}
              <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${dayCols.length}, 1fr)` }}>
                {dayCols.map((day, dayIdx) => {
                  const timeSlotData = day.availability[timeIdx];
                  const topCount = timeSlotData[0];
                  const bottomCount = timeSlotData[1];

                  let topColor: string;
                  let bottomColor: string;

                  // 실제 날짜 계산 (currentStartDate + dayIdx)
                  const actualDate = new Date(currentStartDate);
                  actualDate.setDate(actualDate.getDate() + dayIdx);
                  const dateKey = `${actualDate.getFullYear()}-${(actualDate.getMonth() + 1).toString().padStart(2, '0')}-${actualDate.getDate().toString().padStart(2, '0')}`;
                  
                  // cellKey를 날짜와 시간 인덱스로 생성
                  const cellKey = `${dateKey}-${timeIdx}`;
                  
                  // 디버깅: 첫 번째 셀에서만 로그 출력
                  if (dayIdx === 0 && timeIdx === 0 && interviewerName) {
                    console.log(`[CalendarPreview] ${interviewerName} - cellKey 생성:`, cellKey);
                    console.log(`[CalendarPreview] ${interviewerName} - cellActive 전체:`, cellActive);
                    console.log(`[CalendarPreview] ${interviewerName} - cellActive[${cellKey}]:`, cellActive[cellKey]);
                  }
                  
                  const isTopActive = interviewerName ? (cellActive[cellKey]?.top ?? false) : undefined;
                  const isBottomActive = interviewerName ? (cellActive[cellKey]?.bottom ?? false) : undefined;

                  if (interviewerName) {
                    // 개별 면접관: 선택된 셀만 파란색
                    topColor = isTopActive ? BLUE2 : GRAY1;
                    bottomColor = isBottomActive ? BLUE2 : GRAY1;
                  } else {
                    // 전체 뷰: interviewersCellActive로 실제 면접관 수 계산
                    if (interviewersCellActive && Object.keys(interviewersCellActive).length > 0) {
                      let topInterviewerCount = 0;
                      let bottomInterviewerCount = 0;
                      
                      // 각 면접관의 cellActive를 확인하여 카운트
                      Object.values(interviewersCellActive).forEach(cellActiveData => {
                        if (cellActiveData[cellKey]?.top) topInterviewerCount++;
                        if (cellActiveData[cellKey]?.bottom) bottomInterviewerCount++;
                      });
                      
                      // 디버깅 로그 (첫 번째 셀만)
                      if (dayIdx === 0 && timeIdx === 0) {
                        console.log('[CalendarPreview] 전체 뷰 - cellKey:', cellKey);
                        console.log('[CalendarPreview] top 면접관 수:', topInterviewerCount, 'bottom 면접관 수:', bottomInterviewerCount);
                      }
                      
                      // 면접관 수에 따라 색상 결정
                      topColor = BLUE_COLORS[Math.min(topInterviewerCount, 10)];
                      bottomColor = BLUE_COLORS[Math.min(bottomInterviewerCount, 10)];
                    } else {
                      // 데이터가 없으면 샘플 데이터 기반
                      topColor = BLUE_COLORS[Math.min(topCount, 10)];
                      bottomColor = BLUE_COLORS[Math.min(bottomCount, 10)];
                    }
                  }

                  const getAvailableInterviewers = (half: 'top' | 'bottom') => {
                    if (!interviewers) return [];
                    
                    // interviewersCellActive가 있으면 실제 데이터 사용
                    if (interviewersCellActive && Object.keys(interviewersCellActive).length > 0) {
                      const available: Interviewer[] = [];
                      interviewers.forEach((interviewer) => {
                        if (!interviewer.userId) return;
                        const cellActiveData = interviewersCellActive[interviewer.userId];
                        if (!cellActiveData) return;
                        
                        const isAvailable = half === 'top' 
                          ? cellActiveData[cellKey]?.top 
                          : cellActiveData[cellKey]?.bottom;
                        
                        if (isAvailable) {
                          available.push(interviewer);
                        }
                      });
                      return available;
                    }
                    
                    // 데이터가 없으면 빈 배열 반환
                    return [];
                  };

                  return (
                    <div key={`${dayIdx}-${timeIdx}`} className="flex flex-col h-full w-full relative">
                      {/* Top half - solid border */}
                      <div
                        className={`flex-1 border-t border-white border-solid ${interviewerName ? 'cursor-pointer hover:opacity-80' : ''}`}
                        style={{ backgroundColor: topColor, cursor: interviewerName ? 'pointer' : 'default' }}
                        onClick={() => {
                          if (interviewerName) {
                            const newTop = !(cellActive[cellKey]?.top ?? false);
                            console.log(`[CalendarPreview] ${interviewerName} - 클릭 dateKey: ${dateKey}, cellKey: ${cellKey}, 현재 top: ${cellActive[cellKey]?.top}, 새 top: ${newTop}`);
                            setCellActive(prev => {
                              const updated = {
                                ...prev,
                                [cellKey]: {
                                  top: newTop,
                                  bottom: prev[cellKey]?.bottom ?? false,
                                },
                              };
                              console.log(`[CalendarPreview] ${interviewerName} - 업데이트된 cellActive:`, updated);
                              return updated;
                            });
                          }
                        }}
                        onMouseEnter={() =>
                          !interviewerName && setHoveredCell({ day: dayIdx, time: timeIdx, half: 'top' })
                        }
                        onMouseLeave={() => !interviewerName && setHoveredCell(null)}
                      />
                      {/* Bottom half - dashed border */}
                      <div
                        className={`flex-1 border-t border-white ${interviewerName ? 'cursor-pointer hover:opacity-80' : ''}`}
                        style={{ backgroundColor: bottomColor, borderStyle: 'dashed', cursor: interviewerName ? 'pointer' : 'default' }}
                        onClick={() => {
                          if (interviewerName) {
                            const newBottom = !(cellActive[cellKey]?.bottom ?? false);
                            console.log(`[CalendarPreview] ${interviewerName} - 클릭 dateKey: ${dateKey}, cellKey: ${cellKey}, 현재 bottom: ${cellActive[cellKey]?.bottom}, 새 bottom: ${newBottom}`);
                            setCellActive(prev => {
                              const updated = {
                                ...prev,
                                [cellKey]: {
                                  top: prev[cellKey]?.top ?? false,
                                  bottom: newBottom,
                                },
                              };
                              console.log(`[CalendarPreview] ${interviewerName} - 업데이트된 cellActive:`, updated);
                              return updated;
                            });
                          }
                        }}
                        onMouseEnter={() =>
                          !interviewerName && setHoveredCell({ day: dayIdx, time: timeIdx, half: 'bottom' })
                        }
                        onMouseLeave={() => !interviewerName && setHoveredCell(null)}
                      />

                      {/* Hover tooltip */}
                      {!interviewerName && 
                        hoveredCell?.day === dayIdx && 
                        hoveredCell?.time === timeIdx && 
                        getAvailableInterviewers(hoveredCell.half).length > 0 && (
                        <div
                          className={`absolute ${dayIdx === dayCols.length - 1 ? 'right-full mr-2' : 'left-full ml-2'} bg-white rounded-[10px] px-[23px] py-[15px] w-[150px] z-50 flex flex-col gap-[10px] ${hoveredCell.half === 'top' ? 'top-0' : 'top-1/2'}`}
                        >
                          {getAvailableInterviewers(hoveredCell.half).map((interviewer, idx) => (
                            <div key={idx} className="flex items-start gap-[3px] text-[14px] text-black leading-[20px]">
                              <span>{interviewer.name}</span>
                              {interviewer.isRequired && <span className="text-[14px]">(필수)</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interviewer avatars row (right-aligned) */}
      {showProfiles && (
        <div className="flex items-center justify-end py-2 pr-2 border-b border-gray-300">
          {/* Profile avatars (30px, overlap) */}
          <div className="flex items-center -space-x-2">
            <div className="w-[30px] h-[30px] rounded-full bg-gray-200 border-2 border-white" />
            <div className="w-[30px] h-[30px] rounded-full bg-gray-200 border-2 border-white" />
            <div className="w-[30px] h-[30px] rounded-full bg-gray-200 border-2 border-white" />
          </div>
          {/* More chevron (24px hit area) */}
          <button
            onClick={() => setShowInterviewerView(true)}
            style={{ width: '24px', height: '24px' }}
            className="flex items-center justify-center"
            aria-label="더보기"
          >
            <Image src="/icons/chevron-right.svg" alt="more" width={24} height={24} />
          </button>
        </div>
      )}
        </>
      )}

      {/* Interviewer List View - replaces the calendar when shown */}
      {showInterviewerView && (
        <div className="bg-white border-b border-gray-200 w-full">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveTab('participated')}
              className="flex-1 h-[48px] bg-white relative flex items-center justify-center transition-colors"
            >
              <span className={`text-[14px] font-medium leading-[20px] ${activeTab === 'participated' ? 'text-gray-950' : 'text-gray-400'}`}>
                참여
              </span>
              {activeTab === 'participated' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-950" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('notParticipated')}
              className="flex-1 h-[48px] bg-white relative flex items-center justify-center transition-colors"
            >
              <span className={`text-[14px] font-medium leading-[20px] ${activeTab === 'notParticipated' ? 'text-gray-950' : 'text-gray-400'}`}>
                미참여
              </span>
              {activeTab === 'notParticipated' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-950" />
              )}
            </button>
          </div>

          {/* Interviewer List */}
          <div className="flex flex-col py-2">
            {interviewers
              ?.filter(interviewer => {
                if (activeTab === 'participated') {
                  return interviewer.participated === true;
                } else {
                  return interviewer.participated === false || interviewer.participated === undefined;
                }
              })
              .map((interviewer, idx) => (
                <div key={idx} className="w-full h-[56px] flex items-center px-5 relative hover:bg-gray-50 transition-colors">
                  {interviewer.profileImageUrl ? (
                    <Image
                      src={interviewer.profileImageUrl}
                      alt={interviewer.name}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
                  )}
                  <span className="ml-3 text-[14px] leading-[20px] font-normal text-gray-950">{interviewer.name}</span>
                  {interviewer.isRequired && (
                    <div className="ml-2 bg-gray-100 h-5 px-2 rounded-[10px] flex items-center justify-center">
                      <span className="text-[11px] leading-none font-medium text-gray-700">필수</span>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Back button */}
          <div className="h-[56px] px-4 flex items-center justify-end border-t border-gray-100">
            <button 
              onClick={() => setShowInterviewerView(false)}
              className="flex items-center gap-1 py-2 px-1 hover:opacity-70 transition-opacity"
            >
              <span className="text-[13px] leading-[18px] font-medium text-gray-600">시간으로 돌아가기</span>
              <Image src="/icons/chevron-right.svg" alt="back" width={20} height={20} className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[10px] p-4 flex flex-col gap-[10px] w-[303px]">
            {/* Header with title and close button */}
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium leading-[20px] text-[#1f1f1f]">날짜 선택</span>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="w-6 h-6 flex items-center justify-center"
                aria-label="닫기"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1L11 11M11 1L1 11" stroke="#1f1f1f" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Month navigation */}
            <div className="flex items-center justify-center gap-[10px]">
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setSelectedDate(newDate);
                }}
                className="w-6 h-6 flex items-center justify-center"
                aria-label="이전 달"
              >
                <svg width="10" height="5" viewBox="0 0 10 5" fill="none">
                  <path d="M9 4.5L5 0.5L1 4.5" stroke="#1f1f1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-90 5 2.5)"/>
                </svg>
              </button>
              <div className="text-center text-[14px] font-medium leading-[20px] text-[#1f1f1f] w-[184px]">
                {selectedDate.getFullYear()}년 {String(selectedDate.getMonth() + 1).padStart(2, '0')}월
              </div>
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setSelectedDate(newDate);
                }}
                className="w-6 h-6 flex items-center justify-center"
                aria-label="다음 달"
              >
                <svg width="10" height="5" viewBox="0 0 10 5" fill="none">
                  <path d="M1 0.5L5 4.5L9 0.5" stroke="#1f1f1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-90 5 2.5)"/>
                </svg>
              </button>
            </div>

            {/* Week Labels */}
            <div className="grid grid-cols-7 gap-[10px] h-[18px]">
              {weekDays.map(day => (
                <div key={day} className="text-center text-[12px] text-[#6e7781] leading-normal">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-[10px]">
              {calendarDays.map((dayObj, idx) => {
                const { day, isCurrentMonth, isPrevMonth, isNextMonth } = dayObj;
                
                // 날짜 객체 생성
                let date: Date;
                if (isPrevMonth) {
                  date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, day);
                } else if (isNextMonth) {
                  date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, day);
                } else {
                  date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                }
                
                const isSelected = 
                  date.getDate() === currentStartDate.getDate() && 
                  date.getMonth() === currentStartDate.getMonth() && 
                  date.getFullYear() === currentStartDate.getFullYear();
                  
                const isInterviewDate = interviewDates.some(d => 
                  d.getFullYear() === date.getFullYear() &&
                  d.getMonth() === date.getMonth() &&
                  d.getDate() === date.getDate()
                );
                
                // 텍스트 색상 결정 (Tailwind 기준)
                let textColor = 'text-gray-900'; // 기본 검정
                if (!isCurrentMonth) {
                  textColor = 'text-gray-400'; // 다른 달 = 회색
                } else if (isSelected && isInterviewDate) {
                  textColor = 'text-white'; // 선택됨 + 면접날짜 = 흰색
                } else if (isSelected && !isInterviewDate) {
                  textColor = 'text-gray-900'; // 선택됨 + 면접날짜 아님 = 검정
                } else if (!isSelected && isInterviewDate) {
                  textColor = 'text-primary'; // 선택안됨 + 면접날짜 = 파랑 (Tailwind에서 text-primary가 파랑으로 지정되어 있다고 가정)
                }
                
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentStartDate(date);
                      setSelectedDate(date);
                      setShowCalendarModal(false);
                    }}
                    className={`
                      h-[30px] flex items-center justify-center text-[14px] leading-[20px] relative
                      ${textColor}
                      ${!isSelected ? 'hover:bg-gray-100 rounded-full' : ''}
                    `}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[30px] h-[30px] bg-[#5a81fa] rounded-full" />
                      </div>
                    )}
                    <span className="relative z-10">{day}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ConfirmResetDialog 제거: 날짜 선택 시 바로 변경 */}
    </div>
  );
}
