"use client";

import Image from "next/image";

export default function CalendarHeader() {
  return (
    /* Frame 1707482893: 너비 296px, 높이 33px, 좌우 정렬(space-between) */
    <div className="w-[296px] h-[33px] flex justify-between items-center font-['Pretendard']">
      
      {/* 1. 왼쪽 화살표: 33x33px 영역, 내부 아이콘 -90도 회전 */}
      <button className="w-[33px] h-[33px] flex items-center justify-center">
        <div className="rotate-90"> {/* 시안의 < 모양을 위해 회전 반영 */}
          <svg width="14" height="7" viewBox="0 0 14 7" fill="none">
            <path d="M1 1L7 6L13 1" stroke="#D1D1D1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {/* 2. 텍스트 '2025년 11월': 14px Medium, #1F1F1F */}
      <span className="text-[14px] font-medium text-gray-950 leading-[20px]">
        2025년 11월
      </span>

      {/* 3. 오른쪽 화살표: 33x33px 영역 */}
      <button className="w-[33px] h-[33px] flex items-center justify-center">
        <div className="-rotate-90"> {/* 시안의 > 모양을 위해 회전 반영 */}
          <svg width="14" height="7" viewBox="0 0 14 7" fill="none">
            <path d="M1 1L7 6L13 1" stroke="#D1D1D1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
      
    </div>
  );
}