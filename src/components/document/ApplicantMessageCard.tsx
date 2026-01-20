'use client';

import { useState } from 'react';
import Image from 'next/image';
import BottomSheet from '@/components/BottomSheet';
import ApplicantSummaryCard from '@/components/Card';
import Button from '@/components/Btn';

export default function ApplicantMessageCard() {
  const [isPersonalMessageOpen, setIsPersonalMessageOpen] = useState(false);
  return (
    <>
      <div className="mt-3">
        <h3 className="text-subtitle-sm-md pb-3">합격자 개인별 메세지</h3>
        <div className="-mx-4">
          <ApplicantSummaryCard
            name="김민준"
            university="건국대"
            major="컴퓨터공학과"
            role="요리사"
            onClick={() => setIsPersonalMessageOpen(true)}
          />
          <ApplicantSummaryCard
            name="백서준"
            university="ㅇㅇ대"
            major="화학공학과"
            role="일반부원"
            onClick={() => setIsPersonalMessageOpen(true)}
          />
          <ApplicantSummaryCard
            name="오지우"
            university="ㅇㅇ대"
            major="관광경영학과"
            role="조리사"
            onClick={() => setIsPersonalMessageOpen(true)}
          />
          <ApplicantSummaryCard
            name="오지우"
            university="ㅇㅇ대"
            major="관광경영학과"
            role="조리사"
            onClick={() => setIsPersonalMessageOpen(true)}
          />
          <ApplicantSummaryCard
            name="오지우"
            university="ㅇㅇ대"
            major="관광경영학과"
            role="조리사"
            onClick={() => setIsPersonalMessageOpen(true)}
          />
          <ApplicantSummaryCard
            name="오지우"
            university="ㅇㅇ대"
            major="관광경영학과"
            role="조리사"
            onClick={() => setIsPersonalMessageOpen(true)}
          />
        </div>
      </div>

      {/* 바텀시트 - 합격자 개인별 페이지 */}
      <BottomSheet isOpen={isPersonalMessageOpen} onClose={() => setIsPersonalMessageOpen(false)}>
        <h2 className="text-subtitle-sm-md text-black pt-3 pb-1">김민준</h2>
        <h3 className="text-body-rg text-gray-400">건국대/컴퓨터공학과/요리사</h3>
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
          <h2>[오리퐁 6기 서류 결과]</h2>

          <div>
            <p className="mb-1">오리퐁 6기에 지원해 주셔서 감사합니다.</p>
            <p>
              내부 심사 결과 <span className="text-primary">김민준</span> 님은 서류 전형에 통과하셨습니다!
            </p>
          </div>

          <p>다음 단계 면접 일정 조율을 위해...</p>
        </div>
      </BottomSheet>
    </>
  );
}
