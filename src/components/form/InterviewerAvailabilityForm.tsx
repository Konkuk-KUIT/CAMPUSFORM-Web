'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import Btn from '@/components/Btn';

interface InterviewerAvailability {
  id: string;
  name: string;
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  maxInterviewsPerDay: number;
}

export default function InterviewerAvailabilityForm() {
  const [availability, setAvailability] = useState<InterviewerAvailability[]>([
    {
      id: '1',
      name: '김철수',
      monday: ['09:00', '10:00', '14:00', '15:00', '16:00'],
      tuesday: ['10:00', '11:00', '14:00', '15:00'],
      wednesday: ['09:00', '10:00', '11:00', '13:00', '14:00'],
      thursday: ['09:00', '10:00', '15:00', '16:00'],
      friday: ['10:00', '11:00', '13:00', '14:00', '15:00'],
      maxInterviewsPerDay: 3,
    },
    {
      id: '2',
      name: '이영희',
      monday: ['10:00', '11:00', '14:00', '16:00'],
      tuesday: ['09:00', '10:00', '11:00', '15:00', '16:00'],
      wednesday: ['14:00', '15:00', '16:00'],
      thursday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      friday: ['09:00', '10:00', '14:00'],
      maxInterviewsPerDay: 4,
    },
  ]);

  const days = [
    { key: 'monday', label: '월요일' },
    { key: 'tuesday', label: '화요일' },
    { key: 'wednesday', label: '수요일' },
    { key: 'thursday', label: '목요일' },
    { key: 'friday', label: '금요일' },
  ];

  const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  const handleTimeToggle = (interviewerId: string, day: string, time: string) => {
    setAvailability(prev => 
      prev.map(interviewer => {
        if (interviewer.id === interviewerId) {
          const dayKey = day as keyof InterviewerAvailability;
          const times = interviewer[dayKey] as string[];
          return {
            ...interviewer,
            [day]: times.includes(time) 
              ? times.filter(t => t !== time)
              : [...times, time].sort()
          };
        }
        return interviewer;
      })
    );
  };

  const handleSave = () => {
    console.log('면접관 가용 시간 저장:', availability);
    alert('면접관 일정이 저장되었습니다');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="면접관 일정 관리" />
      <div className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        <h1 className="text-title text-gray-950">면접관 일정 관리</h1>
        <p className="text-text-14 text-gray-500 mt-2 mb-6">면접관별 가용 시간을 설정하세요</p>

        <div className="space-y-6">
          {availability.map((interviewer) => (
            <div key={interviewer.id} className="bg-white rounded-radius-8 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-subtitle-sb text-gray-950">{interviewer.name}</h2>
                  <p className="text-text-12 text-gray-500 mt-1">최대 면접: 1일 {interviewer.maxInterviewsPerDay}회</p>
                </div>
                <button className="text-text-12 text-blue-500 hover:text-blue-700 font-semibold">일정 편집</button>
              </div>

              {/* 주간 시간표 */}
              <div className="overflow-x-auto">
                <table className="w-full text-text-12">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">시간</th>
                      {days.map(day => (
                        <th key={day.key} className="px-3 py-2 text-center font-semibold text-gray-700">
                          {day.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map(time => (
                      <tr key={time} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-900">{time}</td>
                        {days.map(day => {
                          const dayKey = day.key as keyof InterviewerAvailability;
                          const times = interviewer[dayKey] as string[];
                          const isAvailable = times.includes(time);
                          
                          return (
                            <td key={day.key} className="px-3 py-2 text-center">
                              <button
                                onClick={() => handleTimeToggle(interviewer.id, day.key, time)}
                                className={`px-2 py-1 rounded-radius-5 text-text-11 font-semibold transition-colors ${
                                  isAvailable
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                              >
                                {isAvailable ? '✓' : '-'}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 요약 */}
              <div className="mt-4 flex flex-wrap gap-4">
                {days.map(day => {
                  const dayKey = day.key as keyof InterviewerAvailability;
                  const times = interviewer[dayKey] as string[];
                  return (
                    <div key={day.key} className="text-text-11">
                      <span className="font-semibold text-gray-700">{day.label}:</span>
                      <span className="text-gray-600 ml-2">
                        {times.length > 0 ? `${times.length}개` : '없음'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2 justify-end mt-8">
          <Btn variant="outline" size="md">취소</Btn>
          <Btn variant="primary" size="md" onClick={handleSave}>저장</Btn>
        </div>

        {/* 안내 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-radius-8 p-4">
          <p className="text-text-12 text-gray-700">
            <span className="font-semibold text-gray-950">📋 설명:</span> 각 면접관의 주간 가용 시간을 설정하면, 지원자들이 자동으로 가능한 시간대를 선택할 수 있습니다. 시간을 클릭하여 활성화/비활성화할 수 있습니다.
          </p>
        </div>
      </div>
      <Navbar />
    </div>
  );
}
