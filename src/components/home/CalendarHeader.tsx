"use client";

import Image from "next/image";

export default function CalendarHeader() {
  return (
    <div className="w-[296px] h-[33px] flex justify-between items-center font-['Pretendard']">
      
      <button className="w-[33px] h-[33px] flex items-center justify-center">
        <div className="rotate-90 text-gray-200"> 
          <svg width="14" height="7" viewBox="0 0 14 7" fill="none" className="text-inherit">
            <path d="M1 1L7 6L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      <span className="text-[14px] font-medium text-gray-950 leading-[20px]">
        2025년 11월
      </span>

      <button className="w-[33px] h-[33px] flex items-center justify-center">
        <div className="-rotate-90 text-gray-200"> 
          <svg width="14" height="7" viewBox="0 0 14 7" fill="none" className="text-inherit">
            <path d="M1 1L7 6L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
      
    </div>
  );
}