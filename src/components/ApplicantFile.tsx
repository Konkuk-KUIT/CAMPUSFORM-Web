"use client";

interface ApplicantFileCardProps {
  name: string;
  info: string;
  status: string;
  commentCount?: number;
}

export default function ApplicantFileCard({
  name,
  info,
  status,
  commentCount = 0,
}: ApplicantFileCardProps) {
  return (
    <div className="relative w-[343px] h-[75px] bg-white border-b border-gray-100 flex items-center px-[20px] font-['Pretendard']">
      
      <div className="flex flex-col flex-1">
        <h3 className="text-subtitle-sm-md text-gray-950">
          {name}
        </h3>
        <p className="mt-[4px] text-body-md text-gray-400">
          {info}
        </p>
      </div>

      <div className="flex flex-col items-end gap-[8px]">
        <div className="flex items-center gap-[4px] px-[8px] py-[2px] bg-white border border-gray-200 rounded-[6px] text-body-sm text-gray-950 cursor-pointer">
          <span className="w-[6px] h-[6px] rounded-full bg-gray-400" />
          <span>{status}</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="flex items-center gap-[10px] text-gray-300">
          <div className="flex items-center gap-[4px]">
            <div className="w-[16px] h-[16px] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              </svg>
            </div>
            <span className="text-body-xs-rg text-gray-300">{commentCount}</span>
          </div>
          <div className="w-[20px] h-[20px] flex items-center justify-center cursor-pointer">
            <svg width="18" height="18">
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}