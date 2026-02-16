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
  const [slotsSummaries, setSlotsSummaries] = useState<any[]>([]);
  const [token, setToken] = useState<string>('');

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

  // 토큰 조회
  useEffect(() => {
    const fetchToken = async () => {
      if (!projectId) return;
      
      try {
        const linkData = await projectService.getInvestigationLink(projectId);
        console.log('[ApplicantInterview] Investigation Link:', linkData);
        
        // 토큰 추출
        const link = linkData?.link || linkData?.url;
        if (link) {
          const url = new URL(link, window.location.origin);
          const tokenParam = url.searchParams.get('token');
          if (tokenParam) {
            setToken(tokenParam);
            console.log('[ApplicantInterview] 토큰:', tokenParam);
          }
        }
      } catch (error) {
        console.log('[ApplicantInterview] 토큰 조회 실패:', error);
      }
    };
    
    fetchToken();
  }, [projectId]);

  // 면접 슬롯 조회 (공개 API)
  useEffect(() => {
    const fetchInterviewSlots = async () => {
      if (!token) return;
      
      try {
        // 공개 API로 슬롯 조회
        const slotsData = await projectService.getPublicInterviewSlots(token);
        console.log('[ApplicantInterview] 공개 슬롯 API 응답:', JSON.stringify(slotsData, null, 2));
        
        if (slotsData && slotsData.summaries && Array.isArray(slotsData.summaries)) {
          setSlotsSummaries(slotsData.summaries);
          
          // 날짜 정보 추출
          const dates = slotsData.summaries.map((s: any) => s.date).filter(Boolean);
          
          if (dates.length > 0) {
            const setting = {
              interviewDates: dates,
            };
            setInterviewSetting(setting);
          }
        }
      } catch (error) {
        console.error('면접 슬롯 조회 실패:', error);
      }
    };
    
    fetchInterviewSlots();
  }, [token]);

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

  // 면접 시간 데이터 (API 슬롯만 사용)
  const timeSlotsByDate: Record<string, string[]> = useMemo(() => {
    console.log('[ApplicantInterview] timeSlotsByDate 생성 - slotsSummaries:', slotsSummaries);
    
    if (slotsSummaries.length === 0) {
      console.log('[ApplicantInterview] slotsSummaries가 비어있음');
      return {};
    }

    const result: Record<string, string[]> = {};
    
    // API에서 받은 summaries의 slots만 사용
    slotsSummaries.forEach((summary: any, index: number) => {
      console.log(`[ApplicantInterview] summary[${index}]:`, summary);
      
      if (summary.date && summary.slots && Array.isArray(summary.slots) && summary.slots.length > 0) {
        const d = new Date(summary.date);
        const dateKey = format(d, 'M월 d일 (E)', { locale: ko });
        
        console.log(`[ApplicantInterview] ${dateKey} - slots 개수: ${summary.slots.length}`);
        
        const times = summary.slots
          .map((slot: any) => {
            console.log('[ApplicantInterview] slot:', slot);
            return slot.startTime.substring(0, 5); // 초 제거
          })
          .filter((time: string) => !!time);
        
        console.log(`[ApplicantInterview] ${dateKey} - 추출된 시간들:`, times);
        
        if (times.length > 0) {
          result[dateKey] = times;
        }
      }
    });
    
    console.log('[ApplicantInterview] 최종 timeSlotsByDate:', result);
    return result;
  }, [slotsSummaries]);

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
      if (projectId) {
        router.push(`/smart-schedule/${projectId}`);
      }
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
                      <div
                        key={key}
                        className={`
                          py-2 px-3 rounded-[5px] border text-body-sm-rg
                          flex items-center justify-center
                          pointer-events-none
                          ${
                            isSelected
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-950 border-gray-200'
                          }
                        `}
                      >
                        {time}
                      </div>
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
