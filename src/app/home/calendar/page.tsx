"use client";

import { useState } from "react";
import TopAppBar from "@/components/home/TopAppBar";
import SegmentedControl from "@/components/SegmentedControl";
import Calendar from "@/components/home/Calendar";
import ScheduleList from "@/components/home/ScheduleList";

export default function HomePage() {
  const [schedules, setSchedules] = useState([
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

  return (
    <main className="min-h-screen flex justify-center font-['Pretendard']">
      
      <div className="relative w-[375px] bg-white min-h-screen shadow-lg flex flex-col overflow-x-hidden">
        
        <TopAppBar />

        <div className="pt-[55px] bg-gray-50 flex-1 flex flex-col">
          
          <section className="mt-4 flex justify-center px-5">
            <SegmentedControl />
          </section>

          <section className="flex justify-center">
            <Calendar />
          </section>

          <ScheduleList schedules={schedules[]} />
          
        </div>
      </div>
    </main>
  );
}