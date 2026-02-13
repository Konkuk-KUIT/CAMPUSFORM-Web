'use client';

import { useState } from 'react';
import BottomSheet from '@/components/ui/BottomSheet';
import Image from 'next/image';
import Button from '@/components/ui/Btn';
import { mockApplicants } from '@/data/applicants';

interface ApplicantCountHeaderProps {
  type: '합격자' | '불합격자';
}

const copyToClipboard = (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

export default function ApplicantCountHeader({ type }: ApplicantCountHeaderProps) {
  const [isApplicantListOpen, setIsApplicantListOpen] = useState(false);

  const filteredApplicants = mockApplicants.filter(applicant =>
    type === '합격자' ? applicant.status === '합격' : applicant.status === '불합격'
  );

  const title = `서류 ${type} 명단`;
  const count = filteredApplicants.length;

  const handleCopyList = () => {
    const text = filteredApplicants
      .map(a => `${a.name} (${a.university} / ${a.major} / ${a.position})`)
      .join('\n');
    copyToClipboard(text);
  };

  const handleCopyPhones = () => {
    const text = filteredApplicants
      .map(a => a.phoneNumber)
      .filter(Boolean)
      .join('\n');
    copyToClipboard(text as string);
  };

  return (
    <>
      <div
        className="bg-white rounded-10 border border-blue-100 px-4 py-6 flex items-center justify-between [box-shadow:2px_2px_20px_0px_rgba(0,0,0,0.03)] cursor-pointer"
        onClick={() => setIsApplicantListOpen(true)}
      >
        <h2 className="text-subtitle-sm-md text-gray-800">
          {title} <span className="text-gray-600">({count}명)</span>
        </h2>
        <button className="flex items-center gap-1 text-primary text-body-sm">
          전체보기
          <Image src={'/icons/chevron-down-blue.svg'} alt="펼치기" width={7} height={5} />
        </button>
      </div>

      {/* 바텀시트 - 서류 합격자/불합격자 명단 */}
      <BottomSheet isOpen={isApplicantListOpen} onClose={() => setIsApplicantListOpen(false)}>
        <h2 className="text-subtitle-sm-md text-gray-800 pt-3">
          {title} <span className="text-gray-600">({count}명)</span>
        </h2>

        {/* 버튼 */}
        <div className="flex gap-2 justify-center items-center pt-3">
          <Button
            variant="outline"
            size="md"
            className="inline-flex items-center justify-center gap-1"
            onClick={handleCopyList}
          >
            <span>명단 복사하기</span>
            <Image src="/icons/copy-blue.svg" alt="" width={15} height={15} />
          </Button>
          <Button
            variant="outline"
            size="md"
            className="inline-flex items-center justify-center gap-1"
            onClick={handleCopyPhones}
          >
            <span>전화번호 복사하기</span>
            <Image src="/icons/tag-blue.svg" alt="" width={15} height={15} />
          </Button>
        </div>

        {/* 합격자/불합격자 리스트 */}
        <div className="flex flex-col font-normal text-[13px] leading-6.5 py-3">
          {filteredApplicants.map(applicant => (
            <p key={applicant.applicantId}>
              {applicant.name} ({applicant.university} / {applicant.major} / {applicant.position})
            </p>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}