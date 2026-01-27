"use client";

import Schedule from "./Schedule";

interface ScheduleListProps {
  selectedDate?: Date;
  schedules?: Array<{
    date?: Date;
    title: string;
    timeRange: string;
    isChecked: boolean;
  }>;
}

export default function ScheduleList({ selectedDate = new Date(), schedules = [] }: ScheduleListProps) {
  const isEmpty = schedules.length === 0;
  
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = days[selectedDate.getDay()];
  const month = selectedDate.getMonth() + 1;
  const date = selectedDate.getDate();
  
  // 오늘 날짜인지 확인
  const today = new Date();
  const isToday = selectedDate.toDateString() === today.toDateString();

  return (
<section className="mx-auto w-[343px] min-h-[345px] bg-white rounded-t-[20px] px-[21px] pt-[20px] pb-[40px] shadow-sm font-['Pretendard']">
          
      <div className="flex flex-col mb-[8px] pb-[12px] border-b border-gray-200">
        <h2 className="text-[16px] font-bold text-gray-950">{isToday ? "오늘" : "일정"}</h2>
        <p className="text-[12px] text-gray-400">{month}. {date}. ({dayOfWeek})</p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center pt-[40px]">
          <p className="text-[14px] text-gray-400 text-center leading-[20px]">
            {isToday ? "오늘의 일정이 없습니다." : "일정이 없습니다."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-[12px]">
          {schedules.map((item, index) => (
            <Schedule 
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