'use client';

import { useState } from 'react';
import Button from '@/components/Btn';
import TextboxLarge from '@/components/TextboxLarge';
import Image from 'next/image';
import Modal from '@/components/Modal';

interface NotificationMessageFormProps {
  type?: '합격자' | '불합격자';
}

export default function NotificationMessageForm({ type = '합격자' }: NotificationMessageFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const title = type === '합격자' ? '합격자 문자 템플릿 입력' : '불합격자 문자 템플릿 입력';
  const modalTitle = type === '합격자' ? '합격자' : '불합격자';

  return (
    <div className="flex flex-col gap-2 mt-3">
      <div className="flex items-center gap-1">
        <span className="text-subtitle-sm-md">{title}</span>
        <Image
          src={'/icons/info.svg'}
          alt="정보"
          width={18}
          height={18}
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer"
        />
      </div>
      {/* 템플릿 모달창 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="font-normal text-[15px] leading-5.75 text-black">
          <p className="mb-4">이 템플릿은 두 가지 방식으로 사용할 수 있어요.</p>

          <div className="mb-4">
            <h3 className="text-primary font-medium text-[15px] leading-5.75 mb-2">동일 문자 일괄 전송</h3>
            <ol className="list-decimal list-inside font-normal text-[15px] leading-5.75 text-black">
              <li>상단 {modalTitle} 명단의 &apos;전화번호 복사하기&apos;</li>
              <li>텔플릿 하단 &apos;템플릿 복사하기&apos;</li>
              <li>문자 앱에서 전체에게 동일하게 전송</li>
            </ol>
          </div>

          <div>
            <h3 className="text-primary font-medium text-[15px] leading-5.75 mb-2">자동 치환 개별 전송</h3>
            <ol className="list-decimal list-inside font-normal text-[15px] leading-5.75 text-black">
              <li>
                템플릿에 <span className="font-semibold">@이름</span>, <span className="font-semibold">@포지션</span>{' '}
                변수 입력
              </li>
              <li>&apos;변수 적용하기&apos;로 개인별 문자를 생성</li>
              <li>&apos;변수 복사하기&apos;, &apos;문자 복사하기&apos;로 문자 앱에서 개별 전송</li>
            </ol>
          </div>
        </div>
      </Modal>

      {/* 합격자/불합격자 문자 템플릿 입력 */}
      <TextboxLarge placeholder="문자 내용을 입력하세요. @이름과 @포지션 변수를 사용하면 개인별 문자 생성이 가능합니다." />

      <div className="flex gap-3 justify-end">
        <Button variant="neutral" size="sm">
          변수 적용하기
        </Button>
        <Button variant="neutral" size="sm">
          템플릿 복사하기
        </Button>
      </div>
    </div>
  );
}