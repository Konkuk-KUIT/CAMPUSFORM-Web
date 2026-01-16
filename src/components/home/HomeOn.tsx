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
    <div className="relative w-[343px] h-[130px] bg-white border border-gray-100 rounded-[10px] shadow-sm overflow-hidden font-['Pretendard'] hover:bg-blue-100 active:bg-blue-200">
      
      <h2 className="absolute top-[16px] left-[25px] w-[160px] h-[22px] text-subtitle-sb text-gray-950 whitespace-nowrap truncate">
        {title}
      </h2>

      <div className="absolute top-[42px] left-[25px] flex flex-col">
        <p className="text-body-sm text-gray-600 mb-[2px]">
          {status}
        </p>
        
        <p className="text-subtitle-sm-rg text-gray-400 mb-[16px]">
          {dateRange}
        </p>
        
        <p className="text-body-rg text-gray-950">
          <span className="text-primary font-semibold">{applicantCount}명</span> 지원
        </p>
      </div>

      <button className="absolute top-[20px] right-[16px] w-[24px] h-[24px] flex flex-col items-center justify-center gap-[3px] text-gray-950 hover:bg-gray-50 rounded-full transition-colors">
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
      </button>

    </div>
  );
}