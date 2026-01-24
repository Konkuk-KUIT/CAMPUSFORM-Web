'use client';

import Image from 'next/image';

interface ApplicantSummaryCardProps {
  name: string; // 김민준
  university: string; // 건국대
  major: string; // 컴퓨터공학과
  role: string; // 요리사
  onClick?: () => void;
}

export default function ApplicantSummaryCard({ name, university, major, role, onClick }: ApplicantSummaryCardProps) {
  return (
    <div className="relative w-full h-14.75 bg-white flex items-center px-6.5 cursor-pointer" onClick={onClick}>
      <div className="flex flex-col flex-1">
        <h3 className="text-body-sm text-gray-950">{name}</h3>

        <div className="flex items-center mt-0.5">
          <p className="text-body-sm-rg text-gray-400">
            {university} / {major} / {role}
          </p>
          <Image src="/icons/chevron-right.svg" alt="" width={18} height={18} />
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">
          <Image src="/icons/copy.svg" alt="copy" width={20} height={20} />
        </button>

        <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">
          <Image src="/icons/hashtag.svg" alt="tag" width={20} height={20} />
        </button>
      </div>
    </div>
  );
}
