'use client';

import { useState } from 'react';
import HeaderNotification from './HeaderNotification';
import Link from 'next/link';
import Image from 'next/image';
import BtnRound from '@/components/ui/BtnRound';
import NotificationCard from '@/components/home/notification/NotificationCard';

const INITIAL_DATA = [
  {
    id: 1,
    type: 'comment',
    title: '요리퐁 6기 신입부원 모집',
    subContent: '- 이현지 님의 지원서',
    message: '한상회 님이 댓글을 작성했어요.',
    time: '1분 전',
    isRead: false,
  },
  {
    id: 2,
    type: 'applicant',
    title: '요리퐁 6기 신입부원 모집',
    message: '김혜연 님이 새롭게 지원했어요.',
    time: '1분 전',
    isRead: false,
  },
  {
    id: 3,
    type: 'comment',
    title: '요리퐁 6기 신입부원 모집',
    subContent: '- 박민수 님의 지원서',
    message: '한상회 님이 댓글을 작성했어요.',
    time: '10분 전',
    isRead: true,
  },
  {
    id: 4,
    type: 'applicant',
    title: '요리퐁 6기 신입부원 모집',
    message: '김혜연 님이 새롭게 지원했어요.',
    time: '30분 전',
    isRead: true,
  },
  {
    id: 5,
    type: 'comment',
    title: '요리퐁 6기 신입부원 모집',
    subContent: '- 노수현 님의 지원서',
    message: '지원서 내용이 수정되었습니다.',
    time: '1시간 전',
    isRead: false,
  },
];

export default function NotificationForm() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState(INITIAL_DATA);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredList = activeTab === 'all' ? notifications : notifications.filter(n => !n.isRead);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="flex justify-center min-h-screen bg-white">
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

        <div className="flex items-center justify-between px-5 py-3 bg-white sticky top-12 z-10">
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

        <div className="flex-1 flex flex-col overflow-y-auto">
          {filteredList.length > 0 ? (
            filteredList.map(noti => (
              <NotificationCard
                key={noti.id}
                type={noti.type as 'applicant' | 'comment'}
                title={noti.title}
                subContent={noti.subContent}
                content={noti.message}
                timeAgo={noti.time}
                isUnread={!noti.isRead}
              />
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm mt-10">
              새로운 알림이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
