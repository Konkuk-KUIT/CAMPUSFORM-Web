"use client";

interface ScheduleSummaryCardProps {
  title: string;
  timeRange: string;
  isChecked?: boolean;
}

export default function ScheduleSummaryCard({ title, timeRange, isChecked = false }: ScheduleSummaryCardProps) {
  return (
    <div className="relative w-[311px] h-[54px] bg-blue-50 rounded-[10px] flex items-center font-['Pretendard'] overflow-hidden">
      <div className="absolute left-[6px] top-[8px] w-[7px] h-[38px] bg-primary rounded-[10px]" />

      <div className="flex flex-col ml-[27px]">
        <h4 className="text-body-rg text-gray-950">
          {title}
        </h4>
        <p className="text-body-xs-rg text-gray-500">
          {timeRange}
        </p>
      </div>

      <div className="absolute left-[276px] top-[17px] w-[20px] h-[20px] flex items-center justify-center">
        <div className={`w-[18px] h-[18px] rounded-full border-[1.2px] ${isChecked ? "bg-primary border-primary" : "border-primary"}`}>
          {isChecked && (
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="p-[2px]">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}