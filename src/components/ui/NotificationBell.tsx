'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { notificationService } from '@/services/notificationService';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { unreadCount } = await notificationService.getUnreadCount();
        setUnreadCount(unreadCount);
      } catch (error) {
        console.error('안 읽은 알림 개수 조회 실패:', error);
      }
    };
    fetchUnreadCount();
  }, []);

  return (
    <Link href="/home/notification" className="w-6 h-6 relative">
      <Image
        src={unreadCount > 0 ? '/icons/notification-active.svg' : '/icons/notification.svg'}
        alt="알림"
        width={24}
        height={24}
      />
    </Link>
  );
}
