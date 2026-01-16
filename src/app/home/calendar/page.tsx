"use client";

import TopAppBar from "@/components/home/TopAppBar";
import SegmentedControl from "@/components/SegmentedControl";
import CalendarHeader from "@/components/home/CalendarHeader";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex justify-center">
      <div className="relative w-[375px] bg-white min-h-screen shadow-lg">
        
        <TopAppBar />

        <div className="pt-[48px]">
          <section className="mt-4 flex justify-center px-5">
            <SegmentedControl />
          </section>

          <section className="mt-[20px] flex justify-center">
            <CalendarHeader />
          </section>

          {/* 달력 요일 그리드가 들어올 자리 */}
          
        </div>
      </div>
    </main>
  );
}