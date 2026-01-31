"use client";

interface ApplicantInterviewCardProps {
  name: string;
  info: string;
  status: string;
  interviewDate: string; // 추가: "11월 15일 (수) 14:00"
  commentCount?: number;
}

export default function ApplicantInterviewCard({
  name,
  info,
  status,
  interviewDate,
  commentCount = 0,
}: ApplicantInterviewCardProps) {
  return (
    <div className="relative w-[343px] h-[75px] bg-white border-b border-gray-100 flex items-center px-[20px] font-['Pretendard']">
      
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-[10px]">
          <h3 className="text-subtitle-sm-md text-gray-950">
            {name}
          </h3>
          
          <div className="px-[5px] bg-blue-100 rounded-[4px]">
            <span className="text-body-xs-rg text-gray-950 font-medium">
              {interviewDate}
            </span>
          </div>
        </div>

        <p className="mt-[4px] text-body-md text-gray-400">
          {info}
        </p>
      </div>

      <div className="flex flex-col items-end gap-[8px]">
        <div className="flex items-center gap-[5px] px-[14px] py-[3px] bg-white border border-gray-200 rounded-[6px] text-body-sm text-gray-950 cursor-pointer">
          <span className="w-[6px] h-[6px] rounded-full bg-gray-400" />
          <span>{status}</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="flex items-center gap-[10px] text-gray-300">
          <div className="flex items-center gap-[4px]">
            <div className="w-[16px] h-[16px] flex items-center justify-center">
              <img src="/icons/comment.svg" alt="comment" className="w-full h-full" />
            </div>
            <span className="text-body-xs-rg text-gray-300">{commentCount}</span>
          </div>
          <div className="w-[18px] h-[18px] flex items-center justify-center cursor-pointer">
            <img src="/icons/star-off.svg" alt="star" className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}