'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Header from '@/components/ui/Header';
import Navbar from '@/components/Navbar';
import Btn from '@/components/ui/Btn';
import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { projectService } from '@/services/projectService';
import { authService } from '@/services/authService';
import { toast } from '@/components/Toast';

interface DateAvailability {
  date: string; // "2026-02-17"
  startTimes: string[]; // ["09:00", "10:00"]
}

export default function InterviewerAvailabilityForm() {
  const projectId = useCurrentProjectStore(s => s.projectId);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [interviewDates, setInterviewDates] = useState<string[]>([]);
  const [availability, setAvailability] = useState<DateAvailability[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 현재 로그인 사용자 adminId 조회
  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const response = await authService.getCurrentUser();
        console.log('[InterviewerAvailability] 현재 사용자:', response);
        if (response.isAuthenticated && response.user) {
          setAdminId(response.user.userId);
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    };
    fetchAdminId();
  }, []);

  // 면접 설정 조회 (날짜 및 시간 범위)
  useEffect(() => {
    const fetchInterviewSetting = async () => {
      if (!projectId) return;
      
      try {
        const setting = await projectService.getInterviewSetting(projectId);
        console.log('[InterviewerAvailability] 면접 설정:', setting);
        
        if (setting && setting.interviewDates && Array.isArray(setting.interviewDates)) {
          setInterviewDates(setting.interviewDates);
          
          // 빈 availability 초기화
          const initialAvailability = setting.interviewDates.map((date: string) => ({
            date,
            startTimes: []
          }));
          setAvailability(initialAvailability);
          
          // 시간 슬롯 생성 (30분 단위)
          if (setting.startTime && setting.endTime) {
            const [startHour, startMin] = setting.startTime.split(':').map(Number);
            const [endHour, endMin] = setting.endTime.split(':').map(Number);
            const slots: string[] = [];
            
            let currentHour = startHour;
            let currentMin = startMin;
            
            while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
              slots.push(`${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`);
              currentMin += 30;
              if (currentMin >= 60) {
                currentMin = 0;
                currentHour += 1;
              }
            }
            
            setTimeSlots(slots);
          }
        }
      } catch (error) {
        console.error('면접 설정 조회 실패:', error);
      }
    };
    
    fetchInterviewSetting();
  }, [projectId]);

  // 기존 가능 시간 불러오기
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!projectId || !adminId) return;
      
      try {
        const data = await projectService.getInterviewerAvailability(projectId, adminId);
        console.log('[InterviewerAvailability] 기존 가능 시간:', data);
        
        if (data && data.availabilities && Array.isArray(data.availabilities)) {
          setAvailability(data.availabilities);
        }
      } catch (error) {
        console.log('기존 가능 시간 조회 실패 (미등록일 수 있음):', error);
      }
    };
    
    fetchAvailability();
  }, [projectId, adminId]);

  const handleTimeToggle = (date: string, time: string) => {
    setAvailability(prev =>
      prev.map(item => {
        if (item.date === date) {
          const times = item.startTimes || [];
          return {
            ...item,
            startTimes: times.includes(time) 
              ? times.filter(t => t !== time) 
              : [...times, time].sort(),
          };
        }
        return item;
      })
    );
  };

  const handleSave = async () => {
    if (!projectId || !adminId) {
      toast.error('프로젝트 또는 사용자 정보가 없습니다');
      return;
    }
    
    setLoading(true);
    
    try {
      await projectService.updateInterviewerAvailability(projectId, adminId, {
        availabilities: availability
      });
      
      console.log('[InterviewerAvailability] 저장 성공:', availability);
      toast.success('면접관 가능 시간이 저장되었습니다');
    } catch (error) {
      console.error('저장 실패:', error);
      toast.error('저장에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="면접관 가능 시간 등록" backTo={projectId ? `/smart-schedule/${projectId}` : '/smart-schedule'} />
      <div className="flex-1 px-6 py-8 pb-32">
        <h1 className="text-title text-gray-950">면접관 가능 시간 등록</h1>
        <p className="text-body-sm text-gray-500 mt-2 mb-6">면접 가능한 날짜와 시간을 선택하세요</p>

        {interviewDates.length === 0 ? (
          <div className="text-center py-12 text-body-sm text-gray-300">
            면접 정보를 먼저 설정해주세요
          </div>
        ) : (
          <div className="space-y-6">
            {availability.map((dateAvail, index) => {
              const d = new Date(dateAvail.date);
              const dateLabel = format(d, 'M월 d일 (E)', { locale: ko });
              
              return (
                <div key={dateAvail.date} className="bg-white rounded-10 p-6 shadow-sm">
                  <h2 className="text-subtitle-sm-sb text-gray-950 mb-4">{dateLabel}</h2>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(time => {
                      const isSelected = dateAvail.startTimes.includes(time);
                      
                      return (
                        <button
                          key={time}
                          onClick={() => handleTimeToggle(dateAvail.date, time)}
                          className={`py-2 px-3 rounded-5 text-body-sm-rg font-medium transition-all ${
                            isSelected 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 저장 버튼 */}
      <div className="fixed bottom-16 left-0 right-0 px-5 py-3 bg-white border-t border-gray-100">
        <Btn
          variant="primary"
          size="lg"
          className="w-full max-w-93.75 mx-auto"
          onClick={handleSave}
          disabled={loading || interviewDates.length === 0}
        >
          {loading ? '저장 중...' : '저장하기'}
        </Btn>
      </div>

      <Navbar />
    </div>
  );
}
