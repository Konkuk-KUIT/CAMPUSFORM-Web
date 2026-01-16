"use client";

import ScheduleCard from "./Schedule"; // 저번에 만든 컴포넌트

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
    /* 1. 하단 시트 영역: 상단 곡률 30px 및 그림자 */
<section className="mx-auto w-[343px] min-h-[345px] bg-white rounded-t-[20px] px-[21px] pt-[20px] pb-[40px] shadow-sm font-['Pretendard']">
          
      {/* 2. 오늘 날짜 정보 */}
      <div className="flex flex-col mb-[20px]">
        <h2 className="text-[16px] font-bold text-gray-950">오늘</h2>
        <p className="text-[12px] text-gray-400">11. 13. (일)</p>
      </div>

      {/* 3. 조건부 렌더링: 일정 유무에 따른 화면 구성 */}
      {isEmpty ? (
        /* 일정이 없을 때: 중앙 안내 문구 */
        <div className="flex flex-col items-center justify-center pt-[40px]">
          <p className="text-[14px] text-gray-400 text-center leading-[20px]">
            오늘 일정이 없어요.<br />
            새로운 일정을 추가해 보세요!
          </p>
        </div>
      ) : (
        /* 일정이 있을 때: 우리가 만든 ScheduleCard 리스트 */
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