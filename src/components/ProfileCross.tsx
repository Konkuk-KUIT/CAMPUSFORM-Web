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
    <div className="w-[343px] h-[66px] bg-white flex items-center justify-between px-[20px] py-[8px] font-['Pretendard'] border-b border-gray-100">
      
      <div className="flex items-center gap-[10px]">
        <div className="w-[35px] h-[35px] bg-[#D9D9D9] rounded-full flex-shrink-0" />

        <div className="flex flex-col">
          <h3 className="text-subtitle-md text-gray-950 leading-tight">
            {nickname}
          </h3>
          <p className="text-body-rg text-gray-500">
            {email}
          </p>
        </div>
      </div>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-[24px] h-[24px] flex items-center justify-center text-gray-950"
      >
        <svg 
          width="20" height="20" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

    </div>
  );
}