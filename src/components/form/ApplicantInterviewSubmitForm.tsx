'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Btn from '@/components/ui/Btn';
import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { useNewProjectStore } from '@/store/newProjectStore';
import { projectService } from '@/services/projectService';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ScheduleState {
  [key: string]: boolean;
}

export default function ApplicantInterviewSubmitForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // URL에서 token 파라미터 가져오기
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<ScheduleState>({});
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 개발/테스트 모드를 위한 projectId (token이 없을 때만 사용)
  const projectId = useCurrentProjectStore(s => s.projectId);
  const setProjectId = useCurrentProjectStore(s => s.setProjectId);
  const createdProjectId = useNewProjectStore(s => s.createdProjectId);
  const [interviewSetting, setInterviewSetting] = useState<any>(null);
  const [guidanceText, setGuidanceText] = useState('');


  // 프로젝트 ID 초기화 (token이 없을 때만)
  useEffect(() => {
    const initializeProjectId = async () => {
      if (token || projectId) return; // token이 있거나 projectId가 있으면 스킵
      
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
  }, [token]);

  // 면접 설정 조회 (공개 API 사용)
  useEffect(() => {
    const fetchInterviewSetting = async () => {
      if (token) {
        // token이 있으면 공개 API 사용
        try {
          const slotsData = await projectService.getPublicInterviewSlots(token);
          console.log('[ApplicantSubmit] 공개 면접 슬롯 전체 응답:', JSON.stringify(slotsData, null, 2));
          
          if (!slotsData) {
            console.error('[ApplicantSubmit] API 응답이 비어있음');
            return;
          }
          
          // API 응답에서 면접 설정 정보 추출
          if (slotsData.summaries && Array.isArray(slotsData.summaries) && slotsData.summaries.length > 0) {
            // summaries에서 날짜와 시간 정보 추출
            const dates = slotsData.summaries.map((s: any) => s.date).filter(Boolean);
            const allSlots = slotsData.summaries.flatMap((s: any) => s.slots || []);
            
            if (dates.length > 0 && allSlots.length > 0) {
              const startDate = dates[0];
              const endDate = dates[dates.length - 1];
              
              // 모든 시간대 추출
              const times = allSlots.map((slot: any) => slot.startTime).filter(Boolean);
              const startTime = times.length > 0 ? times[0] : '09:00';
              const endTime = times.length > 0 ? times[times.length - 1] : '18:00';
              
              console.log('[ApplicantSubmit] 추출된 설정:', { startDate, endDate, startTime, endTime });
              
              setInterviewSetting({
                startDate,
                endDate,
                startTime,
                endTime,
                slotDurationMin: 30 // 기본값
              });
            } else {
              console.warn('[ApplicantSubmit] 날짜 또는 슬롯 데이터가 없음:', { dates, allSlots });
            }
            
            // 안내 문구 (있다면)
            if (slotsData.guidanceText) {
              setGuidanceText(slotsData.guidanceText);
            }
          } else {
            console.warn('[ApplicantSubmit] summaries 구조가 없거나 비어있음. 응답 구조:', Object.keys(slotsData));
          }
        } catch (error) {
          console.error('[ApplicantSubmit] 공개 면접 슬롯 조회 실패:', error);
        }
      } else if (projectId) {
        // token이 없으면 개발 모드 (기존 방식)
        try {
          const setting = await projectService.getInterviewSetting(projectId);
          console.log('[ApplicantSubmit] 면접 설정:', setting);
          
          if (setting && setting.startDate && setting.endDate && setting.startTime && setting.endTime) {
            setInterviewSetting(setting);
          }
        } catch (error) {
          console.error('면접 설정 조회 실패:', error);
        }
      }
    };
    
    fetchInterviewSetting();
  }, [token, projectId]);

  // 지원자 링크 설정 조회 (안내 문구) - token이 없을 때만
  useEffect(() => {
    const fetchApplicantConfig = async () => {
      if (token || !projectId) return;
      
      try {
        const config = await projectService.getApplicantLinkConfig(projectId);
        console.log('[ApplicantSubmit] 지원자 링크 설정:', config);
        
        if (config && config.guidanceText !== undefined && config.guidanceText !== null) {
          setGuidanceText(config.guidanceText);
        }
      } catch (error) {
        console.log('지원자 링크 설정 조회 실패 (미설정일 수 있음):', error);
      }
    };
    
    fetchApplicantConfig();
  }, [token, projectId]);

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
    setSelectedSlots(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async () => {
    if (!interviewSetting) {
      alert('면접 정보를 불러오는 중입니다. 잠시만 기다려주세요.');
      return;
    }

    if (!token && !projectId) {
      alert('유효하지 않은 접근입니다.');
      return;
    }

    const selected = Object.entries(selectedSlots)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key);

    console.log('[ApplicantSubmit] Name:', name);
    console.log('[ApplicantSubmit] Phone:', phone);
    console.log('[ApplicantSubmit] Selected Slots:', selected);

    // selected 형식: ["2월 17일 (금)-09:00", "2월 17일 (금)-09:30", ...]
    // API 형식으로 변환: { date: "2026-02-17", startTimes: ["09:00", "09:30"] }
    
    // 날짜별로 시간을 그룹화
    const groupedByDate: { [isoDate: string]: string[] } = {};
    const startDate = new Date(interviewSetting.startDate);
    const endDate = new Date(interviewSetting.endDate);
    
    // 날짜 매핑 생성 (한글 날짜 -> ISO 날짜)
    const dateMapping: { [koreanDate: string]: string } = {};
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const isoDate = format(d, 'yyyy-MM-dd');
      const koreanDate = format(d, 'M월 d일 (E)', { locale: ko });
      dateMapping[koreanDate] = isoDate;
    }

    selected.forEach(slot => {
      const [dateStr, time] = slot.split('-');
      const isoDate = dateMapping[dateStr];
      
      if (isoDate) {
        if (!groupedByDate[isoDate]) {
          groupedByDate[isoDate] = [];
        }
        groupedByDate[isoDate].push(time);
      }
    });

    // availabilities 배열 생성
    const availabilities = Object.entries(groupedByDate).map(([date, startTimes]) => ({
      date,
      startTimes: startTimes.sort(), // 시간순 정렬
    }));

    console.log('[ApplicantSubmit] 변환된 availabilities:', availabilities);

    try {
      if (token) {
        // 공개 API로 제출
        await projectService.submitApplicantAvailability(token, {
          name,
          phoneNumber: phone,
          availabilities,
        });
        console.log('[ApplicantSubmit] 제출 완료 (공개 API)');
      } else {
        // 개발 모드 - 콘솔에만 출력
        console.log('[ApplicantSubmit] 제출 데이터 (개발 모드):', {
          name,
          phoneNumber: phone,
          availabilities,
        });
        console.warn('[ApplicantSubmit] 개발 모드: token이 필요합니다.');
      }
      
      // 제출 완료 상태로 전환
      setIsSubmitted(true);
    } catch (error) {
      console.error('[ApplicantSubmit] 제출 실패:', error);
      alert('제출에 실패했습니다. 다시 시도해주세요.');
    }
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
          <h2 className="text-subtitle-sb text-gray-950 mb-2 text-center">면접 가능 시간 제출이 완료되었습니다.</h2>
          <p className="text-body-rg text-gray-400 text-center mb-1">
            제출하신 시간을 바탕으로 면접 일정을 알려져 이후
          </p>
          <p className="text-body-rg text-gray-400 text-center mb-6">개별 안내드리겠습니다.</p>
          <p className="text-body-sm text-gray-400 text-center">*시간 변경을 원할 시, 품을 새로 제출해주세요</p>
        </div>

        {/* 종료 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-center">
          <Btn onClick={handleClose} variant="primary" size="lg">
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
      {guidanceText && (
        <div className="bg-blue-50 min-h-[98px] flex items-center px-4 py-4">
          <p className="text-body-sm-rg text-gray-950 whitespace-pre-line">{guidanceText}</p>
        </div>
      )}

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto pb-[77px]">
        {/* 이름 입력 */}
        <div className="px-4 pt-5 pb-2.5">
          <label className="block text-subtitle-sm-md text-gray-950 mb-2">이름</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="이름을 입력해주세요."
            className="w-full h-[50px] bg-white border border-gray-100 rounded-[5px] px-[15px] text-body-rg text-gray-950 placeholder:text-gray-300 focus:outline-none focus:border-primary"
          />
        </div>

        {/* 전화번호 입력 */}
        <div className="px-4 pb-5">
          <label className="block text-subtitle-sm-md text-gray-950 mb-2">전화번호</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="전화번호를 입력해주세요."
            className="w-full h-[50px] bg-white border border-gray-100 rounded-[5px] px-[15px] text-body-rg text-gray-950 placeholder:text-gray-300 focus:outline-none focus:border-primary"
          />
        </div>

        {/* 면접 가능 시간 선택 */}
        <div className="px-4 pb-5">
          <h2 className="text-subtitle-sm-md text-gray-950 mb-2.5">면접 가능 시간 선택</h2>

          {!interviewSetting ? (
            <div className="text-center py-8 text-body-sm text-gray-300">
              면접 설정 정보를 불러오는 중...
            </div>
          ) : Object.keys(timeSlotsByDate).length === 0 ? (
            <div className="text-center py-8 text-body-sm text-gray-300">
              면접 정보 설정 후 이용 가능합니다.
            </div>
          ) : (
            /* 드롭다운 리스트 */
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
                          {times.map(time => {
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
          )}
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
