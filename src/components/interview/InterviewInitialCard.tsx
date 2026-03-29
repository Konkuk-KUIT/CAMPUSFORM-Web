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
      className="relative flex flex-col items-center justify-center rounded-10 border-[1.5px] border-gray-100 bg-white"
      style={{ width: '343px', height: '208px', boxShadow: '0px 2px 2px 0px #0000000F' }}
    >
      <Image
        src="/icons/icon-right.svg"
        alt=""
        width={42}
        height={42}
        className="absolute right-4 top-1/2 -translate-y-1/2"
      />
      <Image src={icon} alt="" width={55} height={55} className="mb-3" />
      <h3 className="text-title text-primary text-center mb-1">{title}</h3>
      <p className="text-body-rg text-gray-950 text-center [font-variant-numeric:lining-nums_proportional-nums] mb-4">{description}</p>
      <p className="text-body-xs-rg text-gray-500 text-center tracking-[1%] [font-variant-numeric:lining-nums_proportional-nums]">{note}</p>
    </button>
  );
}