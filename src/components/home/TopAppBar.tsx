"use client";

import Image from "next/image";
import Link from "next/link"; 

export default function TopAppBar() {
  return (
    <header className="fixed top-0 w-[375px] h-[48px] bg-white z-50">
      
      <div className="absolute left-4 top-[14px] w-[21px] h-[22px]">
        <Image src="/icons/logo.svg" alt="Logo" width={21} height={22} />
      </div>

      <h1 className="absolute left-[179px] top-[11px] text-title text-gray-950 whitespace-nowrap">
        홈
      </h1>

      <Link 
        href="/home/mypage" 
        className="absolute left-[297px] top-[11px] w-[26px] h-[26px]"
      >
        <Image src="/icons/user.svg" alt="User" width={26} height={26} />
      </Link>

      <Link 
        href="/home/notification" 
        className="absolute left-[338px] top-3 w-6 h-6 flex items-center justify-center"
      >
        <div className="relative w-[16.53px] h-[19.5px]">
          <Image 
            src="/icons/alarm.svg" 
            alt="Alarm" 
            fill
            className="object-contain"
          />
        </div>
      </Link>
      
    </header>
  );
}