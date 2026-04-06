'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { projectService } from '@/services/projectService';
import { applicantService } from '@/services/applicantService';
import type { Project } from '@/types/project';
import type { CalendarEvent } from '@/types/schedule';
import TopAppBar from '@/components/home/TopAppBar';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Calendar from '@/components/home/Calendar';
import ScheduleList from '@/components/home/ScheduleList';
import ProjectFilter from '@/components/home/ProjectFilter';
import ConfirmModal from '@/components/ConfirmModal';
import RecruitmentCard from '@/components/home/RecruitmentCard';
import Image from 'next/image';
import Link from 'next/link';
import { toast, ToastContainer } from '@/components/Toast';
import Loading from '@/components/ui/Loading';
import { useManualCloseStore } from '@/store/manualCloseStore';

export default function HomeMain() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('calendar');
  const [isOnlyRecruiting, setIsOnlyRecruiting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [projects, setProjects] = useState<Project[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const { closedProjectIds, openedProjectIds } = useManualCloseStore();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResponse = await authService.getCurrentUser();

        if (!authResponse?.isAuthenticated) {
          router.replace('/auth/login');
          return;
        }

        if (!authService.isProfileCompleted(authResponse.user)) {
          router.replace('/auth/setup');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error('인증 확인 중 오류가 발생했습니다.');
        router.replace('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (e) {
        console.error('프로젝트 목록 조회 오류:', e);
        toast.error('프로젝트 목록을 불러오지 못했습니다.');
      }
    };

    if (!isLoading) fetchProjects();
  }, [isLoading]);

  // 프로젝트 일정 조회
  useEffect(() => {
    const fetchSchedules = async () => {
      if (projects.length === 0) return;
      
      setIsLoadingSchedules(true);
      try {
        const events: CalendarEvent[] = [];
        
        // 1. 프로젝트 모집 기간 추가
        projects.forEach(project => {
          // 모집 시작일
          events.push({
            date: new Date(project.startAt),
            title: `모집 시작 - ${project.title}`,
            timeRange: '종일',
            isChecked: false,
          });
          // 모집 종료일
          events.push({
            date: new Date(project.endAt),
            title: `모집 마감 - ${project.title}`,
            timeRange: '종일',
            isChecked: false,
          });
        });

        // 2. 면접 일정 추가 (면접 단계 프로젝트만)
        const interviewProjects = projects
          .filter(p => p.state === 'INTERVIEW' || p.state === 'INTERVIEW_COMPLETE');

        console.log('면접 단계 프로젝트:', interviewProjects.length, interviewProjects);

        if (interviewProjects.length > 0) {
          // 각 프로젝트의 지원자 목록을 조회하여 면접 시간이 배정된 지원자만 필터링
          for (const project of interviewProjects) {
            try {
              console.log(`프로젝트 ${project.id}의 지원자 목록 조회 중...`);
              const applicantsData = await applicantService.getApplicants(project.id, 'INTERVIEW');
              console.log(`프로젝트 ${project.id} 지원자 데이터:`, applicantsData);
              
              if (applicantsData.applicants && applicantsData.applicants.length > 0) {
                // 면접 시간이 배정된 지원자만 필터링
                const scheduledApplicants = applicantsData.applicants.filter(
                  applicant => applicant.interviewDate && applicant.interviewStartTime
                );

                scheduledApplicants.forEach(applicant => {
                  const interviewDateTime = new Date(applicant.interviewDate!);
                  const endTime = applicant.interviewStartTime!.substring(0, 5); // "HH:mm:ss" → "HH:mm"
                  
                  events.push({
                    date: interviewDateTime,
                    title: `면접 - ${applicant.name} - ${project.title}`,
                    timeRange: `${endTime}`,
                    isChecked: false,
                  });
                });
              }
            } catch (error: any) {
              // 404 에러는 지원자가 없는 것으로 간주
              if (error.response?.status === 404) {
                console.log(`프로젝트 ${project.id}: 지원자가 없습니다.`);
              } else {
                console.error(`프로젝트 ${project.id}의 지원자 조회 실패:`, error);
              }
              // 오류가 발생해도 다른 프로젝트들은 계속 조회
            }
          }
        }

        setCalendarEvents(events);
      } catch (e) {
        console.error('일정 조회 오류:', e);
        // 일정 조회 실패해도 프로젝트 기간은 표시
        const fallbackEvents = projects.flatMap(project => [
          {
            date: new Date(project.startAt),
            title: `모집 시작 - ${project.title}`,
            timeRange: '종일',
            isChecked: false,
          },
          {
            date: new Date(project.endAt),
            title: `모집 마감 - ${project.title}`,
            timeRange: '종일',
            isChecked: false,
          },
        ]);
        setCalendarEvents(fallbackEvents);
      } finally {
        setIsLoadingSchedules(false);
      }
    };

    fetchSchedules();
  }, [projects]);

  const handleDeleteProject = (id: number) => {
    setDeleteTargetId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await projectService.deleteProject(deleteTargetId);
      setProjects(projects.filter(p => p.id !== deleteTargetId));
      toast.success('프로젝트가 삭제되었습니다.');
    } catch (e) {
      console.error('프로젝트 삭제 오류:', e);
      toast.error('프로젝트 삭제에 실패했습니다.');
    } finally {
      setDeleteTargetId(null);
    }
  };

  // 일정 체크 상태 업데이트
  const handleScheduleCheck = (scheduleIndex: number, checked: boolean) => {
    if (scheduleIndex < 0 || scheduleIndex >= todaySchedules.length) return;
    
    const targetSchedule = todaySchedules[scheduleIndex];
    const targetEventIndex = calendarEvents.findIndex(
      event => 
        event.date.toDateString() === selectedDate.toDateString() && 
        event.title === targetSchedule.title && 
        event.timeRange === targetSchedule.timeRange
    );
    
    if (targetEventIndex !== -1) {
      const updatedEvents = [...calendarEvents];
      updatedEvents[targetEventIndex] = { 
        ...updatedEvents[targetEventIndex], 
        isChecked: checked 
      };
      setCalendarEvents(updatedEvents);
    }
  };

  // 선택된 날짜의 일정 필터링 및 정렬 (언체크 위, 체크 아래)
  const todaySchedules = calendarEvents
    .filter(event => event.date.toDateString() === selectedDate.toDateString())
    .sort((a, b) => {
      // isChecked가 false인 것(언체크) → 위쪽
      // isChecked가 true인 것(체크) → 아래쪽
      if (a.isChecked === b.isChecked) return 0;
      return a.isChecked ? 1 : -1;
    })
    .map(event => ({
      date: event.date,
      title: event.title,
      timeRange: event.timeRange,
      isChecked: event.isChecked || false,
    }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex justify-center bg-gray-50">
      <ToastContainer />
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        description="프로젝트를 삭제하시겠습니까?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />      
      <div className="relative w-[375px] bg-gray-50 min-h-screen flex flex-col overflow-y-auto">
        <div className="sticky top-0 z-50 bg-white">
          <TopAppBar />
        </div>

        <div className="pt-[15px] flex-1 flex flex-col bg-gray-50">
          <section className="mb-[15px] flex justify-center px-5 shrink-0">
            <SegmentedControl onTabChange={tab => setCurrentTab(tab)} />
          </section>

          {currentTab === 'calendar' ? (
            <div className="flex flex-col animate-in fade-in duration-200 items-center flex-1">
              <section className="w-full flex justify-center shrink-0 pt-[16px]">
                <Calendar
                  variant="home"
                  selected={selectedDate}
                  onDateChange={date => {
                    if (date && !Array.isArray(date)) {
                      setSelectedDate(date);
                    }
                  }}
                  events={calendarEvents}
                />
              </section>
              <ScheduleList 
                selectedDate={selectedDate} 
                schedules={todaySchedules}
                onScheduleCheck={handleScheduleCheck}
              />
            </div>
          ) : (
            <div className="flex flex-col animate-in fade-in duration-200">
              <ProjectFilter isOnlyRecruiting={isOnlyRecruiting} onChange={setIsOnlyRecruiting} />

              <section className="mt-[10px] flex flex-col items-center gap-3 pb-5 w-full px-4">
                {projects
                  .filter(p => !isOnlyRecruiting || openedProjectIds.includes(p.id) || (p.state === 'DOCUMENT' && !closedProjectIds.includes(p.id)))
                  .sort((a, b) => {
                    const isActiveA = openedProjectIds.includes(a.id) || (a.state === 'DOCUMENT' && !closedProjectIds.includes(a.id));
                    const isActiveB = openedProjectIds.includes(b.id) || (b.state === 'DOCUMENT' && !closedProjectIds.includes(b.id));

                    if (isActiveA !== isActiveB) return isActiveA ? -1 : 1; // 모집중 우선
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                  })
                  .map(project => {
                    const isManuallyClosed = closedProjectIds.includes(project.id);
                    const isManuallyOpened = openedProjectIds.includes(project.id);
                    const isActive = isManuallyOpened || (project.state === 'DOCUMENT' && !isManuallyClosed);

                    return (
                      <div key={project.id} className="w-full flex justify-center">
                        <RecruitmentCard
                          id={project.id}
                          status={isActive ? 'on' : 'off'}
                          title={project.title}
                          recruitmentStatus={isActive ? '모집 중' : '모집 완료'}
                          dateRange={`${project.startAt} ~ ${project.endAt}`}
                          applicantCount={project.applicantCount}
                          onDelete={handleDeleteProject}
                          onClick={() => router.push(
                            project.state === 'DOCUMENT'
                              ? `/document/${project.id}`
                              : `/interview/${project.id}`
                          )}
                        />
                      </div>
                    );
                  })}
              </section>
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
                <Link
                  href="/home/addproject"
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white font-medium text-15 rounded-full hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.25))' }}
                >
                  <span>+</span>
                  새 프로젝트 생성
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
    
  );
}
