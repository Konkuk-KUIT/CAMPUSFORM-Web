"use client";

import { useState } from "react";

interface ProfileCardProps {
  nickname: string;
  email: string;
  isExpanded?: boolean;
}

export default function ProfileCard({
  nickname,
  email,
  isExpanded: initialExpanded = false,
}: ProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    /* 너비 343px, 높이 66px, 양 끝 정렬 */
    <div className="w-[343px] h-[66px] bg-white flex items-center justify-between px-[20px] py-[8px] font-['Pretendard'] border-b border-gray-100">
      
      <div className="flex items-center gap-[10px]">
        {/* 프로필 이미지 35x35 */}
        <div className="w-[35px] h-[35px] bg-[#D9D9D9] rounded-full flex-shrink-0" />

        <div className="flex flex-col">
          {/* text-subtitle-md (16px) */}
          <h3 className="text-subtitle-md text-gray-950 leading-tight">
            {nickname}
          </h3>
          {/* text-body-rg (14px) */}
          <p className="text-body-rg text-gray-500">
            {email}
          </p>
        </div>
      </div>

      {/* 화살표 대신 X 아이콘으로 변경 */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-[24px] h-[24px] flex items-center justify-center text-gray-950"
      >
        <svg 
          width="20" height="20" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          {/* X 모양을 만드는 패스 */}
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

    </div>
  );
}