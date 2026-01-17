'use client';

import MypageSetupForm from '@/components/mypage/MypageSetupForm';
import Header from '@/components/Header';
import HeaderLogout from '@/components/HeaderLogout';

export default function SetupPage() {
  return (

    <div className="relative bg-white min-h-screen">
      
      <Header title="마이페이지" backTo="/home" />

      <div className="absolute top-0 right-0 h-[56px] flex items-center pr-4 z-50">
        <HeaderLogout />
      </div>
      
      <MypageSetupForm />
    </div>
  );
}