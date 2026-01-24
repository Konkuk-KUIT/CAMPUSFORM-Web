'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Btn from '@/components/Btn';

interface ScheduleState {
  [key: string]: boolean;
}

export default function ApplicantInterviewSubmitForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<ScheduleState>({});
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 안내 문구 (관리자가 설정한 내용)
  const guidanceText = `안녕하세요 요리퐁입니다!
하단에서 면접 가능하신 시간을 모두 선택해 주시면,
선택하신 정보를 바탕으로 최종 면접 일정이 확정됩니다 :)`;

  // 면접 시간 데이터 (관리자가 설정한 시간대)
  const timeSlotsByDate: Record<string, string[]> = {
    '9월 1일 (월)': ['10:00', '10:30', '11:00', '11:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'],
    '9월 2일 (화)': ['10:00', '10:30', '11:00', '11:30', '16:00', '16:30'],
    '9월 3일 (수)': ['16:00', '16:30', '17:00'],
  };

  const toggleDate = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const handleTimeSlotToggle = (date: string, time: string) => {
    const key = `${date}-${time}`;
    setSelectedSlots((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = () => {
    const selected = Object.entries(selectedSlots)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key);

    console.log('Name:', name);
    console.log('Phone:', phone);
    console.log('Selected Slots:', selected);

    // 제출 완료 상태로 전환
    setIsSubmitted(true);
  };

  const handleClose = () => {
    router.push('/smart-schedule');
  };

  // 제출 완료 화면
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* 헤더 */}
        <div className="h-12 bg-white flex items-center justify-center">
          <h1 className="text-title text-gray-950">면접 가능 시간</h1>
        </div>

        {/* 완료 메시지 */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
          <div className="w-24 h-24 mb-6 flex items-center justify-center">
            <Image src="/icons/check-circle.svg" alt="" width={96} height={96} />
          </div>
          <h2 className="text-subtitle-sb text-gray-950 mb-2 text-center">
            면접 가능 시간 제출이 완료되었습니다.
          </h2>
          <p className="text-body-rg text-gray-400 text-center mb-1">
            제출하신 시간을 바탕으로 면접 일정을 알려져 이후
          </p>
          <p className="text-body-rg text-gray-400 text-center mb-6">
            개별 안내드리겠습니다.
          </p>
          <p className="text-body-sm text-gray-400 text-center">
            *시간 변경을 원할 시, 품을 새로 제출해주세요
          </p>
        </div>

        {/* 종료 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-center">
          <Btn
            onClick={handleClose}
            variant="primary"
            size="lg"
          >
            종료하기
          </Btn>
        </div>
      </div>
    );
  }

  // 입력 화면
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <div className="h-12 bg-white flex items-center justify-center">
        <h1 className="text-title text-gray-950">면접 가능 시간</h1>
      </div>

      {/* 안내 문구 박스 */}
      <div className="bg-blue-50 h-[98px] flex items-center px-4">
        <p className="text-body-sm-rg text-gray-950 whitespace-pre-line">
          {guidanceText}
        </p>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto pb-[77px]">
        {/* 이름 입력 */}
        <div className="px-4 pt-5 pb-2.5">
          <label className="block text-subtitle-sm-md text-gray-950 mb-2">
            이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요."
            className="w-full h-[50px] bg-white border border-gray-100 rounded-[5px] px-[15px] text-body-rg text-gray-950 placeholder:text-gray-300 focus:outline-none focus:border-primary"
          />
        </div>

        {/* 전화번호 입력 */}
        <div className="px-4 pb-5">
          <label className="block text-subtitle-sm-md text-gray-950 mb-2">
            전화번호
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="전화번호를 입력해주세요."
            className="w-full h-[50px] bg-white border border-gray-100 rounded-[5px] px-[15px] text-body-rg text-gray-950 placeholder:text-gray-300 focus:outline-none focus:border-primary"
          />
        </div>

        {/* 면접 가능 시간 선택 */}
        <div className="px-4 pb-5">
          <h2 className="text-subtitle-sm-md text-gray-950 mb-2.5">
            면접 가능 시간 선택
          </h2>

          {/* 드롭다운 리스트 */}
          <div className="space-y-0">
            {Object.entries(timeSlotsByDate).map(([date, times]) => {
              const isExpanded = expandedDates.has(date);
              return (
                <div key={date}>
                  {/* 날짜 헤더 */}
                  <button
                    onClick={() => toggleDate(date)}
                    className={`w-full h-[50px] flex items-center justify-between px-[26px] border-b border-gray-100 ${
                      isExpanded ? 'bg-blue-50' : 'bg-white'
                    }`}
                  >
                    <span className="text-subtitle-sm-md text-gray-950">{date}</span>
                    <div className="w-[31px] h-[31px] flex items-center justify-center">
                      <Image 
                        src="/icons/dropdown-down.svg" 
                        alt="" 
                        width={31} 
                        height={31}
                        className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  {/* 시간 선택 (펼쳐진 경우) */}
                  {isExpanded && (
                    <div className="bg-white px-4 py-4 border-b border-gray-100">
                      <div className="grid grid-cols-4 gap-2">
                        {times.map((time) => {
                          const key = `${date}-${time}`;
                          const isSelected = selectedSlots[key] || false;

                          return (
                            <button
                              key={key}
                              onClick={() => handleTimeSlotToggle(date, time)}
                              className={`
                                h-9 rounded-[5px] border text-body-sm-rg
                                transition-all duration-200
                                ${
                                  isSelected
                                    ? 'bg-white text-primary border-primary'
                                    : 'bg-white text-gray-950 border-gray-200'
                                }
                              `}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-center">
        <Btn
          onClick={handleSubmit}
          disabled={!name || !phone || Object.values(selectedSlots).filter(Boolean).length === 0}
          variant="primary"
          size="lg"
        >
          제출하기
        </Btn>
      </div>
    </div>
  );
}
