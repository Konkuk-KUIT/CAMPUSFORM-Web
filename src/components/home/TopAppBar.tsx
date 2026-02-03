"use client";

import Image from "next/image";
import Link from "next/link"; 
import { useState, useEffect } from "react";

export default function TopAppBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // TODO: 실제 로그인 상태 확인 로직으로 대체
    const checkLoginStatus = () => {
      // 예: localStorage, session, API 호출 등
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  return (
    <header className="flex items-center justify-between h-12 px-4 bg-white">
      <div className="w-6 h-6">
        <Image src="/icons/logo.svg" alt="로고" width={22} height={22} />
      </div>
      <span className="text-title">홈</span>
      <div className="flex items-center gap-3">
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