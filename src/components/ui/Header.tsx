// components/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  backTo?: string;
  hideNotification?: boolean;
  rightElement?: React.ReactNode;
}

export default function Header({ title, backTo, hideNotification = false, rightElement }: HeaderProps) {
  const router = useRouter();
  return (
    <header className="flex items-center justify-between h-12 px-4 bg-white">
      {backTo ? (
        <button
          className="w-6 h-6 flex items-center justify-center"
          onClick={() => {
            if (title === '알림 설정') {
              router.push('/home/notification');
            } else if (title === '알림') {
              router.push('/home');
            } else {
              router.push(backTo);
            }
          }}
        >
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </button>
      ) : (
        <div className="w-6 h-6" />
      )}
      <span className="text-title">{title}</span>
      {rightElement ? (
        rightElement
      ) : hideNotification ? (
        <div className="w-6 h-6" />
      ) : (
        <button className="w-6 h-6">
          <Image src="/icons/notification.svg" alt="알림" width={24} height={24} />
        </button>
      )}
    </header>
  );
}
