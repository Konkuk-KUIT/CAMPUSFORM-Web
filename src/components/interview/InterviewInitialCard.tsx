'use client';
//개별 카드 컴포넌트

import Image from 'next/image';

interface InterviewInitialCardProps {
  icon: string;
  title: string;
  description: string;
  note: string;
  onClick: () => void;
}

export default function InterviewInitialCard({
  icon,
  title,
  description,
  note,
  onClick,
}: InterviewInitialCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-10 border-[1.5px] border-gray-200 bg-white p-5 text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-[30px] h-[30px] flex items-center justify-center flex-shrink-0">
          <Image src={icon} alt="" width={45} height={45} />
        </div>
        <div className="flex-1">
          <h3 className="text-subtitle-sm-sb text-primary mb-1">{title}</h3>
          <p className="text-body-md text-black mb-1">{description}</p>
          <p className="text-body-xs-rg text-black tracking-[0.12px]">{note}</p>
        </div>
      </div>
    </button>
  );
}