'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Toggle from './Toggle';
import Btn from './Btn';
import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { useNewProjectStore } from '@/store/newProjectStore';
import { projectService } from '@/services/projectService';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ScheduleState {
  [key: string]: boolean;
}

export default function ApplicantInterviewSchedule() {
  const router = useRouter();
  const [isRecruiting, setIsRecruiting] = useState(true);
  const [guidance, setGuidance] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<ScheduleState>(() => {
    // localStorage에서 초기값 로드
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('applicantInterviewSlots');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return {};
        }
      }
    }
    return {};
  });
  const [isFocused, setIsFocused] = useState(false);
  
  const projectId = useCurrentProjectStore(s => s.projectId);
  const setProjectId = useCurrentProjectStore(s => s.setProjectId);
  const createdProjectId = useNewProjectStore(s => s.createdProjectId);
  const [interviewSetting, setInterviewSetting] = useState<any>(null);

  // 프로젝트 ID 초기화
  useEffect(() => {
    const initializeProjectId = async () => {
      if (projectId) return;
      
      if (createdProjectId) {
        setProjectId(createdProjectId);
        return;
      }
      
      try {
        const projects = await projectService.getProjects();
        if (projects.length > 0) {
          setProjectId(projects[0].id);
        }
      } catch (error) {
        console.error('프로젝트 목록 조회 실패:', error);
      }
    };
    
    initializeProjectId();
  }, []);

  // 면접 설정 조회
  useEffect(() => {
    const fetchInterviewSetting = async () => {
      if (!projectId) return;
      
      try {
        const setting = await projectService.getInterviewSetting(projectId);
        console.log('[ApplicantInterview] 면접 설정:', setting);
        
        if (setting && setting.startDate && setting.endDate && setting.startTime && setting.endTime) {
          setInterviewSetting(setting);
        }
      } catch (error) {
        console.error('면접 설정 조회 실패:', error);
      }
    };
    
    fetchInterviewSetting();
  }, [projectId]);

  // 지원자 링크 설정 불러오기
  useEffect(() => {
    const fetchApplicantConfig = async () => {
      if (!projectId) return;
      
      try {
        const config = await projectService.getApplicantLinkConfig(projectId);
        console.log('[ApplicantInterview] 지원자 링크 설정:', config);
        
        if (config) {
          if (config.enabled !== undefined) {
            setIsRecruiting(config.enabled);
          }
          if (config.guidanceText !== undefined && config.guidanceText !== null) {
            setGuidance(config.guidanceText);
          }
        }
      } catch (error) {
        console.log('지원자 링크 설정 조회 실패 (미설정일 수 있음):', error);
      }
    };
    
    fetchApplicantConfig();
  }, [projectId]);

  // selectedSlots 변경 시 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(selectedSlots).length > 0) {
      localStorage.setItem('applicantInterviewSlots', JSON.stringify(selectedSlots));
    }
  }, [selectedSlots]);

  // 면접 시간 데이터 동적 생성
  const timeSlotsByDate: Record<string, string[]> = useMemo(() => {
    if (!interviewSetting) {
      return {};
    }

    const result: Record<string, string[]> = {};
    const startDate = new Date(interviewSetting.startDate);
    const endDate = new Date(interviewSetting.endDate);
    
    // 시작 시간과 종료 시간 파싱
    const [startHour, startMin] = interviewSetting.startTime.split(':').map(Number);
    const [endHour, endMin] = interviewSetting.endTime.split(':').map(Number);
    
    // 날짜별로 순회
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = format(d, 'M월 d일 (E)', { locale: ko });
      const times: string[] = [];
      
      // 30분 단위로 시간 생성
      // 종료 시간이 :00이면 그 시간대는 포함하지 않음 (ex. 18:00 종료 -> 17:30까지)
      // 종료 시간이 :30이면 :00까지 포함 (ex. 18:30 종료 -> 18:00까지)
      let currentHour = startHour;
      let currentMin = startMin;
      
      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        times.push(`${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`);
        
        currentMin += 30;
        if (currentMin >= 60) {
          currentMin = 0;
          currentHour += 1;
        }
      }
      
      result[dateKey] = times;
    }
    
    return result;
  }, [interviewSetting]);

  const handleTimeSlotToggle = (date: string, time: string) => {
    const key = `${date}-${time}`;
    setSelectedSlots((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    if (!projectId) {
      alert('프로젝트가 선택되지 않았습니다.');
      return;
    }

    try {
      // API로 설정 저장
      await projectService.updateApplicantLinkConfig(projectId, {
        enabled: isRecruiting,
        guidanceText: guidance,
      });

      const selected = Object.entries(selectedSlots)
        .filter(([_, isSelected]) => isSelected)
        .map(([key]) => key);

      console.log('[ApplicantInterview] 저장 완료');
      console.log('Guidance:', guidance);
      console.log('Selected Slots:', selected);

      // 스마트 시간표 페이지로 이동
      router.push('/smart-schedule');
    } catch (error) {
      console.error('지원자 링크 설정 저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
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
          </div>
        </div>

        {/* 면접 가능 시간 섹션 */}
        <div className="space-y-4">
          <h2 className="text-subtitle-sm-sb text-gray-950">
            면접 가능 시간
          </h2>

          {!interviewSetting ? (
            <div className="text-center py-8 text-body-sm text-gray-300">
              면접 설정 정보를 불러오는 중...
            </div>
          ) : Object.keys(timeSlotsByDate).length === 0 ? (
            <div className="text-center py-8 text-body-sm text-gray-300">
              면접 정보 설정 후 이용 가능합니다.
            </div>
          ) : (
            Object.entries(timeSlotsByDate).map(([date, times]) => (
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
            ))
          )}
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
