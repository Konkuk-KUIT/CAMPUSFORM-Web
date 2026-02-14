'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Btn from '@/components/ui/Btn';
import ConfirmResetDialog from '@/components/ui/ConfirmResetDialog';
import AllAccordion from '@/components/ui/AllAccordion';
import SmartScheduleButton from '@/components/ui/SmartScheduleButton';
import SmartScheduleCalendarPreview from '@/components/ui/SmartScheduleCalendarPreview';
import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { useNewProjectStore } from '@/store/newProjectStore';
import { projectService } from '@/services/projectService';
import { authService } from '@/services/authService';
import type { ProjectAdminRaw } from '@/types/project';

export default function SmartScheduleMainForm() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const handleConfirm = () => {
    setShowConfirmDialog(false);
    router.push('/smart-schedule/result');
  };
  const [mounted, setMounted] = useState(false);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const router = useRouter();
  const projectId = useCurrentProjectStore(s => s.projectId);
  const setProjectId = useCurrentProjectStore(s => s.setProjectId);
  const createdProjectId = useNewProjectStore(s => s.createdProjectId);
  
  // 면접 설정 정보 state
  const [interviewSetting, setInterviewSetting] = useState<{
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    slotDurationMin: number;
  } | null>(null);
  
  // useEffect to set mounted true after client hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // projectId 초기화
  useEffect(() => {
    const initializeProjectId = async () => {
      console.log('[SmartSchedule] 초기 projectId:', projectId);
      console.log('[SmartSchedule] createdProjectId:', createdProjectId);
      
      // 이미 projectId가 있으면 사용
      if (projectId) {
        return;
      }
      
      // 방금 생성한 프로젝트 ID가 있으면 사용
      if (createdProjectId) {
        console.log('[SmartSchedule] createdProjectId 설정:', createdProjectId);
        setProjectId(createdProjectId);
        return;
      }
      
      // 프로젝트 목록에서 가져오기
      try {
        const projects = await projectService.getProjects();
        if (projects.length > 0) {
          console.log('[SmartSchedule] 첫 번째 프로젝트 사용:', projects[0].id);
          setProjectId(projects[0].id);
        }
      } catch (error) {
        console.error('[SmartSchedule] 프로젝트 목록 조회 실패:', error);
      }
    };
    
    initializeProjectId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 면접 정보 설정 조회 및 저장
  useEffect(() => {
    const checkInterviewSetting = async () => {
      if (!projectId) {
        console.log('[SmartSchedule] projectId 없음 - 오버레이 표시');
        return;
      }
      
      try {
        const setting = await projectService.getInterviewSetting(projectId);
        console.log('[SmartSchedule] 면접 설정 API 응답:', setting);
        
        // 실제로 면접 정보가 설정되어 있는지 검증
        const isValid = setting && 
                       setting.startDate && 
                       setting.endDate && 
                       setting.startTime && 
                       setting.endTime;
        
        if (isValid) {
          setInterviewSetting(setting);
          setIsConfigured(true);
          console.log('[SmartSchedule] 면접 정보 설정됨 - 오버레이 숨김');
        } else {
          setInterviewSetting(null);
          setIsConfigured(false);
          console.log('[SmartSchedule] 면접 정보 미설정 - 오버레이 표시');
        }
      } catch (error) {
        console.error('[SmartSchedule] 면접 정보 설정 조회 실패:', error);
        setInterviewSetting(null);
        setIsConfigured(false);
      }
    };
    
    checkInterviewSetting();
  }, [projectId]);

  const [selectedInterviewer, setSelectedInterviewer] = useState<number | null>(null);
  const [requiredInterviewers, setRequiredInterviewers] = useState<{ [key: number]: boolean }>({ 0: true });
  const hasSchedule = true; // 스마트 시간표 생성 여부 (가정)
  const isRepresentative = true; // 대표자 여부 (가정)
  const [showInterviewerView, setShowInterviewerView] = useState(false);

  // 각 면접관별 선택된 시간 상태 (interviewerId -> cellActive)
  const [interviewersCellActive, setInterviewersCellActive] = useState<{ 
    [interviewerId: number]: { [key: string]: { top: boolean; bottom: boolean } } 
  }>(() => {
    // localStorage에서 초기값 로드
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('interviewersCellActive');
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

  // interviewersCellActive 변경 시 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(interviewersCellActive).length > 0) {
      localStorage.setItem('interviewersCellActive', JSON.stringify(interviewersCellActive));
    }
  }, [interviewersCellActive]);

  // 면접관 목록 state
  const [interviewers, setInterviewers] = useState<Array<{ 
    userId: number; 
    name: string; 
    email: string; 
    profileImageUrl?: string; 
    isLeader: boolean;
  }>>([]);

  // 개별 면접관 시간 저장 함수
  const handleSaveInterviewerTime = async (userId: number, interviewerName: string) => {
    if (!projectId) {
      alert('프로젝트가 선택되지 않았습니다.');
      return;
    }

    const cellActive = interviewersCellActive[userId];
    if (!cellActive || Object.keys(cellActive).length === 0) {
      alert('선택된 시간이 없습니다.');
      return;
    }

    // cellActive를 API 형식으로 변환
    const availableSlots: Array<{ date: string; timeIndex: number; half?: 'top' | 'bottom'; isFullTime?: boolean }> = [];
    
    Object.entries(cellActive).forEach(([cellKey, value]) => {
      // cellKey 형식: "2026-02-14-0" (date-timeIndex)
      const parts = cellKey.split('-');
      if (parts.length < 4) return;
      
      const date = `${parts[0]}-${parts[1]}-${parts[2]}`; // "2026-02-14"
      const timeIndex = parseInt(parts[3]); // 0
      
      if (value.top && value.bottom) {
        // 전체 시간 선택
        availableSlots.push({ date, timeIndex, isFullTime: true });
      } else if (value.top) {
        // 상단만 선택
        availableSlots.push({ date, timeIndex, half: 'top' });
      } else if (value.bottom) {
        // 하단만 선택
        availableSlots.push({ date, timeIndex, half: 'bottom' });
      }
    });

    console.log(`[SmartSchedule] ${interviewerName} (${userId}) 저장 데이터:`, availableSlots);

    try {
      await projectService.updateInterviewerAvailability(projectId, userId, { availableSlots });
      alert(`${interviewerName}님의 시간이 저장되었습니다.`);
      
      // 면접관 목록 다시 로드 (participated 업데이트)
      fetchInterviewers();
    } catch (error) {
      console.error('시간 저장 실패:', error);
      alert('시간 저장에 실패했습니다.');
    }
  };

  // 면접관 목록 가져오기 함수
  const fetchInterviewers = async () => {
      if (!projectId) return;
      
      try {
        const auth = await authService.getCurrentUser();
        const { admins } = await projectService.getProjectAdmins(projectId);
        
        const adminList: Array<{ 
          userId: number; 
          name: string; 
          email: string; 
          profileImageUrl?: string; 
          isLeader: boolean;
          participated?: boolean;
        }> = [];
        
        const newInterviewersCellActive: { 
          [interviewerId: number]: { [key: string]: { top: boolean; bottom: boolean } } 
        } = {};
        
        // OWNER 추가 (대표자)
        if (auth.isAuthenticated && auth.user) {
          // OWNER availability 확인
          try {
            const availability = await projectService.getInterviewerAvailability(projectId, auth.user.userId);
            
            // availability를 cellActive 형태로 변환
            if (availability && availability.availabilities && interviewSetting) {
              console.log(`[SmartSchedule] OWNER ${auth.user.userId} API 원본 데이터:`, availability.availabilities);
              const cellActive: { [key: string]: { top: boolean; bottom: boolean } } = {};
              const [startHour] = interviewSetting.startTime.split(':').map(Number);
              
              availability.availabilities.forEach((dayAvail: any) => {
                const date = dayAvail.date; // "2026-02-14"
                dayAvail.startTimes.forEach((startTime: string) => {
                  // startTime: "09:00" 또는 "09:30"
                  const [hour, min] = startTime.split(':').map(Number);
                  const timeIndex = hour - startHour; // 시작 시간으로부터의 시간 차이
                  const cellKey = `${date}-${timeIndex}`;
                  
                  if (!cellActive[cellKey]) {
                    cellActive[cellKey] = { top: false, bottom: false };
                  }
                  
                  // :00 이면 top, :30 이면 bottom
                  if (min === 0) {
                    cellActive[cellKey].top = true;
                  } else if (min === 30) {
                    cellActive[cellKey].bottom = true;
                  }
                });
              });
              
              // cellActive에 데이터가 있으면 저장
              if (Object.keys(cellActive).length > 0) {
                newInterviewersCellActive[auth.user.userId] = cellActive;
              }
              console.log(`[SmartSchedule] OWNER ${auth.user.userId} 변환된 cellActive:`, cellActive);
            }
          } catch (error) {
            console.log('OWNER availability 조회 실패 (미등록일 수 있음)');
          }
          
          adminList.push({
            userId: auth.user.userId,
            name: auth.user.nickname ?? '나(대표)',
            email: auth.user.email ?? '',
            profileImageUrl: auth.user.profileImageUrl ?? '',
            isLeader: true,
          });
        }
        
        // ADMIN 목록 추가 및 availability 확인
        for (const admin of admins) {
          try {
            const availability = await projectService.getInterviewerAvailability(projectId, admin.adminId);
            
            // availability를 cellActive 형태로 변환
            if (availability && availability.availabilities && interviewSetting) {
              console.log(`[SmartSchedule] ADMIN ${admin.adminId} API 원본 데이터:`, availability.availabilities);
              const cellActive: { [key: string]: { top: boolean; bottom: boolean } } = {};
              const [startHour] = interviewSetting.startTime.split(':').map(Number);
              
              availability.availabilities.forEach((dayAvail: any) => {
                const date = dayAvail.date; // "2026-02-14"
                dayAvail.startTimes.forEach((startTime: string) => {
                  // startTime: "09:00" 또는 "09:30"
                  const [hour, min] = startTime.split(':').map(Number);
                  const timeIndex = hour - startHour; // 시작 시간으로부터의 시간 차이
                  const cellKey = `${date}-${timeIndex}`;
                  
                  if (!cellActive[cellKey]) {
                    cellActive[cellKey] = { top: false, bottom: false };
                  }
                  
                  // :00 이면 top, :30 이면 bottom
                  if (min === 0) {
                    cellActive[cellKey].top = true;
                  } else if (min === 30) {
                    cellActive[cellKey].bottom = true;
                  }
                });
              });
              
              // cellActive에 데이터가 있으면 저장
              if (Object.keys(cellActive).length > 0) {
                newInterviewersCellActive[admin.adminId] = cellActive;
              }
              console.log(`[SmartSchedule] ADMIN ${admin.adminId} (${admin.adminName}) 변환된 cellActive:`, cellActive);
            }
          } catch (error) {
            console.log(`ADMIN ${admin.adminName} availability 조회 실패 (미등록일 수 있음)`);
          }
          
          adminList.push({
            userId: admin.adminId,
            name: admin.adminName,
            email: admin.email,
            profileImageUrl: admin.profileImageUrl ?? '',
            isLeader: false,
          });
        }
        
        setInterviewers(adminList);
        
        // API에서 가져온 데이터와 현재 상태를 머지 (사용자가 선택한 데이터 유지)
        setInterviewersCellActive(prev => {
          const merged = { ...prev };
          
          // API 데이터를 추가하되, 이미 있는 데이터는 유지
          Object.entries(newInterviewersCellActive).forEach(([userId, cellActive]) => {
            const userIdNum = parseInt(userId);
            if (!merged[userIdNum] || Object.keys(merged[userIdNum]).length === 0) {
              // 현재 상태에 데이터가 없으면 API 데이터 사용
              merged[userIdNum] = cellActive;
            }
            // 현재 상태에 데이터가 있으면 그대로 유지 (사용자가 선택한 것)
          });
          
          console.log('[SmartSchedule] 머지된 interviewersCellActive:', merged);
          return merged;
        });
      } catch (error) {
        console.error('면접관 목록 조회 실패:', error);
      }
  };

  // 면접관 목록 가져오기
  useEffect(() => {
    fetchInterviewers();
  }, [projectId]);


  const showOverlay = !isConfigured;

  // TODO: 실제 API에서 스마트 시간표 생성 여부와 대표자 여부를 가져와야 함

  // 면접 날짜 배열 생성 (API에서 가져온 startDate ~ endDate)
  const interviewDates = useMemo(() => {
    if (!interviewSetting) return [];
    
    const dates: Date[] = [];
    const start = new Date(interviewSetting.startDate);
    const end = new Date(interviewSetting.endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    return dates;
  }, [interviewSetting]);

  // 시간대 배열 생성 (API에서 가져온 startTime ~ endTime)
  // 각 시간대는 상반부(30분) + 하반부(30분) = 1시간으로 구성
  const timeSlots = useMemo(() => {
    if (!interviewSetting || !interviewSetting.startTime || !interviewSetting.endTime) return [];
    
    const [startHour, startMin] = interviewSetting.startTime.split(':').map(Number);
    const [endHour, endMin] = interviewSetting.endTime.split(':').map(Number);
    
    // 시작 시간: 항상 해당 시간의 00분으로 내림 (예: 10:15 → 10:00)
    const actualStartHour = startHour;
    
    // 끝 시간 처리:
    // - 종료 시간이 :00이면 그 시간대는 표시 안 함 (예: 18:00 종료 → 17시까지)
    // - 종료 시간이 :30이면 해당 시간의 :00까지 표시 (예: 18:30 종료 → 18시까지)
    const actualEndHour = endMin > 0 ? endHour : endHour - 1;
    
    const slots: string[] = [];
    
    // 1시간 단위로 슬롯 생성 (각 슬롯은 상/하반부로 나뉘어 30분씩 표현)
    for (let hour = actualStartHour; hour <= actualEndHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    
    return slots;
  }, [interviewSetting]);

  // 모든 면접관의 선택을 합친 전체 cellActive
  const combinedCellActive = useMemo(() => {
    const combined: { [key: string]: { top: boolean; bottom: boolean } } = {};
    
    console.log('[SmartSchedule] interviewersCellActive:', interviewersCellActive);
    
    // 모든 면접관의 선택을 순회
    Object.entries(interviewersCellActive).forEach(([userId, cellActive]) => {
      console.log(`[SmartSchedule] 면접관 ${userId}의 선택:`, cellActive);
      Object.entries(cellActive).forEach(([key, value]) => {
        if (!combined[key]) {
          combined[key] = { top: false, bottom: false };
        }
        // 하나라도 선택되어 있으면 전체에서 true로 표시
        combined[key].top = combined[key].top || value.top;
        combined[key].bottom = combined[key].bottom || value.bottom;
      });
    });
    
    console.log('[SmartSchedule] combinedCellActive:', combined);
    
    return combined;
  }, [interviewersCellActive]);

  // interviewersCellActive 상태를 기반으로 participated 동적 계산
  const interviewersWithParticipation = useMemo(() => {
    return interviewers.map(interviewer => ({
      ...interviewer,
      participated: interviewersCellActive[interviewer.userId] 
        ? Object.keys(interviewersCellActive[interviewer.userId]).length > 0
        : false
    }));
  }, [interviewers, interviewersCellActive]);

  return (
    <main className="min-h-screen flex justify-center bg-white ">
      <div className="relative w-[375px] bg-white min-h-screen flex flex-col overflow-x-hidden">
        {/* Top app bar with logo and alarm */}
        <header className="flex items-center justify-between h-12 px-4 bg-white">
          <Link href="/home" className="w-6 h-6">
            <Image src="/icons/logo.svg" alt="로고" width={22} height={22} className="w-[22px] h-[22px]" />
          </Link>
          <span className="text-title">스마트 시간표</span>
          <button className="w-6 h-6 cursor-pointer" onClick={() => router.push('/home/notification')}>
            <Image src="/icons/notification.svg" alt="알림" width={24} height={24} />
          </button>
        </header>

        {/* Main content */}
        <div className="flex-1 px-4 pt-4 pb-4 overflow-y-auto">
          {/* Step 1: Interview Info Setup */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/smart-schedule/setting')}
              className="w-full flex items-start justify-between mb-2 group cursor-pointer"
            >
              <div className="text-left">
                <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">1. 면접 정보 설정</h3>
                <p className="text-body-xs text-gray-300">면접 일정과 운영 방식을 설정해 주세요.</p>
              </div>
              <div className="mt-1 flex-shrink-0">
                <Image src="/icons/chevron-right.svg" alt="next" width={24} height={24} className="w-6 h-6" />
              </div>
            </button>
          </div>

          {/* Step 2: Interviewer Time Registration */}
          <div className="mb-6">
            <div className="text-left mb-3">
              <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">2. 면접관 시간 등록</h3>
              <p className="text-body-xs text-gray-300">각 면접관 별 가능한 시간을 선택해 입력합니다.</p>
            </div>

            {/* Calendar preview - 전체 시간표 (항상 표시) */}
            <div className="mb-3">
              <AllAccordion title="전체">
                <SmartScheduleCalendarPreview 
                  seeds={interviewersWithParticipation.map((_, idx) => idx + 1)} 
                  interviewers={interviewersWithParticipation.map((int, idx) => ({ ...int, isRequired: requiredInterviewers[idx] || false }))} 
                  interviewDates={interviewDates}
                  timeSlots={timeSlots}
                  showInterviewerView={showInterviewerView}
                  onShowInterviewerViewChange={setShowInterviewerView}
                  interviewersCellActive={interviewersCellActive}
                />
              </AllAccordion>
            </div>

            {/* Interviewer List (always visible) */}
            <div className="bg-white">
              {interviewersWithParticipation.map((interviewer, idx) => (
                <div key={idx}>
                  {/* 면접관 카드 */}
                  <button
                    onClick={() => {
                      if (selectedInterviewer === idx) {
                        setSelectedInterviewer(null);
                      } else {
                        setSelectedInterviewer(idx);
                      }
                    }}
                    className="w-full h-[66px] px-0 py-[5px] flex items-center justify-between border-b border-gray-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-[10px]">
                      {interviewer.profileImageUrl ? (
                        <Image
                          src={interviewer.profileImageUrl}
                          alt={interviewer.name}
                          width={35}
                          height={35}
                          className="w-[35px] h-[35px] rounded-full flex-shrink-0"
                        />
                      ) : (
                        <div className="w-[35px] h-[35px] rounded-full bg-gray-200 flex-shrink-0" />
                      )}
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[14px] text-black font-normal leading-[20px]">{interviewer.name}</p>
                          {interviewer.isLeader && (
                            <span className="flex items-center justify-center px-[13px] h-[15px] border-[0.5px] border-primary rounded-[20px] text-[9px] text-primary bg-white leading-[0]">
                              대표자
                            </span>
                          )}
                        </div>
                        <a className="text-[12px] text-gray-500 leading-[17px] tracking-[0.12px]">
                          {interviewer.email}
                        </a>
                      </div>
                    </div>
                    <Image
                      src="/icons/chevron-down.svg"
                      alt="toggle"
                      width={24}
                      height={24}
                      className={`flex-shrink-0 w-6 h-6 ${selectedInterviewer === idx ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Individual interviewer calendar directly below the card */}
                  {selectedInterviewer === idx && (
                    <div className="w-full bg-white border-b border-gray-200 pb-3">
                      <SmartScheduleCalendarPreview
                        interviewerName={interviewer.name}
                        seed={idx + 1}
                        showProfiles={false}
                        showRequiredSection={true}
                        requiredInterviewer={requiredInterviewers[idx] || false}
                        onRequiredInterviewerChange={(value) => setRequiredInterviewers(prev => ({ ...prev, [idx]: value }))}
                        interviewDates={interviewDates}
                        timeSlots={timeSlots}
                        cellActive={interviewersCellActive[interviewer.userId] || {}}
                        onCellActiveChange={(newCellActive) => {
                          console.log(`[SmartSchedule] 면접관 ${interviewer.userId} (${interviewer.name}) 시간 변경:`, newCellActive);
                          console.log(`[SmartSchedule] 전달받은 cellActive:`, interviewersCellActive[interviewer.userId]);
                          
                          // cellActive 상태 업데이트 (participated는 useMemo에서 자동 계산됨)
                          setInterviewersCellActive(prev => {
                            const updated = {
                              ...prev,
                              [interviewer.userId]: newCellActive
                            };
                            console.log('[SmartSchedule] 업데이트된 interviewersCellActive:', updated);
                            return updated;
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Applicant Response */}
          <div className="mt-6">
            <div className="text-left mb-3">
              <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">3. 지원자 면접 가능 시간 모집</h3>
              <p className="text-body-xs text-gray-300">
                응답 종료 전까지 지원자가 면접 가능 시간을 입력 후 제출합니다.
              </p>
            </div>

            <div className="bg-white p-2.5 space-y-2.5">
              {/* URL input with copy icon */}
              <div className="relative">
                <input
                  type="text"
                  value="https://www.campusform.com/interview/apply"
                  readOnly
                  onClick={() => router.push('/smart-schedule/applicant-submit')}
                  className="w-full bg-gray-50 border border-gray-100 rounded-radius-5 px-3 py-3 pr-10 text-body-md text-gray-300 placeholder-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
                />
                <button
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                  aria-label="복사"
                  onClick={e => {
                    e.stopPropagation();
                    navigator.clipboard.writeText('https://www.campusform.com/interview/apply');
                  }}
                >
                  <Image src="/icons/copy-gray.svg" alt="copy" width={16} height={16} className="w-4 h-4" />
                </button>
              </div>

              {/* Info box - 지원자 시간 페이지 편집 */}
              <button
                onClick={() => router.push('/smart-schedule/interview-schedule')}
                className="w-full bg-blue-50 border-[0.5px] border-blue-200 rounded-[10px] px-2.5 py-2.5 flex items-center justify-center gap-1 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <span className="text-body-sm text-gray-950">지원자 시간 페이지 편집</span>
                <Image src="/icons/edit-blue.svg" alt="edit" width={14} height={13} className="w-[14px] h-[13px]" />
              </button>

              {/* Action buttons */}
              <div className="flex gap-1.25">
                <SmartScheduleButton
                  icon="/icons/graph.svg"
                  iconWidth={7}
                  iconHeight={9.3}
                  onClick={() => router.push('/smart-schedule/response-result')}
                >
                  응답 결과 확인
                </SmartScheduleButton>
                <SmartScheduleButton showHash={true}>지원자 전화번호 복사</SmartScheduleButton>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="fixed bottom-20 left-0 right-0 px-5 max-w-93.75 mx-auto">
            <Btn
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setShowConfirmDialog(true)}
            >
              스마트 시간표 생성
            </Btn>
          </div>
                    {/* Confirm Reset Dialog for 스마트 시간표 생성 */}
                    <ConfirmResetDialog
                      isOpen={showConfirmDialog}
                      onClose={() => setShowConfirmDialog(false)}
                      onConfirm={handleConfirm}
                    />
          
          {/* Spacer for fixed button */}
          <div className="h-32" />

          {/* Overlay message - 면접 정보 미설정 */}
          {mounted && showOverlay && (
            <div className="absolute left-0 right-0 top-[115px] bottom-20 flex items-center justify-center z-50 bg-white/85">
              <div className="text-center">
                <p className="text-subtitle-md text-gray-950 font-medium">면접 정보 설정 후 이용 가능합니다.</p>
              </div>
            </div>
          )}

          {/* Overlay message - 스마트 시간표 미생성 & 대표자 아님 */}
          {!hasSchedule && !isRepresentative && !showOverlay && (
            <div className="absolute bg-white/85 left-0 right-0 top-12 bottom-0 flex items-center justify-center z-40">
              <div className="text-center">
                <p className="text-subtitle-md text-gray-950 mb-6">생성된 스마트 시간표가 없습니다.</p>
                <div className="text-body-rg text-gray-500">
                  <p>다음 단계를 진행하고 싶다면</p>
                  <p>
                    <span className="text-body-md">대표자에게 요청</span>해주세요.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom navigation */}
        <Navbar />
      </div>
    </main>
  );
}
