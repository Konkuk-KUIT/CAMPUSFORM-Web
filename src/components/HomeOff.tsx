"use client";

interface RecruitmentCardProps {
  title: string;
  status: string;
  dateRange: string;
  applicantCount: number;
}

export default function RecruitmentCard({
  title,
  status,
  dateRange,
  applicantCount,
}: RecruitmentCardProps) {
  return (
    <div className="group relative w-[343px] h-[130px] rounded-[10px] shadow-sm overflow-hidden font-['Pretendard'] transition-all duration-200 cursor-pointer
                    bg-gray-100 hover:bg-gray-200 active:bg-gray-300 border border-gray-100">
      
      <h2 className="absolute top-[16px] left-[25px] w-[160px] h-[22px] text-subtitle-sb whitespace-nowrap truncate transition-colors duration-200
                     text-gray-200 group-hover:text-gray-300 group-active:text-gray-400">
        {title}
      </h2>

      <div className="absolute top-[42px] left-[25px] flex flex-col">
        <p className="text-body-sm mb-[2px] transition-colors duration-200
                      text-gray-200 group-hover:text-gray-300 group-active:text-gray-400">
          {status}
        </p>
        
        <p className="text-subtitle-sm-rg mb-[16px] transition-colors duration-200
                      text-gray-200 group-hover:text-gray-300 group-active:text-gray-400">
          {dateRange}
        </p>
        
        <p className="text-body-rg transition-colors duration-200
                      text-gray-200 group-hover:text-gray-300 group-active:text-gray-400">
          <span className="font-semibold">{applicantCount}명</span> 지원
        </p>
      </div>

      <button 
        onClick={(e) => e.stopPropagation()}
        className="absolute top-[20px] right-[16px] w-[24px] h-[24px] flex flex-col items-center justify-center gap-[3px] rounded-full transition-colors
                   text-gray-950 hover:bg-gray-50"
      >
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
      </button>

    </div>
  );
}