"use client";
import SelectModal from '@/components/SelectModal';
import { useState } from 'react';
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


const [isMenuOpen, setIsMenuOpen] = useState(false);

const modalOptions = [
  { id: 'settings', label: '설정하기' },
  { id: 'delete', label: '삭제하기' },
];

const handleMenuSelect = (value: string) => {
  console.log(`선택된 메뉴: ${value}`);
  
  if (value === 'settings') {
    // 설정하기 로직 
  } else if (value === 'delete') {
    // 삭제하기 로직
  }
  setIsMenuOpen(false);
};

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

      <button 
        onClick={(e) => {
          e.stopPropagation(); 
          setIsMenuOpen(!isMenuOpen);
        }}
        className="absolute top-[20px] right-[16px] w-[24px] h-[24px] flex flex-col items-center justify-center gap-[3px] rounded-full transition-colors text-gray-950 hover:bg-gray-50 z-10"
      >
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
      </button>

      {isMenuOpen && (
        <div className="absolute top-[48px] right-[16px] z-20 shadow-[0_2px_8px_rgba(0,0,0,0.1)] rounded-10">
          <SelectModal 
            options={modalOptions}
            onChange={handleMenuSelect}
            backgroundColor="white" 
            width="w-[102px]"     
          />
        </div>
      )}

    </div>
  );
}