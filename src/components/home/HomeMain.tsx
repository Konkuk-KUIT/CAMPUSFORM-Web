'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import TopAppBar from '@/components/home/TopAppBar';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Calendar from '@/components/home/Calendar';
import ScheduleList from '@/components/home/ScheduleList';
import ProjectFilter from '@/components/home/ProjectFilter';
import RecruitmentCard from '@/components/home/RecruitmentCard';
import Image from 'next/image';
import Link from 'next/link';

export default function HomeMain() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('calendar');
  const [isOnlyRecruiting, setIsOnlyRecruiting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 인증 체크
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResponse = await authService.getCurrentUser();

        // 로그인 안 되어 있으면 로그인 페이지로
        if (!authResponse?.isAuthenticated) {
          router.replace('/auth/login');
          return;
        }

        // 프로필 미완성이면 setup 페이지로 (닉네임으로 판별)
        if (!authService.isProfileCompleted(authResponse.user)) {
          router.replace('/auth/setup');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        router.replace('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  const [schedules] = useState([
    {
      date: new Date(2026, 0, 18),
      title: '요리퐁 6기 신입부원 모집 - 면접',
      timeRange: '오후 2:00 - 오후 2:30',
      isChecked: true,
    },
    {
      date: new Date(2026, 0, 18),
      title: '요리퐁 6기 신입부원 모집 - 면접',
      timeRange: '오후 2:00 - 오후 2:30',
      isChecked: false,
    },
    {
      date: new Date(2026, 0, 18),
      title: '요리퐁 6기 신입부원 모집 - 면접',
      timeRange: '오후 2:00 - 오후 2:30',
      isChecked: false,
    },
  ]);

  const calendarEvents = [
    {
      date: new Date(2026, 0, 22),
      title: '요리퐁 신입부원 면접',
      timeRange: '오후 2:00 - 오후 3:00',
    },
    {
      date: new Date(2026, 0, 22),
      title: 'KUIT 동아리 설명회',
      timeRange: '오후 4:00 - 오후 5:00',
    },
    {
      date: new Date(2026, 0, 22),
      title: '학생회 정기 회의',
      timeRange: '오후 7:00 - 오후 9:00',
    },
    {
      date: new Date(2026, 0, 25),
      title: 'KUIT 신입부원 면접',
      timeRange: '오후 1:00 - 오후 2:00',
    },
    {
      date: new Date(2026, 0, 28),
      title: '동아리 정기 모임',
      timeRange: '오후 6:00 - 오후 8:00',
    },
  ];

  const allSchedules = [
    ...schedules.map(s => ({ ...s, isChecked: s.isChecked })),
    ...calendarEvents.map(e => ({
      date: e.date,
      title: e.title,
      timeRange: e.timeRange,
      isChecked: false,
    })),
  ];

  const todaySchedules = allSchedules.filter(schedule => schedule.date.toDateString() === selectedDate.toDateString());

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: '요리퐁 6기 신입부원 모집',
      status: '모집 중',
      dateRange: '20.00.00 ~ 20.00.00',
      applicantCount: 5,
    },
    {
      id: 2,
      title: 'KUIT 5기 신입부원 모집',
      status: '모집 완료',
      dateRange: '20.00.00 ~ 20.00.00',
      applicantCount: 12,
    },
  ]);

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex justify-center bg-gray-50">
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

              <section className="mt-7 flex flex-col items-center gap-3 pb-5 w-full px-4">
                {projects
                  .filter(p => !isOnlyRecruiting || p.status === '모집 중')
                  .map(project => (
                    <div key={project.id} className="w-full flex justify-center">
                      <RecruitmentCard
                        id={project.id}
                        status={project.status === '모집 중' ? 'on' : 'off'}
                        title={project.title}
                        recruitmentStatus={project.status}
                        dateRange={project.dateRange}
                        applicantCount={project.applicantCount}
                        onDelete={handleDeleteProject}
                      />
                    </div>
                  ))}
              </section>
              <div className="flex justify-center w-full">
                <Link
                  href="/home/addproject"
                  className="flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                >
                  <Image src="/icons/plus-blue.svg" alt="add" width={65} height={65} className="drop-shadow-lg" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
