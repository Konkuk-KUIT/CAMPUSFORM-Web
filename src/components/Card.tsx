"use client";

interface ApplicantSummaryCardProps {
  name: string;        // 김민준
  university: string;  // 건국대
  major: string;       // 컴퓨터공학과
  role: string;        // 요리사
}

export default function ApplicantSummaryCard({
  name,
  university,
  major,
  role,
}: ApplicantSummaryCardProps) {
  return (
    <div className="relative w-[375px] h-[59px] bg-white flex items-center px-[26px] font-['Pretendard']">
      
      <div className="flex flex-col flex-1">
        <h3 className="text-[13px] font-medium leading-[18px] text-gray-950">
          {name}
        </h3>
        
        <div className="flex items-center gap-[4px] mt-[2px]">
          <p className="text-[13px] text-gray-400 leading-[18px]">
            {university} / {major} / {role}
          </p>

        </div>
      </div>

      <div className="flex items-center gap-[10px]">
        <button className="w-[40px] h-[40px] rounded-full bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">
          <img src="/icons/copy.svg" alt="copy" className="w-[20px] h-[20px]" />
        </button>

        <button className="w-[40px] h-[40px] rounded-full bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">
          <span className="text-[20px] font-light">#</span>
        </button>
      </div>

    </div>
  );
}