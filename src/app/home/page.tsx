"use client";

import { useState } from "react";
import TopAppBar from "@/components/home/TopAppBar";
import SegmentedControl from "@/components/SegmentedControl";
import Calendar from "@/components/home/Calendar";
import ScheduleList from "@/components/home/ScheduleList";
import ProjectFilter from "@/components/home/ProjectFilter";
import HomeOn from "@/components/home/HomeOn";
import HomeOff from "@/components/home/HomeOff";
import Image from "next/image";
import Link from "next/link";
export default function HomePage() {

    const [currentTab, setCurrentTab] = useState("calendar");
  const [isOnlyRecruiting, setIsOnlyRecruiting] = useState(false);

  const [schedules] = useState([
    {
      title: "요리퐁 6기 신입부원 모집 - 면접",
      timeRange: "오후 2:00 - 오후 2:30",
      isChecked: true,
    },
    {
      title: "요리퐁 6기 신입부원 모집 - 면접",
      timeRange: "오후 2:00 - 오후 2:30",
      isChecked: false,
    },
    {
      title: "요리퐁 6기 신입부원 모집 - 면접",
      timeRange: "오후 2:00 - 오후 2:30",
      isChecked: false,
    },
  ]);

  const projects = [
    {
      title: "요리퐁 6기 신입부원 모집",
      status: "모집 중",
      dateRange: "20.00.00 ~ 20.00.00",
      applicantCount: 5,
    },
    {
      title: "KUIT 5기 신입부원 모집",
      status: "모집 완료",
      dateRange: "20.00.00 ~ 20.00.00",
      applicantCount: 12,
    },
  ];

  return (
    <main className="min-h-screen flex justify-center bg-white font-['Pretendard']">

      <div className="relative w-[375px] bg-gray-50 min-h-screen shadow-lg flex flex-col overflow-x-hidden overflow-y-auto">
        
        <div className="sticky top-0 z-50 bg-white">
          <TopAppBar />
        </div>

        <div className="pt-[55px] flex-1 flex flex-col">
          
          <section className="mt-4 mb-4 flex justify-center px-5 shrink-0">
            <SegmentedControl onTabChange={(tab) => setCurrentTab(tab)} />
          </section>

          {currentTab === "calendar" ? (
            <div className="flex flex-col animate-in fade-in duration-200">
              <section className="flex justify-center shrink-0">
                <Calendar />
              </section>
              <ScheduleList schedules={schedules} />
            </div>
          ) : (
            <div className="flex flex-col animate-in fade-in duration-200">
              <ProjectFilter 
                isOnlyRecruiting={isOnlyRecruiting} 
                onChange={setIsOnlyRecruiting} 
              />
              
              <section className="mt-7 flex flex-col items-center gap-3 pb-5 w-full px-4">
                {projects
                  .filter(p => !isOnlyRecruiting || p.status === "모집 중")
                  .map((project, index) => (
                    <div key={index} className="w-full flex justify-center">
                      {project.status === "모집 중" ? (
                        <HomeOn {...project} />
                      ) : (
                        <HomeOff {...project} />
                      )}
                    </div>
                  ))}
              </section>
              <div className="flex justify-center w-full">
                <Link 
                href="/home/addproject"
                className="flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                >
                    <Image 
                    src="/icons/plus-blue.svg"
                    alt="add" 
                    width={65} 
                    height={65} 
                    className="drop-shadow-lg"
                    />
                </Link>
                </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}