"use client";

import Image from "next/image";
import Link from "next/link";

export default function TopAppBar() {
  return (
    <header className="relative flex items-center h-12 px-4 bg-white">
      <Link href="/home" className="w-6 h-6">
        <Image src="/icons/logo.svg" alt="로고" width={22} height={22} />
      </Link>
      <span className="absolute left-1/2 -translate-x-1/2 text-title">홈</span>
      <div className="flex items-center gap-3 ml-auto">
        <Link href="/home/mypage" className="w-6 h-6">
          <Image src="/icons/user.svg" alt="프로필" width={26} height={26} />
        </Link>
        <Link href="/home/notification" className="w-6 h-6">
          <Image src="/icons/notification.svg" alt="알림" width={24} height={24} />
        </Link>
      </div>
    </header>
  );
}