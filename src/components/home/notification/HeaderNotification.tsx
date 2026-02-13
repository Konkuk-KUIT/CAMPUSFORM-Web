'use client';

import Link from 'next/link';
import Image from 'next/image';

interface HeaderNotificationProps {
  title: string;
  backTo?: string;
  hideNotification?: boolean;
  rightElement?: React.ReactNode;
}

export default function HeaderNotification({
  title,
  backTo = '/home',
  hideNotification = false,
  rightElement,
}: HeaderNotificationProps) {
  return (
    <header className="flex items-center justify-center h-12 relative bg-white">
      {backTo ? (
        <Link href={backTo} className="absolute left-4 p-2">
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </Link>
      ) : (
        <div className="absolute left-4 p-2 w-6 h-6" />
      )}

      <span className="text-title font-semibold">{title}</span>

      {rightElement ? (
        <div className="absolute right-4 p-2">{rightElement}</div>
      ) : hideNotification ? (
        <div className="absolute right-4 p-2 w-6 h-6" />
      ) : (
        <Link href="/home/notification/setting" className="absolute right-4 p-2">
          <Image src="/icons/setting.svg" alt="설정" width={24} height={24} />
        </Link>
      )}
    </header>
  );
}