'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DotIndicator from './DotIndicator';
import Button from '@/components/ui/Btn';
import { authService } from '@/services/authService';

const SLIDES = [
  { title: '오늘의 캘린더', description: '프로젝트와 면접 일정을 한눈에 확인해요', image: '/onboarding/1.svg' },
  {
    title: '간편해진 지원자 관리',
    description: '구글폼 시트 연동부터 결과 분류, 운영진 코멘트까지 똑똑하게 평가하세요',
    image: '/onboarding/2.svg',
  },
  {
    title: '가장 쉬운 결과 확인',
    description: '통계부터 개인/단체 문자 전송\n세팅까지 한 번에 끝내요',
    image: '/onboarding/3.svg',
  },
  {
    title: '스마트 시간표',
    description: '알고리즘이 짜주는 면접 시간표로 면접 일정과 운영진 시간을 한번에 맞춰요',
    image: '/onboarding/4.svg',
  },
  {
    title: '걱정 없는 시간 조율',
    description: '버튼 하나로 지원자들에게 시간 협업 링크를 보내드려요',
    image: '/onboarding/5.svg',
  },
  { title: '자동 매칭 완료', description: '응답이 끝나면 면접 시간표가 자동으로 완성돼요', image: '/onboarding/6.svg' },
];

export default function OnboardingClient() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const handlePrev = () => {
    if (current > 0) setCurrent(c => c - 1);
  };

  const handleNext = async () => {
    if (current < SLIDES.length - 1) {
      setCurrent(c => c + 1);
    } else {
      await authService.completeOnboarding();
      router.push('/home');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 이미지 영역 */}
      <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden">
        <Image
          src={SLIDES[current].image}
          alt={SLIDES[current].title}
          width={237}
          height={516}
          className="mt-35"
          style={{
            filter: 'drop-shadow(3px 2px 7px rgba(0,0,0,0.10)) drop-shadow(10px 7px 12px rgba(0,0,0,0.09))',
          }}
          priority
        />
      </div>

      {/* 흰 카드 */}
      <div className="h-[331px] bg-white -mt-6 flex flex-col items-center px-6 pt-8 pb-5 relative">
        {/* 텍스트 + 화살표 */}
        <div className="flex items-center justify-center w-full">
          <button onClick={handlePrev}>
            <Image
              src={current === 0 ? '/icons/onboarding-disable-chevron-left.svg' : '/icons/onboarding-chevron-left.svg'}
              alt="이전"
              width={45}
              height={45}
            />
          </button>

          <div className="text-center flex-1">
            <h2 className="text-24 font-semibold text-primary mb-2">{SLIDES[current].title}</h2>
            <p className="text-body-rg text-gray-500 whitespace-pre-line">{SLIDES[current].description}</p>
          </div>

          <button onClick={handleNext}>
            <Image
              src={
                current === SLIDES.length - 1
                  ? '/icons/onboarding-disable-chevron-right.svg'
                  : '/icons/onboarding-chevron-right.svg'
              }
              alt="다음"
              width={45}
              height={45}
            />
          </button>
        </div>

        <div className="flex-1" />
        <DotIndicator total={SLIDES.length} current={current} />
        <div className="h-4" />
        <Button size="lg" onClick={handleNext}>
          시작하기
        </Button>
      </div>
    </div>
  );
}
