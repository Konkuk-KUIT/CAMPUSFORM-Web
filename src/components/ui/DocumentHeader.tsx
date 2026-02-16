'use client';

import Image from 'next/image';
import Link from 'next/link';
import NotificationBell from '@/components/ui/NotificationBell';

export default function DocumentHeader() {
  return (
    <header className="flex items-center justify-between h-12 px-4">
      <Link href="/home" className="w-6 h-6">
        <Image src="/icons/logo.svg" alt="로고" width={22} height={22} />
      </Link>
      <span className="text-title">서류 지원자 관리</span>
      <NotificationBell />
    </header>
  );
}
