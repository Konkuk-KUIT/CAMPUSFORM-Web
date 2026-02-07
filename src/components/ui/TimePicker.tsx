'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface TimePickerProps {
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  onTimeChange: (field: 'startHour' | 'startMinute' | 'endHour' | 'endMinute', value: string) => void;
}

export default function TimePicker({
  startHour,
  startMinute,
  endHour,
  endMinute,
  onTimeChange,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingField, setEditingField] = useState<'startHour' | 'startMinute' | 'endHour' | 'endMinute' | null>(null);
  const [tempStartHour, setTempStartHour] = useState(parseInt(startHour) || 0);
  const [tempStartMinute, setTempStartMinute] = useState(parseInt(startMinute) || 0);
  const [tempEndHour, setTempEndHour] = useState(parseInt(endHour) || 0);
  const [tempEndMinute, setTempEndMinute] = useState(parseInt(endMinute) || 0);

  // props 변경 시 state 업데이트
  useEffect(() => {
    setTempStartHour(parseInt(startHour) || 0);
    setTempStartMinute(parseInt(startMinute) || 0);
    setTempEndHour(parseInt(endHour) || 0);
    setTempEndMinute(parseInt(endMinute) || 0);
  }, [startHour, startMinute, endHour, endMinute]);

  // 모달이 열렸을 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const openModal = (field: 'startHour' | 'startMinute' | 'endHour' | 'endMinute') => {
    setEditingField(field);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (editingField === 'startHour') onTimeChange('startHour', String(tempStartHour).padStart(2, '0'));
    if (editingField === 'startMinute') onTimeChange('startMinute', String(tempStartMinute).padStart(2, '0'));
    if (editingField === 'endHour') onTimeChange('endHour', String(tempEndHour).padStart(2, '0'));
    if (editingField === 'endMinute') onTimeChange('endMinute', String(tempEndMinute).padStart(2, '0'));
    setIsOpen(false);
  };

  const getHourLabel = (hour: number) => {
    const period = hour >= 12 ? '오후' : '오전';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${period} ${displayHour}`;
  };

  const formatMinute = (minute: number) => String(minute).padStart(2, '0');

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const ScrollerWheel = ({
    items,
    selectedIndex,
    onChange,
    isHourField,
  }: {
    items: number[];
    selectedIndex: number;
    onChange: (idx: number) => void;
    isHourField: boolean;
  }) => {
    const getItemLabel = (item: number) => {
      if (isHourField) {
        return String(item).padStart(2, '0');
      }
      return formatMinute(item);
    };

    const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 1 : -1;
      let newIndex = selectedIndex + delta;
      
      // 순환 처리
      if (newIndex < 0) {
        newIndex = items.length - 1;
      } else if (newIndex >= items.length) {
        newIndex = 0;
      }
      
      onChange(newIndex);
    };

    // 순환 인덱스 계산 함수
    const getCircularIndex = (index: number) => {
      if (index < 0) {
        return items.length + index;
      } else if (index >= items.length) {
        return index - items.length;
      }
      return index;
    };

    return (
      <div
        className="relative w-[73px] h-[151px] overflow-hidden flex items-center justify-center"
        onWheel={handleWheel}
      >
        {/* 아이템들을 중앙 기준으로 배치 */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* 선택된 중앙 아이템 (파란색) - 정확히 중앙에 위치 */}
          <div 
            className={`absolute text-blue-500 text-[22px] font-medium h-[30px] flex items-center justify-center w-[50px] tabular-nums`}
            style={{ top: 'calc(50% - 15px)', left: isHourField ? '0' : 'auto', right: isHourField ? 'auto' : '0' }}
          >
            {isHourField
              ? String(items[selectedIndex]).padStart(2, '0')
              : formatMinute(items[selectedIndex])}
          </div>

          {/* 위쪽 아이템 1 (항상 표시) */}
          <div 
            className={`absolute text-gray-300 text-[22px] h-[30px] flex items-center justify-center opacity-50 w-[50px] tabular-nums`}
            style={{ top: 'calc(50% - 50px)', left: isHourField ? '0' : 'auto', right: isHourField ? 'auto' : '0' }}
          >
            {getItemLabel(items[getCircularIndex(selectedIndex - 1)])}
          </div>

          {/* 위쪽 아이템 2 (항상 표시) */}
          <div 
            className={`absolute text-gray-300 text-[22px] h-[30px] flex items-center justify-center opacity-30 w-[50px] tabular-nums`}
            style={{ top: 'calc(50% - 85px)', left: isHourField ? '0' : 'auto', right: isHourField ? 'auto' : '0' }}
          >
            {getItemLabel(items[getCircularIndex(selectedIndex - 2)])}
          </div>

          {/* 아래쪽 아이템 1 (항상 표시) */}
          <div 
            className={`absolute text-gray-300 text-[22px] h-[30px] flex items-center justify-center opacity-50 w-[50px] tabular-nums`}
            style={{ top: 'calc(50% + 20px)', left: isHourField ? '0' : 'auto', right: isHourField ? 'auto' : '0' }}
          >
            {getItemLabel(items[getCircularIndex(selectedIndex + 1)])}
          </div>

          {/* 아래쪽 아이템 2 (항상 표시) */}
          <div 
            className={`absolute text-gray-300 text-[22px] h-[30px] flex items-center justify-center opacity-30 w-[50px] tabular-nums`}
            style={{ top: 'calc(50% + 55px)', left: isHourField ? '0' : 'auto', right: isHourField ? 'auto' : '0' }}
          >
            {getItemLabel(items[getCircularIndex(selectedIndex + 2)])}
          </div>
        </div>
      </div>
    );
  };

  const currentStartHourIdx = tempStartHour;
  const currentStartMinuteIdx = minutes.indexOf(tempStartMinute);
  const currentEndHourIdx = tempEndHour;
  const currentEndMinuteIdx = minutes.indexOf(tempEndMinute);

  return (
    <>
      {/* Time display buttons */}
      <div className="px-2 py-1">
        <div className="grid grid-cols-2 items-center px-2 py-2">
          <span className="text-[14px] text-gray-500">시작 시간</span>
          <button
            onClick={() => openModal('startHour')}
            className="flex items-center justify-end gap-2 h-8 text-[14px] text-black"
          >
            <span className="min-w-[60px] text-right">
              {String(tempStartHour).padStart(2, '0')} : {formatMinute(tempStartMinute)}
            </span>
            <Image src="/icons/chevron-down.svg" alt="dropdown" width={16} height={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 items-center px-2 py-2">
          <span className="text-[14px] text-gray-500">종료 시간</span>
          <button
            onClick={() => openModal('endHour')}
            className="flex items-center justify-end gap-2 h-8 text-[14px] text-black"
          >
            <span className="min-w-[60px] text-right">
              {String(tempEndHour).padStart(2, '0')} : {formatMinute(tempEndMinute)}
            </span>
            <Image src="/icons/chevron-down.svg" alt="dropdown" width={16} height={16} />
          </button>
        </div>
      </div>

      {/* Time picker modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="w-[241px] bg-white rounded-[10px] p-6 flex flex-col items-center gap-6">
            {/* Hour and Minute wheels */}
            <div className="flex items-center justify-center gap-2">
              {editingField?.includes('Hour') ? (
                <>
                  <ScrollerWheel
                    items={hours}
                    selectedIndex={editingField === 'startHour' ? currentStartHourIdx : currentEndHourIdx}
                    onChange={(idx) =>
                      editingField === 'startHour'
                        ? setTempStartHour(idx)
                        : setTempEndHour(idx)
                    }
                    isHourField={true}
                  />
                  <span className="text-[22px] font-medium text-gray-400">:</span>
                  <ScrollerWheel
                    items={minutes}
                    selectedIndex={editingField === 'startHour' ? currentStartMinuteIdx : currentEndMinuteIdx}
                    onChange={(idx) => {
                      const newMinute = minutes[idx];
                      editingField === 'startHour'
                        ? setTempStartMinute(newMinute)
                        : setTempEndMinute(newMinute);
                    }}
                    isHourField={false}
                  />
                </>
              ) : (
                <>
                  <ScrollerWheel
                    items={hours}
                    selectedIndex={editingField === 'startMinute' ? currentStartHourIdx : currentEndHourIdx}
                    onChange={(idx) =>
                      editingField === 'startMinute'
                        ? setTempStartHour(idx)
                        : setTempEndHour(idx)
                    }
                    isHourField={true}
                  />
                  <span className="text-[22px] font-medium text-gray-400">:</span>
                  <ScrollerWheel
                    items={minutes}
                    selectedIndex={editingField === 'startMinute' ? currentStartMinuteIdx : currentEndMinuteIdx}
                    onChange={(idx) => {
                      const newMinute = minutes[idx];
                      editingField === 'startMinute'
                        ? setTempStartMinute(newMinute)
                        : setTempEndMinute(newMinute);
                    }}
                    isHourField={false}
                  />
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-12 justify-end w-full">
              <button
                onClick={() => setIsOpen(false)}
                className="text-[16px] font-medium text-gray-800"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="text-[16px] font-medium text-gray-800"
              >
                설정
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
