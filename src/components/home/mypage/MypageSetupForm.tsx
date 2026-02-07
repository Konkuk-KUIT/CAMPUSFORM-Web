'use client';

import { useState } from 'react';
import Button from '@/components/ui/Btn';
import Textbox from '@/components/ui/Textbox';
import ProfileImageButton from '@/components/auth/ProfileImageButton';
import Header from '@/components/ui/Header';

interface MypageSetupFormProps {
  initialName?: string;
  initialEmail?: string;
}

export default function MypageSetupForm({
  initialName = '김유저',
  initialEmail = 'hxxxxx@gmail.com',
}: MypageSetupFormProps) {
  const [nickname, setNickname] = useState(initialName);
  const [nicknameError, setNicknameError] = useState(false);

  const validateNickname = (): boolean => {
    if (!nickname.trim()) {
      setNicknameError(true);
      return false;
    }

    if (nickname.length < 1 || nickname.length > 12) {
      setNicknameError(true);
      return false;
    }

    const nameRegex = /^[가-힣a-zA-Z]+$/;
    if (!nameRegex.test(nickname)) {
      setNicknameError(true);
      return false;
    }

    return true;
  };

  const handleSignup = () => {
    if (!validateNickname()) {
      return;
    }

    setNicknameError(false);
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    if (nicknameError) {
      setNicknameError(false);
    }
  };

  return (
    <div className="relative bg-white min-h-screen">
      <Header title="마이페이지" backTo="/home" hideNotification={true} />

      <div className="absolute top-[14px] right-[16px] z-50">
        <button className="text-body-md text-[var(--color-gray-500)]">
          로그아웃
        </button>
      </div>

      <div className="flex justify-center min-h-screen bg-white">
        <div className="relative w-[375px] bg-white min-h-screen flex flex-col">
          <div className="px-6 py-8 pb-28 flex flex-col gap-3">
            <ProfileImageButton />

        <div className="flex flex-col gap-2 mt-15">
          <label className="text-subtitle-sm-md pl-2">이름(닉네임)</label>
          <Textbox
            placeholder="이름 또는 닉네임을 입력해주세요. (1-12자)"
            value={nickname}
            onChange={handleNicknameChange}
            error={nicknameError}
            errorMessage="이름에는 한글, 영문만 입력 가능합니다."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-subtitle-sm-md pl-2">구글 계정</label>
          <Textbox placeholder="hxxxxx@gmail.com" disabled />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 max-w-93.75 mx-auto">
        <div className="flex justify-center items-center gap-[5px] mb-5 text-body-sm-rg text-[var(--color-gray-500)]">
          <span className="text-[var(--color-gray-500)]">캠퍼스폼</span>
          <span className="text-[var(--color-gray-700)]">|</span>
          <span className="text-[var(--color-gray-700)]">이용약관</span>
          <span className="text-[var(--color-gray-700)]">|</span>
          <span className="text-[var(--color-gray-700)]">개인정보 처리방침</span>
          <span className="text-[var(--color-gray-700)]">|</span>
          <span className="text-[var(--color-gray-700)]">문의하기</span>
        </div>
        
        <Button variant="primary" size="lg" onClick={handleSignup}>
          저장하기
        </Button>
      </div>
        </div>
      </div>
    </div>
  );
}
