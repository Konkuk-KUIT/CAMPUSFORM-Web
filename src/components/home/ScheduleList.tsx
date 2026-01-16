"use client";

import ScheduleCard from "./Schedule"; 

interface ScheduleListProps {
  schedules?: Array<{
    title: string;
    timeRange: string;
    isChecked: boolean;
  }>;
}

export default function ScheduleList({ schedules = [] }: ScheduleListProps) {
  const isEmpty = schedules.length === 0;

  return (
<section className="mx-auto w-[343px] min-h-[345px] bg-white rounded-t-[20px] px-[21px] pt-[20px] pb-[40px] shadow-sm font-['Pretendard']">
          
      <div className="flex flex-col mb-[20 px]">
        <h2 className="text-[16px] font-bold text-gray-950">오늘</h2>
        <p className="text-[12px] text-gray-400">11. 13. (일)</p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center pt-[40px]">
          <p className="text-[14px] text-gray-400 text-center leading-[20px]">
            오늘의 일정이 없습니다.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-[12px]">
          {schedules.map((item, index) => (
            <ScheduleCard 
              key={index}
              title={item.title}
              timeRange={item.timeRange}
              initialChecked={item.isChecked}
            />
          ))}
        </div>
      )}
      
    </section>
  );
}