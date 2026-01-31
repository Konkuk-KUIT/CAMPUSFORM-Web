'use client';
import SelectModal from '@/components/ui/SelectModal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

type RecruitmentStatus = 'on' | 'off';

interface RecruitmentCardProps {
  id: number;
  status: RecruitmentStatus;
  title: string;
  recruitmentStatus: string;
  dateRange: string;
  applicantCount: number;
  onDelete: (id: number) => void;
}

export default function RecruitmentCard({
  id,
  status = 'off',
  title,
  recruitmentStatus,
  dateRange,
  applicantCount,
  onDelete,
}: RecruitmentCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const modalOptions = [
    { id: 'settings', label: '설정하기' },
    { id: 'delete', label: '삭제하기' },
  ];

  const handleMenuSelect = (value: string) => {
    setIsMenuOpen(false);
    if (value === 'settings') {
      router.push('/home/manage');
    } else if (value === 'delete') {
      onDelete(id);
    }
  };

  const isActive = status === 'on';

  const cardClasses = clsx(
    "relative w-[343px] h-[130px] rounded-10 shadow-sm overflow-hidden font-['Pretendard'] cursor-pointer transition-all duration-200",
    {
      'bg-white border border-gray-100 hover:bg-blue-100 active:bg-blue-200': isActive,
      'group bg-gray-100 border border-gray-100 hover:bg-gray-200 active:bg-gray-300': !isActive,
    }
  );

  const titleClasses = clsx(
    'absolute top-[16px] left-[25px] w-[160px] h-[22px] text-subtitle-sb whitespace-nowrap truncate',
    {
      'text-gray-950': isActive,
      'text-gray-200 group-hover:text-gray-300 group-active:text-gray-400': !isActive,
    }
  );

  const recruitmentStatusClasses = clsx('text-body-sm mb-[2px]', {
    'text-gray-600': isActive,
    'text-gray-200 group-hover:text-gray-300 group-active:text-gray-400': !isActive,
  });

  const dateRangeClasses = clsx('text-subtitle-sm-rg mb-[16px]', {
    'text-gray-400': isActive,
    'text-gray-200 group-hover:text-gray-300 group-active:text-gray-400': !isActive,
  });

  const applicantCountClasses = clsx('text-body-rg', {
    'text-gray-950': isActive,
    'text-gray-200 group-hover:text-gray-300 group-active:text-gray-400': !isActive,
  });

  const applicantCountSpanClasses = clsx('font-semibold', {
    'text-primary': isActive,
  });

  return (
    <div className={cardClasses}>
      <h2 className={titleClasses}>{title}</h2>

      <div className="absolute top-[42px] left-[25px] flex flex-col">
        <p className={recruitmentStatusClasses}>{recruitmentStatus}</p>

        <p className={dateRangeClasses}>{dateRange}</p>

        <p className={applicantCountClasses}>
          <span className={applicantCountSpanClasses}>{applicantCount}명</span> 지원
        </p>
      </div>

      <button
        onClick={e => {
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
          <SelectModal options={modalOptions} onChange={handleMenuSelect} backgroundColor="white" width="w-[102px]" />
        </div>
      )}
    </div>
  );
}
