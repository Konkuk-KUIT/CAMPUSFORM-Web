'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/ui/Header';
import Navbar from '@/components/Navbar';
import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { useNewProjectStore } from '@/store/newProjectStore';
import { projectService } from '@/services/projectService';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Applicant {
  applicantId: number;
  name: string;
  school: string;
  major: string;
  position: string;
}

interface TimeSlot {
  time: string;
  applicants: Applicant[];
}

interface DateSchedule {
  date: string;
  slots: TimeSlot[];
}

export default function SmartScheduleResponseResultForm() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const projectId = useCurrentProjectStore(s => s.projectId);
  const setProjectId = useCurrentProjectStore(s => s.setProjectId);
  const createdProjectId = useNewProjectStore(s => s.createdProjectId);
  const [applicantResponses, setApplicantResponses] = useState<any[]>([]);
  const [interviewSetting, setInterviewSetting] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // 면접 설정 및 지원자 응답 조회
  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      try {
        // 면접 설정 조회
        const setting = await projectService.getInterviewSetting(projectId);
        console.log('[ResponseResult] 면접 설정:', setting);
        setInterviewSetting(setting);

        // 지원자 응답 조회 (API가 없을 경우 빈 배열 사용)
        try {
          const responses = await projectService.getInterviewSlotsApplicants(projectId);
          console.log('[ResponseResult] 지원자 응답 원본:', responses);
          console.log('[ResponseResult] 응답 타입:', typeof responses);
          console.log('[ResponseResult] 응답 키들:', responses ? Object.keys(responses) : 'null');
          
          // API 응답 구조에 따라 데이터 추출
          let applicantsData = [];
          if (Array.isArray(responses)) {
            applicantsData = responses;
          } else if (responses?.summaries) {
            // summaries 구조: [{ date, slots: [{ startTime, applicants: [...] }] }]
            applicantsData = responses.summaries;
          } else if (responses?.applicants) {
            applicantsData = responses.applicants;
          } else if (responses?.slots) {
            applicantsData = responses.slots;
          } else if (responses) {
            // 응답 자체가 객체일 경우
            applicantsData = [responses];
          }
          
          console.log('[ResponseResult] 파싱된 데이터:', applicantsData);
          setApplicantResponses(applicantsData);
        } catch (apiError) {
          console.warn('지원자 응답 조회 실패 (API 미구현 가능성):', apiError);
          setApplicantResponses([]);
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
        setApplicantResponses([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [projectId]);

  // 지원자 응답 데이터를 날짜/시간별로 그룹화
  const scheduleData: DateSchedule[] = useMemo(() => {
    console.log('[ResponseResult] scheduleData 계산 시작');
    console.log('[ResponseResult] applicantResponses:', applicantResponses);
    console.log('[ResponseResult] interviewSetting:', interviewSetting);
    
    if (!applicantResponses.length || !interviewSetting) {
      console.log('[ResponseResult] 데이터 없음 - 빈 배열 반환');
      return [];
    }

    // 날짜별 시간별로 지원자를 그룹화
    const groupedByDateTime: { [dateKey: string]: { [time: string]: Applicant[] } } = {};

    applicantResponses.forEach((response: any, index: number) => {
      console.log(`[ResponseResult] 응답 ${index} 처리:`, response);
      
      // summaries 구조: { date, slots: [{ startTime, applicants }] }
      if (response.date && response.slots && Array.isArray(response.slots)) {
        const dateObj = new Date(response.date);
        const dateKey = format(dateObj, 'M월 d일 (E)', { locale: ko });
        
        if (!groupedByDateTime[dateKey]) {
          groupedByDateTime[dateKey] = {};
        }
        
        response.slots.forEach((slot: any) => {
          if (slot.startTime && slot.applicants && Array.isArray(slot.applicants)) {
            if (!groupedByDateTime[dateKey][slot.startTime]) {
              groupedByDateTime[dateKey][slot.startTime] = [];
            }
            
            // applicants 배열의 각 지원자 추가
            slot.applicants.forEach((app: any) => {
              const applicant: Applicant = {
                applicantId: app.applicantId || app.id,
                name: app.name || '이름 없음',
                school: app.school || '학교 정보 없음',
                major: app.major || '전공 정보 없음',
                position: app.position || '포지션 없음',
              };
              groupedByDateTime[dateKey][slot.startTime].push(applicant);
            });
          }
        });
      }
      // 슬롯 기반 응답일 경우 (date, startTime, applicants 구조)
      else if (response.date && response.startTime && response.applicants) {
        const dateObj = new Date(response.date);
        const dateKey = format(dateObj, 'M월 d일 (E)', { locale: ko });
        
        if (!groupedByDateTime[dateKey]) {
          groupedByDateTime[dateKey] = {};
        }
        
        if (!groupedByDateTime[dateKey][response.startTime]) {
          groupedByDateTime[dateKey][response.startTime] = [];
        }
        
        // applicants 배열의 각 지원자 추가
        response.applicants.forEach((app: any) => {
          const applicant: Applicant = {
            applicantId: app.applicantId || app.id,
            name: app.name || '이름 없음',
            school: app.school || '학교 정보 없음',
            major: app.major || '전공 정보 없음',
            position: app.position || '포지션 없음',
          };
          groupedByDateTime[dateKey][response.startTime].push(applicant);
        });
      }
      // 지원자 기반 응답일 경우 (applicantId, availabilities 구조)
      else if (response.applicantId || response.name) {
        const applicant: Applicant = {
          applicantId: response.applicantId,
          name: response.name || '이름 없음',
          school: response.school || '학교 정보 없음',
          major: response.major || '전공 정보 없음',
          position: response.position || '포지션 없음',
        };

        // 지원자의 availabilities를 순회
        if (response.availabilities && Array.isArray(response.availabilities)) {
          response.availabilities.forEach((dayAvail: any) => {
            const date = dayAvail.date; // "2026-02-14"
            const dateObj = new Date(date);
            const dateKey = format(dateObj, 'M월 d일 (E)', { locale: ko });

            if (!groupedByDateTime[dateKey]) {
              groupedByDateTime[dateKey] = {};
            }

            // startTimes를 순회하며 시간별로 지원자 추가
            if (dayAvail.startTimes && Array.isArray(dayAvail.startTimes)) {
              dayAvail.startTimes.forEach((time: string) => {
                if (!groupedByDateTime[dateKey][time]) {
                  groupedByDateTime[dateKey][time] = [];
                }
                groupedByDateTime[dateKey][time].push(applicant);
              });
            }
          });
        }
      }
    });

    console.log('[ResponseResult] 그룹화된 데이터:', groupedByDateTime);

    // DateSchedule 형식으로 변환
    const result: DateSchedule[] = [];
    Object.entries(groupedByDateTime).forEach(([date, timeSlots]) => {
      const slots: TimeSlot[] = [];
      Object.entries(timeSlots).forEach(([time, applicants]) => {
        slots.push({ time, applicants });
      });
      
      // 시간순으로 정렬
      slots.sort((a, b) => {
        const [aHour, aMin] = a.time.split(':').map(Number);
        const [bHour, bMin] = b.time.split(':').map(Number);
        return aHour * 60 + aMin - (bHour * 60 + bMin);
      });

      result.push({ date, slots });
    });

    // 날짜순으로 정렬 (면접 설정의 startDate ~ endDate 순서대로)
    if (interviewSetting.startDate) {
      result.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
    }

    console.log('[ResponseResult] 최종 scheduleData:', result);
    return result;
  }, [applicantResponses, interviewSetting]);

  // 검색 필터링 - 검색어가 있을 때만 필터링, 검색된 지원자가 있는 시간대의 모든 지원자 표시
  const filteredScheduleData = searchQuery
    ? scheduleData
        .map(dateSchedule => ({
          ...dateSchedule,
          slots: dateSchedule.slots.filter(slot =>
            slot.applicants.some(applicant => applicant.name.toLowerCase().includes(searchQuery.toLowerCase()))
          ),
        }))
        .filter(dateSchedule => dateSchedule.slots.length > 0)
    : scheduleData;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <Header title="지원자 가능 시간 확인" backTo="/smart-schedule" />
      </div>

      {/* Content */}
      <div className="pb-20">
        {/* pb-20 = 80px, 네비바 높이(65px)보다 약간 여유있게 */}
        
        {/* 로딩 중 */}
        {isLoading && (
          <div className="flex items-center justify-center py-40">
            <p className="text-body-rg text-gray-400">데이터를 불러오는 중...</p>
          </div>
        )}

        {/* 데이터 없음 */}
        {!isLoading && scheduleData.length === 0 && !searchQuery && (
          <div className="flex items-center justify-center py-40">
            <p className="text-body-rg text-gray-400">아직 지원자 응답이 없습니다.</p>
          </div>
        )}

        {/* 데이터 있을 때만 검색바와 결과 표시 */}
        {!isLoading && (scheduleData.length > 0 || searchQuery) && (
          <>
            {/* Search Bar */}
            <div className="px-4 pt-4 pb-3">
          <div className="relative">
            <div className="absolute left-[10px] top-1/2 -translate-y-1/2 w-[13px] h-[13px]">
              <Image src="/icons/search.svg" alt="search" width={13} height={13} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="지원자의 이름을 검색하세요."
              className="w-full h-[38px] bg-gray-50 rounded-[5px] pl-[33px] pr-4 text-body-rg text-gray-950 placeholder:text-gray-400"
            />
          </div>
        </div>

            {/* 검색 결과 없음 */}
            {searchQuery && filteredScheduleData.length === 0 && (
              <div className="flex items-center justify-center py-40">
                <p className="text-body-rg text-gray-950">검색 결과가 없습니다.</p>
              </div>
            )}

            {/* Schedule by Date */}
            {filteredScheduleData.map((dateSchedule, dateIndex) => (
          <div key={dateIndex}>
            {/* Date Header */}
            <div className="w-full h-[50px] flex items-center px-[26px] bg-white border-b border-gray-100">
              <span className="text-subtitle-sm-md text-gray-950">{dateSchedule.date}</span>
            </div>

            {/* Time Slots */}
            {dateSchedule.slots.map((slot, slotIndex) => (
              <div key={slotIndex} className="bg-white h-[118px] flex items-center px-[26px] gap-0">
                {/* Time */}
                <p className="text-subtitle-rg text-gray-950 w-[60px] flex-shrink-0 mr-[35px]">{slot.time}</p>

                {/* Applicants Card */}
                <div className="border-[1.5px] border-gray-200 rounded-[10px] p-[15px] flex flex-col gap-[6px] flex-1 min-w-0 overflow-hidden">
                  {slot.applicants.map((applicant, appIndex) => (
                    <p
                      key={appIndex}
                      className={`text-body-sm-rg truncate ${
                        searchQuery && applicant.name.toLowerCase().includes(searchQuery.toLowerCase())
                          ? 'text-primary'
                          : 'text-gray-950'
                      }`}
                    >
                      {applicant.name}({applicant.school}/{applicant.major}/{applicant.position})
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
            ))}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}
