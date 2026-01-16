"use client";

import Image from "next/image";

export default function Calendar() {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  
  const dates = [
    29, 30, 1, 2, 3, 4, 5, 
    6, 7, 8, 9, 10, 11, 12, 
    13, 14, 15, 16, 17, 18, 19, 
    20, 21, 22, 23, 24, 25, 26, 
    27, 28, 29, 30, 31, 1, 2
  ];

  return (
    <div className="w-[375px] flex flex-col items-center font-['Pretendard']">
      
      <div className="w-[296px] h-[33px] flex justify-between items-center my-[20px]">
        <button className="w-[33px] h-[33px] flex items-center justify-center rotate-180">
          <Image 
            src="/icons/chevron-right.svg" 
            alt="prev month" 
            width={24} 
            height={7} 
          />
        </button>

        <span className="text-[14px] font-medium text-gray-950">2025년 11월</span>

        <button className="w-[33px] h-[33px] flex items-center justify-center">
          <Image 
            src="/icons/chevron-right.svg" 
            alt="next month" 
            width={24} 
            height={7} 
          />
        </button>
      </div>

      <div className="w-full px-[16px] flex flex-col">
        
        <div className="grid grid-cols-7 h-[28px] items-center mb-[4px]">
          {days.map((day) => (
            <span key={day} className="text-center text-[12px] text-gray-400 font-medium">
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 w-full">
          {dates.map((date, idx) => {
            const isCurrentMonth = idx >= 2 && idx <= 32;
            const isToday = date === 13 && isCurrentMonth;
            const hasEvent = [13, 14, 15].includes(date) && isCurrentMonth;

            return (
              <div key={idx} className="flex flex-col items-center h-[53.4px] pt-[2px]">
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <span className={`text-[14px] z-10 ${
                    isToday ? "text-white font-bold" : 
                    isCurrentMonth ? "text-gray-950" : "text-gray-300"
                  }`}>
                    {date}
                  </span>
                  {isToday && (
                    <div className="absolute inset-0 bg-primary rounded-full" />
                  )}
                </div>

                {hasEvent && (
                  <div className="mt-[2px] w-[45px] h-[14px] bg-[#BFCEFE] rounded-[2px] flex items-center justify-center px-[3.5px]">
                    <span className="text-[10px] text-[#3D3D3D] leading-none truncate w-full text-center">
                      요리퐁 6기 신입부원 모집
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}