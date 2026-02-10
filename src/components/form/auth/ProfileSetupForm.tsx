'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileImageButton from '@/components/auth/ProfileImageButton';
import Button from '@/components/ui/Btn';
import Textbox from '@/components/ui/Textbox';
import { authService } from '@/services/authService';
import type { User } from '@/types/auth';

export default function ProfileSetupForm() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authResponse = await authService.getCurrentUser();

        if (!authResponse.isAuthenticated || !authResponse.user) {
          router.push('/auth/login');
          return;
        }

        setUser(authResponse.user);
        setNickname(authResponse.user.nickname || '');
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

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

  const handleSignup = async () => {
    if (!validateNickname()) {
      return;
    }

    setNicknameError(false);

    try {
      await authService.updateNickname(nickname);
      router.push('/home');
    } catch (error) {
      console.error('Failed to update nickname:', error);
      alert('닉네임 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    if (nicknameError) {
      setNicknameError(false);
    }
  };

  const handleImageUpdate = (imageUrl: string | null) => {
    if (user) {
      setUser({ ...user, profileImageUrl: imageUrl });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="relative w-[375px] bg-white min-h-screen flex flex-col">
        <div className="px-6 py-8 pb-28 flex flex-col gap-3">
          <ProfileImageButton profileImageUrl={user.profileImageUrl || user.image} onImageUpdate={handleImageUpdate} />

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
            <Textbox value={user.email} disabled />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 max-w-93.75 mx-auto">
          <Button variant="primary" size="lg" onClick={handleSignup}>
            가입 완료
          </Button>
        </div>
      </div>
    </div>
  );
}
