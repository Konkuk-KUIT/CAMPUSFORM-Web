// 컴포넌트 테스트용 페이지
'use client';

import { useState } from 'react';
import Button from '@/components/btn';
import BtnRound from '@/components/btnRound';
import SegmentedControl from '@/components/segmentedControl';
import StatusDropdown from '@/components/statusDropdown';
import TimeSelectButton from '@/components/timeSelectButton';
import TopTab from '@/components/topTab';
import Image from 'next/image';
import ReplyButton from '@/components/replyButton';
import AppointmentInfoButton from '@/components/appointmentInfoButton';

export default function SeoinTest() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
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
      </div>
    </>
  );
}
