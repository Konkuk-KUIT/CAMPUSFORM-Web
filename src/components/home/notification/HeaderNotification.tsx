'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderNotificationProps {
  title: string;
  backTo?: string;
  hideNotification?: boolean;
  rightElement?: React.ReactNode;
}

export default function HeaderNotification({
  title,
  backTo,
  hideNotification = false,
  rightElement,
}: HeaderNotificationProps) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between h-12 px-4 bg-white">
      <button
        onClick={() => (backTo ? router.push(backTo) : router.back())}
        className="w-6 h-6 flex items-center justify-center"
      >
        <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
      </button>

      <span className="text-title">{title}</span>

      {rightElement ? (
        <div className="w-6 h-6 flex items-center justify-center">{rightElement}</div>
      ) : hideNotification ? (
        <div className="w-6 h-6" />
      ) : (
        <Link href="/home/notification/setting" className="w-6 h-6 flex items-center justify-center">
          <Image src="/icons/setting.svg" alt="설정" width={24} height={24} />
        </Link>
      )}
    </header>
  );
}
