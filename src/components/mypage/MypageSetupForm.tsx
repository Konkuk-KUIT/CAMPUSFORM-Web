'use client';

import { useState } from 'react';
import Button from '@/components/Btn';
import Textbox from '@/components/Textbox';
import ProfileImageButton from '@/components/auth/ProfileImageButton';

interface MypageSetupFormProps {
    initialName?: string;
    initialEmail?: string;
  }

  export default function MypageSetupForm({ 
    initialName = '김유저', // 임시 기본값
    initialEmail = 'hxxxxx@gmail.com' 
  }: MypageSetupFormProps) {
    
    const [nickname, setNickname] = useState(initialName);
    const [nicknameError, setNicknameError] = useState(false);

  // 닉네임 유효성 검사
  const validateNickname = (): boolean => {
    // 빈 값 체크
    if (!nickname.trim()) {
      setNicknameError(true);
      return false;
    }

    // 길이 체크 (1-12자)
    if (nickname.length < 1 || nickname.length > 12) {
      setNicknameError(true);
      return false;
    }

    // 한글, 영문만 허용 (숫자, 특수문자 불가)
    const nameRegex = /^[가-힣a-zA-Z]+$/;
    if (!nameRegex.test(nickname)) {
      setNicknameError(true);
      return false;
    }

    return true;
  };

  // 가입 완료 버튼 클릭
  const handleSignup = () => {
    if (!validateNickname()) {
      return;
    }

    // 검사 통과
    setNicknameError(false);

    // TODO: 서버로 데이터 전송
  };

  // 닉네임 입력 시 에러메세지 제거
  const handleNicknameChange = (value: string) => {
    setNickname(value);
    if (nicknameError) {
      setNicknameError(false);
    }
  };

  return (
    <>
      <div className="px-6 py-8 pb-28 flex flex-col gap-3">
        {/* 프로필 사진 */}
        <ProfileImageButton />

        {/* 이름 입력 */}
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
        <Button variant="primary" size="lg" onClick={handleSignup}>
          저장하기
        </Button>
      </div>
    </>
  );
}
