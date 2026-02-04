'use client';

import { useState } from 'react';
import Image from 'next/image';
import BottomSheet from '@/components/ui/BottomSheet';
import ApplicantSummaryCard from '@/components/ui/ApplicantSummaryCard';
import Button from '@/components/ui/Btn';
import { mockApplicants } from '@/data/applicants';
import type { Applicant } from '@/types/applicant';

export default function ApplicantMessageCard() {
  const [isPersonalMessageOpen, setIsPersonalMessageOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  // 합격자만 필터링
  const passedApplicants = mockApplicants.filter((applicant) => applicant.status === '합격');

  // 지원자 클릭 핸들러
  const handleApplicantClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsPersonalMessageOpen(true);
  };

  return (
    <>
      <div className="mt-3">
        <h3 className="text-subtitle-sm-md pb-0.5">합격자 개인별 메세지</h3>
        {/* 명단/전화번호 복사 안내 문구 */}
        <div className="flex items-center gap-2.5 mb-1">
          <button className="flex items-center gap-1 text-gray-400 text-[12px] font-medium leading-[22px]">
            <Image src="/icons/copy-gray.svg" alt="명단 복사하기" width={15} height={15} />
            <span>명단 복사하기</span>
          </button>
          <button className="flex items-center gap-1 text-gray-400 text-[12px] font-medium leading-[22px]">
            <Image src="/icons/hashtag-gray.svg" alt="전화번호 복사하기" width={15} height={15} />
            <span>전화번호 복사하기</span>
          </button>
        </div>        
        
        <div className="-mx-4">
          {passedApplicants.map((applicant) => (
            <ApplicantSummaryCard
              key={applicant.id}
              name={applicant.name}
              university={applicant.university}
              major={applicant.major}
              role={applicant.position}
              onClick={() => handleApplicantClick(applicant)}
            />
          ))}
        </div>
      </div>

      {/* 바텀시트 - 합격자 개인별 페이지 */}
      <BottomSheet isOpen={isPersonalMessageOpen} onClose={() => setIsPersonalMessageOpen(false)}>
        {selectedApplicant && (
          <>
            <h2 className="text-subtitle-sm-md text-black pt-3 pb-1">{selectedApplicant.name}</h2>
            <h3 className="text-body-rg text-gray-400">
              {selectedApplicant.university}/{selectedApplicant.major}/{selectedApplicant.position}
            </h3>
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

            {/* 템플릿 텍스트 */}
            <div className="flex flex-col gap-4 py-4 text-body-sm-rg">
              <h2>[요리퐁 6기 서류 결과]</h2>

              <div>
                <p className="mb-1">요리퐁 6기에 지원해 주셔서 감사합니다.</p>
                <p>
                  내부 심사 결과 <span className="text-primary">{selectedApplicant.name}</span> 님은 서류 전형에
                  통과하셨습니다!
                </p>
              </div>

              <p>다음 단계 면접 일정 조율을 위해...</p>
            </div>
          </>
        )}
      </BottomSheet>
    </>
  );
}