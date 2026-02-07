'use client';

import { useState } from 'react';
import BottomSheet from '@/components/ui/BottomSheet';
import Image from 'next/image';
import Button from '@/components/ui/Btn';
import { getPassedInterviewApplicants, getFailedInterviewApplicants } from '@/data/interviews';

interface ApplicantCountHeaderProps {
  type: '합격자' | '불합격자';
}

export default function ApplicantCountHeader({ type }: ApplicantCountHeaderProps) {
  const [isApplicantListOpen, setIsApplicantListOpen] = useState(false);

  // 합격자/불합격자 데이터 가져오기
  const applicants = type === '합격자' ? getPassedInterviewApplicants() : getFailedInterviewApplicants();
  const count = applicants.length;

  const title = type === '합격자' ? '면접 합격자 명단' : '면접 불합격자 명단';

  return (
    <>
      <div
        className="bg-white rounded-10 border border-blue-100 px-4 py-6 flex items-center justify-between [box-shadow:2px_2px_20px_0px_rgba(0,0,0,0.03)] cursor-pointer mb-4"
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

      {/* 바텀시트 - 면접 합격자/불합격자 명단 */}
      <BottomSheet isOpen={isApplicantListOpen} onClose={() => setIsApplicantListOpen(false)}>
        <h2 className="text-subtitle-sm-md text-gray-800 pt-3">
          {title} <span className="text-gray-600">({count}명)</span>
        </h2>

        {/* 버튼 */}
        <div className="flex gap-2 justify-center items-center pt-3">
          <Button variant="outline" size="md" className="inline-flex items-center justify-center gap-1">
            <span>명단 복사하기</span>
            <Image src="/icons/copy-blue.svg" alt="" width={15} height={15} />
          </Button>
          <Button variant="outline" size="md" className="inline-flex items-center justify-center gap-1">
            <span>전화번호 복사하기</span>
            <Image src="/icons/tag-blue.svg" alt="" width={15} height={15} />
          </Button>
        </div>

        {/* 합격자/불합격자 리스트 */}
        <div className="flex flex-col font-normal text-[13px] leading-6.5 py-3">
          {applicants.length === 0 ? (
            <p className="text-center text-gray-400 py-4">명단이 없습니다.</p>
          ) : (
            applicants.map((applicant) => (
              <p key={applicant.id}>
                {applicant.name} ({applicant.university} / {applicant.major} / {applicant.position})
              </p>
            ))
          )}
        </div>
      </BottomSheet>
    </>
  );
}