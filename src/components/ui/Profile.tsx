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
    <div className="w-[343px] h-[66px] bg-white flex items-center justify-between px-[2px] py-[8px] font-['Pretendard']">
      
      <div className="flex items-center gap-[10px]">
        <div className="w-[35px] h-[35px] bg-[#D9D9D9] rounded-full flex-shrink-0" />

        <div className="flex flex-col">
          <h3 className="text-subtitle-md text-gray-950">
            {nickname}
          </h3>
          <p className="text-body-rg text-gray-500">
            {email}
          </p>
        </div>
      </div>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-[24px] h-[24px] flex items-center justify-center text-gray-950 transition-transform duration-200"
      >
        <svg 
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={isExpanded ? "rotate-180" : ""}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

    </div>
  );
}