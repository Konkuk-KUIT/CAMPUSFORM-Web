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
  onClick?: () => void;
}

export default function RecruitmentCard({
  id,
  status = 'off',
  title,
  recruitmentStatus,
  dateRange,
  applicantCount,
  onDelete,
  onClick,
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
      router.push(`/manage/${id}`);
    } else if (value === 'delete') {
      onDelete(id);
    }
  };

  const isActive = status === 'on';

  const cardClasses = clsx(
    'group relative w-[343px] h-[130px] rounded-10 overflow-hidden cursor-pointer transition-colors shadow-[0px_2px_10px_0px_#0000000D]',
    {
      'bg-[#FFFFFF] hover:bg-[#DBE3FE] active:bg-[#BFCEFE] border border-gray-100': isActive,
      'bg-[#EFEFEF] hover:bg-[#EFEFEF] active:bg-[#E3E3E3] border border-[#E6E6E6] hover:border-[#D9D9D9] active:border-[#E3E3E3]': !isActive,
    }
  );

  const titleClasses = clsx(
    'w-[160px] h-[22px] text-subtitle-sb whitespace-nowrap truncate',
    {
      'text-gray-950': isActive,
      'text-[#B0B0B0] group-hover:text-[#9F9F9F] group-active:text-[#ADADAD]': !isActive,
    }
  );

  const recruitmentStatusClasses = clsx('text-body-sm mb-[2px]', {
    'text-gray-600': isActive,
    'text-[#B0B0B0] group-hover:text-[#9F9F9F] group-active:text-[#ADADAD]': !isActive,
  });

  const dateRangeClasses = clsx('text-subtitle-sm-rg', {
    'text-gray-400': isActive,
    'text-[#B0B0B0] group-hover:text-[#9F9F9F] group-active:text-[#ADADAD]': !isActive,
  });

  const applicantCountClasses = clsx('text-body-rg', {
    'text-gray-950': isActive,
    'text-[#B0B0B0] group-hover:text-[#9F9F9F] group-active:text-[#ADADAD]': !isActive,
  });

  const applicantCountSpanClasses = clsx('font-semibold', {
    'text-primary': isActive,
  });

  const moreButtonClasses = clsx(
    'absolute top-[16px] right-[16px] w-[24px] h-[24px] flex flex-col items-center justify-center gap-[3px] rounded-full z-10 cursor-pointer',
    {
      'text-gray-950': isActive,
      'text-[#B0B0B0] group-hover:text-[#9F9F9F] group-active:text-[#ADADAD]': !isActive,
    }
  );

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="flex flex-col justify-between h-full py-[16px] pl-[25px] pr-[16px]">
        <h2 className={titleClasses}>{title}</h2>

        <div className="flex flex-col gap-[2px]">
          <p className={recruitmentStatusClasses}>{recruitmentStatus}</p>
          <p className={dateRangeClasses}>{dateRange}</p>
          <p className={applicantCountClasses}>
            <span className={applicantCountSpanClasses}>{applicantCount}명</span> 지원
          </p>
        </div>
      </div>

      <button
        onClick={e => {
          e.stopPropagation();
          setIsMenuOpen(!isMenuOpen);
        }}
        className={moreButtonClasses}
      >
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
        <span className="w-[3.5px] h-[3.5px] bg-current rounded-full" />
      </button>

      {isMenuOpen && (
        <div
          className="absolute top-[48px] right-[16px] z-20 shadow-[0_2px_8px_rgba(0,0,0,0.1)] rounded-10"
          onClick={e => e.stopPropagation()}
        >
          <SelectModal options={modalOptions} onChange={handleMenuSelect} backgroundColor="white" width="w-[102px]" />
        </div>
      )}
    </div>
  );
}