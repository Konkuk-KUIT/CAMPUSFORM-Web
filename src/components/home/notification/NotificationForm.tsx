'use client';

import { useState, useEffect, useCallback } from 'react';
import HeaderNotification from './HeaderNotification';
import Link from 'next/link';
import Image from 'next/image';
import BtnRound from '@/components/ui/BtnRound';
import NotificationCard from '@/components/home/notification/NotificationCard';
import { toast, ToastContainer } from '@/components/Toast';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/types/notification';

function toTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

function buildMessage(noti: Notification): string {
  const { type, payload } = noti;
  switch (type) {
    case 'COMMENT_CREATED':
      return `${payload.commenter ?? '누군가'} 님이 댓글을 작성했어요.`;
    case 'NEW_APPLICANT':
      return `${payload.commenter ?? '새 지원자'} 님이 새롭게 지원했어요.`;
    case 'SHEET_SYNC_RESULT':
      return (payload.content as string) ?? '시트가 동기화되었어요.';
    case 'ADMIN_ADDED':
      return '새 관리자가 추가되었어요.';
    default:
      return (payload.content as string) ?? '';
  }
}

export default function NotificationForm() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const [notisData, countData] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount(),
      ]);
      setNotifications(notisData.notifications);
      setUnreadCount(countData.unreadCount);
    } catch (error) {
      console.error('알림 조회 실패:', error);
      toast.error('알림을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredList = activeTab === 'all' ? notifications : notifications.filter(n => !n.read);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('전체 읽음 처리 실패:', error);
      toast.error('읽음 처리에 실패했습니다.');
    }
  };

  const handleMarkRead = async (id: number) => {
    if (notifications.find(n => n.id === id)?.read) return;
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('읽음 처리 실패:', error);
      toast.error('읽음 처리에 실패했습니다.');
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <ToastContainer />
      <div className="relative w-[375px] bg-white min-h-screen flex flex-col">
        <HeaderNotification
          title="알림"
          backTo="/home"
          hideNotification={true}
          rightElement={
            <Link href="/home/notification/setting" className="w-6 h-6 flex items-center justify-center">
              <Image src="/icons/setting.svg" alt="설정" width={24} height={24} />
            </Link>
          }
        />

        <div className="flex items-center justify-between px-5 py-3 bg-white">
          <div className="flex gap-2">
            <BtnRound
              size="md"
              variant={activeTab === 'all' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('all')}
            >
              전체
            </BtnRound>
            <BtnRound
              size="md"
              variant={activeTab === 'unread' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('unread')}
            >
              안읽음 ({unreadCount})
            </BtnRound>
          </div>
          <button
            onClick={handleMarkAllRead}
            className="text-[12px] text-gray-500 underline underline-offset-2 hover:text-gray-950"
          >
            모두 읽음
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center text-gray-400 text-sm mt-10">로딩 중...</div>
          ) : filteredList.length > 0 ? (
            filteredList.map(noti => (
              <NotificationCard
                key={noti.id}
                type={noti.type}
                title={`프로젝트 ${noti.projectId}`}
                subContent={noti.type === 'COMMENT_CREATED' ? (noti.payload.content as string) : undefined}
                content={buildMessage(noti)}
                timeAgo={toTimeAgo(noti.createdAt)}
                isUnread={!noti.read}
                onClick={() => handleMarkRead(noti.id)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center text-gray-400 text-sm mt-10">새로운 알림이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}
