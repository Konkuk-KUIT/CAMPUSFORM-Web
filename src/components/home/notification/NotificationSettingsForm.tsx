'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Toggle from '@/components/ui/Toggle';
import { toast, ToastContainer } from '@/components/Toast';
import { notificationService } from '@/services/notificationService';

export default function NotificationSettingsForm() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const data = await notificationService.getNotificationSetting();
        setIsEnabled(data.enabled);
      } catch (error) {
        console.error('알림 설정 조회 실패:', error);
        toast.error('알림 설정을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSetting();
  }, []);

  const toggleHandler = async () => {
    const next = !isEnabled;
    setIsEnabled(next);
    try {
      await notificationService.updateNotificationSetting(next);
    } catch (error) {
      console.error('알림 설정 변경 실패:', error);
      toast.error('알림 설정 변경에 실패했습니다.');
      setIsEnabled(!next);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <ToastContainer />
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

            <Toggle checked={isEnabled} onChange={toggleHandler} />
          </div>
        </div>
      </div>
    </div>
  );
}
