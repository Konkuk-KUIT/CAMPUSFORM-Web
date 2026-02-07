'use client';

import { useState } from 'react';
import Header from '@/components/ui/Header';
import Toggle from '@/components/ui/Toggle';

export default function NotificationSettingsForm() {
  const [isAgreed, setIsAgreed] = useState(true);

  const toggleHandler = () => {
    setIsAgreed(!isAgreed);
    console.log(`알림 설정 변경: ${!isAgreed}`);
  };

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="relative w-[375px] bg-white min-h-screen flex flex-col">
        <Header title="알림 설정" backTo="/home/notification" />

        <div className="px-5 py-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1.5 max-w-[240px]">
              <h2 className="text-body-lg font-medium text-gray-950">알림 수신 설정</h2>
              <p className="text-body-sm text-gray-500 leading-snug">
                새로운 지원자, 지원서 댓글을 알림으로 보내드립니다.
              </p>
            </div>

            <Toggle checked={isAgreed} onChange={toggleHandler} />
          </div>
        </div>
      </div>
    </div>
  );
}
