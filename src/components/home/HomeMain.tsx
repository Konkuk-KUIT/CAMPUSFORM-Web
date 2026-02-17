'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { projectService } from '@/services/projectService';
import { scheduleService } from '@/services/scheduleService';
import type { Project } from '@/types/project';
import type { CalendarEvent } from '@/types/schedule';
import TopAppBar from '@/components/home/TopAppBar';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Calendar from '@/components/home/Calendar';
import ScheduleList from '@/components/home/ScheduleList';
import ProjectFilter from '@/components/home/ProjectFilter';
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
  const { closedProjectIds } = useManualCloseStore();

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
            title: `${project.title} - 모집 시작`,
            timeRange: '종일',
          });
          // 모집 종료일
          events.push({
            date: new Date(project.endAt),
            title: `${project.title} - 모집 마감`,
            timeRange: '종일',
          });
        });

        // 2. 면접 일정 추가 (면접 단계 프로젝트만)
        const interviewProjects = projects
          .filter(p => p.state === 'INTERVIEW' || p.state === 'INTERVIEW_COMPLETE');

        console.log('면접 단계 프로젝트:', interviewProjects.length, interviewProjects);

        if (interviewProjects.length > 0) {
          // 각 프로젝트의 스마트 시간표를 조회하여 CalendarEvent로 변환
          for (const project of interviewProjects) {
            try {
              console.log(`프로젝트 ${project.id}의 스마트 시간표 조회 중...`);
              const schedule = await scheduleService.getSmartSchedule(project.id);
              console.log(`프로젝트 ${project.id} 스케줄:`, schedule);
              
              if (schedule.days && schedule.days.length > 0) {
                schedule.days.forEach(day => {
                  day.slots.forEach(slot => {
                    if (slot.applicants && slot.applicants.length > 0) {
                      slot.applicants.forEach(applicant => {
                        events.push({
                          date: new Date(day.date),
                          title: `${project.title} - ${applicant.name} 면접`,
                          timeRange: `${slot.startTime} - ${slot.endTime}`,
                        });
                      });
                    } else {
                      // 지원자가 없는 슬롯도 표시
                      events.push({
                        date: new Date(day.date),
                        title: `${project.title} - 면접 슬롯`,
                        timeRange: `${slot.startTime} - ${slot.endTime}`,
                      });
                    }
                  });
                });
              }
            } catch (error: any) {
              // 404나 500 에러는 스마트 시간표가 아직 생성되지 않은 것으로 간주
              if (error.response?.status === 404 || error.response?.status === 500) {
                console.log(`프로젝트 ${project.id}: 스마트 시간표가 아직 생성되지 않았습니다.`);
              } else {
                console.error(`프로젝트 ${project.id}의 스케줄 조회 실패:`, error);
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
            title: `${project.title} - 모집 시작`,
            timeRange: '종일',
          },
          {
            date: new Date(project.endAt),
            title: `${project.title} - 모집 마감`,
            timeRange: '종일',
          },
        ]);
        setCalendarEvents(fallbackEvents);
      } finally {
        setIsLoadingSchedules(false);
      }
    };

    fetchSchedules();
  }, [projects]);

  const handleDeleteProject = async (id: number) => {
    try {
      await projectService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      toast.success('프로젝트가 삭제되었습니다.');
    } catch (e) {
      console.error('프로젝트 삭제 오류:', e);
      toast.error('프로젝트 삭제에 실패했습니다.');
    }
  };

  // 선택된 날짜의 일정 필터링
  const todaySchedules = calendarEvents
    .filter(event => event.date.toDateString() === selectedDate.toDateString())
    .map(event => ({
      date: event.date,
      title: event.title,
      timeRange: event.timeRange,
      isChecked: false,
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
              <section className="w-full flex justify-center shrink-0 pt-[15px]">
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
              <ScheduleList selectedDate={selectedDate} schedules={todaySchedules} />
            </div>
          ) : (
            <div className="flex flex-col animate-in fade-in duration-200">
              <ProjectFilter isOnlyRecruiting={isOnlyRecruiting} onChange={setIsOnlyRecruiting} />

              <section className="mt-[10px] flex flex-col items-center gap-3 pb-5 w-full px-4">
                {projects
                  .filter(p => !isOnlyRecruiting || (p.state === 'DOCUMENT' && !closedProjectIds.includes(p.id)))
                  .map(project => {
                    const isManuallyClosed = closedProjectIds.includes(project.id);
                    const isActive = project.state === 'DOCUMENT' && !isManuallyClosed;

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
              <div className="flex justify-center w-full">
                <Link
                  href="/home/addproject"
                  className="flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                >
                  <div style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
                    <Image src="/icons/plus-blue.svg" alt="add" width={65} height={65} />
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
