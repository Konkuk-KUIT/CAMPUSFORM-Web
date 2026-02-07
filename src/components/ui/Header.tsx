// components/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  title: string;
  backTo?: string;
  hideNotification?: boolean;
}

export default function Header({ title, backTo, hideNotification = false }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-12 px-4 bg-white">
      {backTo ? (
        <Link href={backTo} className="w-6 h-6">
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </Link>
      ) : (
        <div className="w-6 h-6" />
      )}
      <span className="text-title">{title}</span>
      {hideNotification ? (
        <div className="w-6 h-6" />
      ) : (
        <button className="w-6 h-6">
          <Image src="/icons/notification.svg" alt="알림" width={24} height={24} />
        </button>
      )}
    </header>
  );
}
