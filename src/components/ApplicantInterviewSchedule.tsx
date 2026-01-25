'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Toggle from './Toggle';
import Btn from './Btn';

interface ScheduleState {
  [key: string]: boolean;
}

export default function ApplicantInterviewSchedule() {
  const router = useRouter();
  const [isRecruiting, setIsRecruiting] = useState(true);
  const [guidance, setGuidance] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<ScheduleState>({});
  const [isFocused, setIsFocused] = useState(false);

  // 면접 시간 데이터
  const timeSlotsByDate: Record<string, string[]> = {
    '9월 1일 (월)': ['10:00', '10:30', '11:00', '11:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'],
    '9월 2일 (화)': ['10:00', '10:30', '11:00', '11:30', '16:00', '16:30'],
    '9월 3일 (수)': ['16:00', '16:30', '17:00'],
  };

  const handleTimeSlotToggle = (date: string, time: string) => {
    const key = `${date}-${time}`;
    setSelectedSlots((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    const selected = Object.entries(selectedSlots)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key);

    console.log('Guidance:', guidance);
    console.log('Selected Slots:', selected);
    
    // 스마트 시간표 페이지로 이동
    router.push('/smart-schedule');
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2">
        <button onClick={() => router.back()} className="flex items-center justify-center">
          <Image src="/icons/back.svg" alt="back" width={28} height={28} />
        </button>
        <h1 className="text-title flex-1 text-center text-gray-950">지원자 면접 시간 모집</h1>
        <div className="w-6"></div>
      </div>

      {/* 콘텐츠 */}
      <div className="px-4 py-6 space-y-6">
        {/* 토글 섹션 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-subtitle-sm-md text-gray-950">
              지원자 응답 받기
            </label>
            <Toggle
              checked={isRecruiting}
              onChange={setIsRecruiting}
            />
          </div>
          <p className="text-body-xs-rg text-gray-300">
            OFF 시 지원자는 시간 선택을 제출할 수 없습니다.
          </p>
        </div>

        {/* 안내 문구 섹션 */}
        <div className="space-y-2">
          <label className="block text-subtitle-sm-md text-gray-950">
            안내 사항 문구
          </label>
          <div 
            className={`bg-white border rounded-[10px] p-4 transition-colors relative shadow-[2px_2px_20px_0px_rgba(0,0,0,0.03)] ${
              isFocused ? 'border-primary' : 'border-gray-100'
            }`}
          >
            <textarea
              value={guidance}
              onChange={(e) => setGuidance(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="면접 가능 시간 선택 위해 안내 사항을 입력하세요."
              className="w-full bg-transparent text-body-sm-rg text-gray-950 placeholder:text-gray-400 resize-none focus:outline-none min-h-[120px]"
            />
            {guidance && (
              <p className="absolute bottom-2 right-3 text-[10px] leading-[14px] text-gray-200">
                자동저장됨
              </p>
            )}
          </div>
        </div>

        {/* 면접 가능 시간 섹션 */}
        <div className="space-y-4">
          <h2 className="text-subtitle-sm-sb text-gray-950">
            면접 가능 시간
          </h2>

          {Object.entries(timeSlotsByDate).map(([date, times]) => (
            <div key={date} className="space-y-3">
              {/* 날짜 라벨 */}
              <h3 className="text-subtitle-sm-md text-gray-950">{date}</h3>

              {/* 시간 버튼 그리드 */}
              <div className="grid grid-cols-4 gap-2">
                {times.map((time) => {
                  const key = `${date}-${time}`;
                  const isSelected = selectedSlots[key] || false;

                  return (
                    <button
                      key={key}
                      onClick={() => handleTimeSlotToggle(date, time)}
                      className={`
                        py-2 px-3 rounded-[5px] border text-body-sm-rg
                        transition-all duration-200
                        ${
                          isSelected
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-950 border-gray-200 hover:border-primary'
                        }
                      `}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex justify-center">
        <Btn
          onClick={handleSave}
          disabled={!isRecruiting}
          variant="primary"
          size="lg"
        >
          저장하기
        </Btn>
      </div>
    </div>
  );
}
