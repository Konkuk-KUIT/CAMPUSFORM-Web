'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HeaderNotification() {
  return (
    <header className="flex items-center justify-center h-12 relative bg-white">
      <Link href="/home" className="absolute left-4 p-2">
        <Image 
          src="/icons/back.svg" 
          alt="뒤로가기" 
          width={24} 
          height={24} 
        />
      </Link>

      <span className="text-title font-semibold">알림</span>

      <Link href="/home/notification/setting" className="absolute right-4 p-2">
        <Image 
          src="/icons/setting.svg" 
          alt="설정" 
          width={24} 
          height={24} 
        />
      </Link>
    </header>
  );
}