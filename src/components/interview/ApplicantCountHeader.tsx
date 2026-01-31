'use client';

import { useState } from 'react';
import BottomSheet from '@/components/ui/BottomSheet';
import Image from 'next/image';
import Button from '@/components/ui/Btn';

interface ApplicantCountHeaderProps {
  type: '합격자' | '불합격자';
  count?: number;
}

export default function ApplicantCountHeader({ type, count = 0 }: ApplicantCountHeaderProps) {
  const [isApplicantListOpen, setIsApplicantListOpen] = useState(false);

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
          {type === '합격자' ? (
            <>
              <p>김민준 (건국대 / 컴퓨터공학과 / 오리사)</p>
              <p>이서연 (ᄋᄋ대 / 시각디자인과 / 일반부원)</p>
              <p>최수빈 (ᄋᄋ대 / 경영학과 / 일반부원)</p>
              <p>황세연 (ᄋᄋ대 / 호텔관광학과 / 조리사)</p>
              <p>최민혁 (ᄋᄋ대 / 체육학과 / 일반부원)</p>
              <p>조은채 (ᄋᄋ대 / 문헌정보학과 / 일반부원)</p>
              <p>백서준 (ᄋᄋ대 / 화학공학과 / 일반부원)</p>
              <p>오지우 (ᄋᄋ대 / 관광경영학과 / 조리사)</p>
              <p>이도현 (ᄋᄋ대 / 심리학과 / 일반부원)</p>
            </>
          ) : (
            <>
              <p>박지민 (서울대 / 경제학과 / 일반부원)</p>
              <p>정유진 (연세대 / 국어국문학과 / 일반부원)</p>
              <p>강현우 (고려대 / 전기전자공학과 / 일반부원)</p>
              <p>송민서 (성균관대 / 글로벌경영학과 / 일반부원)</p>
              <p>임태현 (한양대 / 건축학과 / 일반부원)</p>
            </>
          )}
        </div>
      </BottomSheet>
    </>
  );
}
