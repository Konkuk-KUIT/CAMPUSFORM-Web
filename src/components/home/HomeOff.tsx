"use client";
import SelectModal from '@/components/SelectModal'; // 1. 임포트 확인!
import { useState } from 'react';
import { useRouter } from 'next/navigation';
interface HomeOffProps {
  title: string;
  status: string;
  dateRange: string;
  applicantCount: number;
}

export default function HomeOff({
  title,
  status,
  dateRange,
  applicantCount,
}: HomeOffProps) {

// 1. 메뉴 열림 상태 관리
const [isMenuOpen, setIsMenuOpen] = useState(false);
const router = useRouter();

// 2. 모달에 넘겨줄 옵션 데이터
const modalOptions = [
  { id: 'settings', label: '설정하기' },
  { id: 'delete', label: '삭제하기' },
];

// 3. 메뉴 선택 핸들러
const handleMenuSelect = (value: string) => {
  console.log(`선택된 메뉴: ${value}`);
  
  if (value === 'settings') {
    router.push('/home/manage');
  } else if (value === 'delete') {
    // 삭제하기 로직
  }

  setIsMenuOpen(false); // 선택 후 메뉴 닫기
};

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
        onClick={(e) => {
          e.stopPropagation(); // 카드 클릭 이벤트 방지
          setIsMenuOpen(!isMenuOpen); // 켜고 끄기 토글
        }}
        className="absolute top-[20px] right-[16px] w-[24px] h-[24px] flex flex-col items-center justify-center gap-[3px] rounded-full transition-colors text-gray-950 hover:bg-gray-50 z-10"
      >
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
      </button>

      {/* 4. 점 3개 버튼 */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // 카드 클릭 방지
          setIsMenuOpen(!isMenuOpen); // 토글
        }}
        className="absolute top-[20px] right-[16px] w-[24px] h-[24px] flex flex-col items-center justify-center gap-[3px] rounded-full transition-colors text-gray-950 hover:bg-gray-50 z-10"
      >
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
      </button>

      {/* 5. 셀렉트 모달 (조건부 렌더링) */}
      {isMenuOpen && (
        // 위치: 버튼(top:20, h:24) 바로 아래인 48px 지점에 배치
        // 그림자(shadow-lg) 추가: SelectModal 자체에 그림자가 없다면 여기서 줘야 붕 떠보입니다.
        <div className="absolute top-[48px] right-[16px] z-20 shadow-[0_2px_8px_rgba(0,0,0,0.1)] rounded-10">
          <SelectModal 
            options={modalOptions}
            onChange={handleMenuSelect}
            backgroundColor="white" // 필요시 gray-100
            width="w-[102px]"      // 너비 지정
          />
        </div>
      )}

    </div>
  );
}