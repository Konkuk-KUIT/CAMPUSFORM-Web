'use client';

import React, { useState } from 'react';
import Header from '@/components/ui/Header';
import Navbar from '@/components/Navbar';
import Btn from '@/components/ui/Btn';
import Checkbox from '@/components/ui/Checkbox';

interface InterviewSchedule {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export default function AIInterviewScheduleTableForm() {
  const [schedules, setSchedules] = useState<InterviewSchedule[]>([
    {
      id: '1',
      candidateName: '김철수',
      position: '개발자',
      date: '2024-02-15',
      time: '14:00',
      interviewer: '이영희',
      status: 'scheduled',
      notes: '온라인 면접',
    },
    {
      id: '2',
      candidateName: '박영희',
      position: 'UI/UX 디자이너',
      date: '2024-02-16',
      time: '10:00',
      interviewer: '김철수',
      status: 'scheduled',
      notes: '오프라인 면접',
    },
    {
      id: '3',
      candidateName: '이순신',
      position: '개발자',
      date: '2024-02-10',
      time: '15:00',
      interviewer: '박민준',
      status: 'completed',
      notes: '합격 예정',
    },
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredSchedules = schedules.filter(s => (filterStatus === 'all' ? true : s.status === filterStatus));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredSchedules.map(s => s.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-600',
      completed: 'bg-point-green bg-opacity-20 text-point-green',
      cancelled: 'bg-point-red bg-opacity-20 text-point-red',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      scheduled: '예정됨',
      completed: '완료됨',
      cancelled: '취소됨',
    };
    return labels[status] || status;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="AI 면접 시간표" />
      <div className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        <h1 className="text-title text-gray-950">AI 면접 시간표</h1>
        <p className="text-text-14 text-gray-500 mt-2 mb-6">전체 면접 일정을 한눈에 관리하세요</p>

        {/* 필터 및 액션 바 */}
        <div className="bg-white rounded-radius-8 p-4 shadow-sm mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex gap-2">
              {['all', 'scheduled', 'completed', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 text-text-12 rounded-radius-5 transition-colors ${
                    filterStatus === status ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all'
                    ? '전체'
                    : status === 'scheduled'
                      ? '예정'
                      : status === 'completed'
                        ? '완료'
                        : '취소'}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Btn variant="outline" size="sm">
                엑셀 다운로드
              </Btn>
              <Btn variant="primary" size="sm">
                + 새 일정
              </Btn>
            </div>
          </div>
        </div>

        {/* 테이블 */}
        <div className="bg-white rounded-radius-8 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-text-12">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left w-12">
                    <Checkbox
                      checked={selectedItems.length === filteredSchedules.length && filteredSchedules.length > 0}
                      onChange={checked => handleSelectAll(checked)}
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">지원자</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">직무</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">날짜</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">시간</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">면접관</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">상태</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">비고</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map(schedule => (
                  <tr key={schedule.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedItems.includes(schedule.id)}
                        onChange={checked => handleSelectItem(schedule.id, checked)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{schedule.candidateName}</td>
                    <td className="px-4 py-3 text-gray-700">{schedule.position}</td>
                    <td className="px-4 py-3 text-gray-700">{schedule.date}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{schedule.time}</td>
                    <td className="px-4 py-3 text-gray-700">{schedule.interviewer}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-text-11 font-semibold rounded-radius-5 ${getStatusColor(schedule.status)}`}
                      >
                        {getStatusLabel(schedule.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{schedule.notes || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-blue-500 hover:text-blue-700 font-semibold text-text-11">수정</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSchedules.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-text-14">일정이 없습니다</p>
            </div>
          )}
        </div>

        {/* 일괄 작업 바 */}
        {selectedItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <p className="text-text-12 text-gray-700">
                <span className="font-semibold text-gray-950">{selectedItems.length}개</span> 항목 선택
              </p>
              <div className="flex gap-2">
                <Btn variant="outline" size="sm">
                  일괄 삭제
                </Btn>
                <Btn variant="primary" size="sm">
                  일괄 수정
                </Btn>
              </div>
            </div>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
}
