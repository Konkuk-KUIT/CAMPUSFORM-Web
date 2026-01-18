// 컴포넌트 테스트용 페이지
'use client';

import { useState } from 'react';
import Button from '@/components/Btn';
import BtnRound from '@/components/BtnRound';
import SegmentedControl from '@/components/SegmentedControl';
import StatusDropdown from '@/components/StatusDropdown';
import TimeSelectButton from '@/components/TimeSelectButton';
import TopTab from '@/components/TopTab';
import Image from 'next/image';
import ReplyButton from '@/components/ReplyButton';
import AppointmentInfoButton from '@/components/AppointmentInfoButton';
import AllAccordion from '@/components/AllAccordion';
import ResultCard from '@/components/ResultCard';
import ApplicantTimeSlotCard from '@/components/ApplicantTimeSlotCard';
import ScheduleResultCard from '@/components/ScheduleResultCard';
import SearchBar from '@/components/form/SearchBar';

export default function SeoinTest() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  return (
    <>
      <div className="min-h-screen space-y-3 bg-amber-100">
        <Button variant="outline" size="md" className="inline-flex items-center justify-center gap-1">
          <span>전화번호 복사하기</span>
          <Image src="/icons/tag-blue.svg" alt="" width={15} height={15} />
        </Button>
        <Button variant="outline" size="md" className="inline-flex items-center justify-center gap-1">
          <span>명단 복사하기</span>
          <Image src="/icons/copy-blue.svg" alt="" width={15} height={15} />
        </Button>
        <Button variant="outline" size="lg">
          면접 없이 모집 종료하기
        </Button>
        <Button variant="primary" size="lg">
          가입 완료
        </Button>
        <Button variant="neutral" size="sm">
          이름 삽입하기
        </Button>
        <Button variant="primary" size="lg" interaction="static">
          면접 시간 확정
        </Button>
        <Button variant="primary" size="lg" disabled>
          면접 시간 확정
        </Button>
        <BtnRound size="md" variant="primary">
          전체
        </BtnRound>
        <BtnRound size="md" variant="outline">
          전체
        </BtnRound>
        <BtnRound size="sm" variant="outline">
          부서명
        </BtnRound>
        <BtnRound size="sm" variant="neutral">
          부서명
        </BtnRound>
        <SegmentedControl />
        <TopTab counts={{ 전체: 10, 보류: 3, 합격: 5, 불합격: 2 }} />
        <StatusDropdown />

        <div className="flex flex-col gap-2">
          {' '}
          {/* 시간 선택 버튼 */}
          <TimeSelectButton
            time="10:00"
            isSelected={selectedTime === '10:00'}
            onClick={() => setSelectedTime(selectedTime === '10:00' ? null : '10:00')}
          />
          {/* 답글 버튼 */}
          <ReplyButton onClick={() => console.log('답글 클릭')} />
          {/* 지원 날짜 버튼 */}
          {/* 정보 있을 때 */}
          <AppointmentInfoButton date="11월 15일 (수)" time="14:00" onClick={() => {}} />
          {/* 정보 없을 때 */}
          <AppointmentInfoButton date="--월 --일 (-)" time="--:--" onClick={() => {}} />
        </div>

        {/* 전체 아코디언 */}
        <div className="flex justify-center">
          <AllAccordion title="전체">
            <div>내용</div>
          </AllAccordion>
        </div>

        {/* 면접 결과 카드 */}
        <ResultCard type="서류결과" totalApplicants={48} passed={10} ratio="0:0" malePercent={80} femalePercent={20} />
        <ResultCard type="면접결과" totalApplicants={100} passed={30} ratio="0:0" malePercent={34} femalePercent={66} />

        {/* 시간표 지원자 목록카드 */}
        <ApplicantTimeSlotCard
          time="9:00"
          applicants={[
            { name: '김민준', major: '건국대/컴퓨터공학과', position: '요리사' },
            { name: '백서준', major: '건국대/화학공학과', position: '일반부원' },
            { name: '오지우', major: '건국대/관광경영학과', position: '조리사' },
          ]}
        />

        {/* 지원결과 카드 */}
        <div className="p-3">
          <ScheduleResultCard
            timeRange="9:00 - 9:15"
            applicants={[
              { name: '김민준', major: '건국대/스마트ict융합공학과', position: '요리사' },
              { name: '김민준', major: '건국대/컴퓨터공학과', position: '요리사' },
              { name: '김민준', major: '건국대/컴퓨터공학과', position: '요리사' },
            ]}
            interviewers={['운영진A', '운영진B', '운영진C']}
          />
        </div>

        {/* 서치바 */}
        <SearchBar
          placeholder="지원자의 이름을 검색하세요."
          onSearch={setSearchQuery}
          onFilterClick={() => console.log('필터')}
          showSort={true}
          sortValue={sortBy}
          onSortChange={setSortBy}
        />
      </div>
    </>
  );
}
