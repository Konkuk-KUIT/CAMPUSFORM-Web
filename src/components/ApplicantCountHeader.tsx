'use client';

import { useState } from 'react';
import BottomSheet from '@/components/BottomSheet';
import Image from 'next/image';
import Button from '@/components/Btn';

export default function ApplicantCountHeader() {
  const [isApplicantListOpen, setIsApplicantListOpen] = useState(false);
  return (
    <>
      <div
        className="bg-white rounded-10 border border-blue-100 px-4 py-6 flex items-center justify-between [box-shadow:2px_2px_20px_0px_rgba(0,0,0,0.03)] cursor-pointer"
        onClick={() => setIsApplicantListOpen(true)}
      >
        <h2 className="text-subtitle-sm-md text-gray-800">
          서류 합격자 명단 <span className="text-gray-600">(00명)</span>
        </h2>
        <button className="flex items-center gap-1 text-primary text-body-sm">
          전체보기
          <Image src={'/icons/chevron-down-blue.svg'} alt="펼치기" width={7} height={5} />
        </button>
      </div>

      {/* 바텀시트 - 서류 합격자 명단 */}
      <BottomSheet isOpen={isApplicantListOpen} onClose={() => setIsApplicantListOpen(false)}>
        <h2 className="text-subtitle-sm-md text-gray-800 pt-3">
          서류 합격자 명단 <span className="text-gray-600">(00명)</span>
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

        {/* 합격자 리스트 */}
        <div className="flex flex-col font-normal text-[13px] leading-6.5 py-3">
          <p>김민준 (건국대 / 컴퓨터공학과 / 오리사)</p>
          <p>이서연 (ㅇㅇ대 / 시각디자인과 / 일반부원)</p>
          <p>최수빈 (ㅇㅇ대 / 경영학과 / 일반부원)</p>
          <p>황세연 (ㅇㅇ대 / 호텔관광학과 / 조리사)</p>
          <p>최민혁 (ㅇㅇ대 / 체육학과 / 일반부원)</p>
          <p>조은채 (ㅇㅇ대 / 문헌정보학과 / 일반부원)</p>
          <p>백서준 (ㅇㅇ대 / 화학공학과 / 일반부원)</p>
          <p>오지우 (ㅇㅇ대 / 관광경영학과 / 조리사)</p>
          <p>이도현 (ㅇㅇ대 / 심리학과 / 일반부원)</p>
        </div>
      </BottomSheet>
    </>
  );
}
