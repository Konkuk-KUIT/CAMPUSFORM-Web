'use client';

import { useState } from 'react';
import Image from 'next/image';
import BottomSheet from '@/components/ui/BottomSheet';
import ApplicantSummaryCard from '@/components/ui/ApplicantSummaryCard';
import Button from '@/components/ui/Btn';

interface ApplicantMessageCardProps {
  type: '합격자' | '불합격자';
}

export default function ApplicantMessageCard({ type }: ApplicantMessageCardProps) {
  const [isPersonalMessageOpen, setIsPersonalMessageOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState({
    name: '김민준',
    university: '건국대',
    major: '컴퓨터공학과',
    role: '요리사',
  });

  const handleApplicantClick = (name: string, university: string, major: string, role: string) => {
    setSelectedApplicant({ name, university, major, role });
    setIsPersonalMessageOpen(true);
  };

  const title = type === '합격자' ? '합격자 개인별 메세지' : '불합격자 개인별 메세지';
  const resultText =
    type === '합격자'
      ? '요리퐁 6기 최종 합격을 축하드립니다!'
      : '아쉽지만 이번 요리퐁 6기에서는 함께하지 못하게 되었습니다.';
  const additionalText =
    type === '합격자'
      ? '합격자 오리엔테이션 일정과 안내 자료는 별도로 전달드릴 예정이니 확인 부탁드립니다.'
      : '지원해 주셔서 감사드리며, 다음 기회에 다시 뵙기를 바랍니다.';

  return (
    <>
      <div className="mt-3">
        <h3 className="text-subtitle-sm-md pb-0.5">{title}</h3>

        {/* 명단/전화번호 복사 버튼 */}
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
          {type === '합격자' ? (
            <>
              <ApplicantSummaryCard
                name="김민준"
                university="건국대"
                major="컴퓨터공학과"
                role="요리사"
                onClick={() => handleApplicantClick('김민준', '건국대', '컴퓨터공학과', '요리사')}
              />
              <ApplicantSummaryCard
                name="백서준"
                university="ㅇㅇ대"
                major="화학공학과"
                role="일반부원"
                onClick={() => handleApplicantClick('백서준', 'ㅇㅇ대', '화학공학과', '일반부원')}
              />
              <ApplicantSummaryCard
                name="오지우"
                university="ㅇㅇ대"
                major="관광경영학과"
                role="조리사"
                onClick={() => handleApplicantClick('오지우', 'ㅇㅇ대', '관광경영학과', '조리사')}
              />
            </>
          ) : (
            <>
              <ApplicantSummaryCard
                name="박지민"
                university="서울대"
                major="경제학과"
                role="일반부원"
                onClick={() => handleApplicantClick('박지민', '서울대', '경제학과', '일반부원')}
              />
              <ApplicantSummaryCard
                name="정유진"
                university="연세대"
                major="국어국문학과"
                role="일반부원"
                onClick={() => handleApplicantClick('정유진', '연세대', '국어국문학과', '일반부원')}
              />
              <ApplicantSummaryCard
                name="강현우"
                university="고려대"
                major="전기전자공학과"
                role="일반부원"
                onClick={() => handleApplicantClick('강현우', '고려대', '전기전자공학과', '일반부원')}
              />
            </>
          )}
        </div>
      </div>

      {/* 바텀시트 - 합격자/불합격자 개인별 페이지 */}
      <BottomSheet isOpen={isPersonalMessageOpen} onClose={() => setIsPersonalMessageOpen(false)}>
        <h2 className="text-subtitle-sm-md text-black pt-3 pb-1">{selectedApplicant.name}</h2>
        <h3 className="text-body-rg text-gray-400">
          {selectedApplicant.university}/{selectedApplicant.major}/{selectedApplicant.role}
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
          <h2>[요리퐁 6기 최종 결과 안내]</h2>

          <div>
            <p>
              <span className="text-primary">{selectedApplicant.name}</span> 님, {resultText}
            </p>
          </div>

          <p>{additionalText}</p>
        </div>
      </BottomSheet>
    </>
  );
}
