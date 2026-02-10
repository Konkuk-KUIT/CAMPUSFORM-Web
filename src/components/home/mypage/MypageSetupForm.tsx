'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Btn';
import Textbox from '@/components/ui/Textbox';
import ProfileImageButton from '@/components/auth/ProfileImageButton';
import Header from '@/components/ui/Header';
import ConfirmModal from '@/components/home/mypage/ConfirmModal';
import { authService } from '@/services/authService';
import type { User } from '@/types/auth';
import Loading from '@/components/ui/Loading';

export default function MypageSetupForm() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 1. 현재 사용자 확인 (인증 여부 + 이메일 얻기)
        const authResponse = await authService.getCurrentUser();

        if (!authResponse.isAuthenticated || !authResponse.user) {
          router.push('/auth/login');
          return;
        }

        // 2. /users/exists 전체 정보 가져오기
        const userDetail = await authService.getUserDetailByEmail(authResponse.user.email);

        // 3. User 타입에 맞게 변환
        const fullUser: User = {
          userId: userDetail.userId,
          nickname: userDetail.nickname,
          email: userDetail.email,
          profileImageUrl: userDetail.profileImageUrl,
          image: userDetail.profileImageUrl,
        };

        setUser(fullUser);
        setNickname(userDetail.nickname);
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

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setShouldDeleteImage(false);
  };

  const handleImageDelete = () => {
    setImageFile(null);
    setShouldDeleteImage(true);
  };

  const handleSave = async () => {
    if (!validateNickname()) {
      return;
    }

    setNicknameError(false);

    try {
      let updatedProfileImageUrl = user?.profileImageUrl;

      // 1. 이미지 삭제 요청이 있으면 삭제
      if (shouldDeleteImage && user?.profileImageUrl) {
        await authService.deleteProfileImage();
        updatedProfileImageUrl = null;
      }

      // 2. 새 이미지가 있으면 업로드
      if (imageFile) {
        const response = await authService.updateProfileImage(imageFile);
        updatedProfileImageUrl = response.profileImageUrl;
      }

      // 3. 닉네임 변경
      if (nickname && nickname !== user?.nickname) {
        await authService.updateNickname(nickname);
      }

      alert('변경사항이 저장되었습니다.');

      // 4. 최신 사용자 정보 다시 불러오기
      if (user?.email) {
        const updatedUserDetail = await authService.getUserDetailByEmail(user.email);
        const updatedUser: User = {
          userId: updatedUserDetail.userId,
          nickname: updatedUserDetail.nickname,
          email: updatedUserDetail.email,
          profileImageUrl: updatedUserDetail.profileImageUrl,
          image: updatedUserDetail.profileImageUrl,
        };
        setUser(updatedUser);
        setNickname(updatedUserDetail.nickname);
      }

      // 상태 초기화
      setImageFile(null);
      setShouldDeleteImage(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    if (nicknameError) {
      setNicknameError(false);
    }
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await authService.logout();
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative bg-white min-h-screen">
      <Header title="마이페이지" backTo="/home" hideNotification={true} />

      <div className="absolute top-[14px] right-[16px] z-50">
        <button onClick={() => setShowLogoutModal(true)} className="text-body-md text-gray-500 cursor-pointer">
          로그아웃
        </button>
      </div>

      <div className="flex justify-center min-h-screen bg-white">
        <div className="relative w-[375px] bg-white min-h-screen flex flex-col">
          <div className="px-6 py-8 pb-28 flex flex-col gap-3">
            <ProfileImageButton
              key={user.profileImageUrl || 'default'}
              profileImageUrl={user.profileImageUrl || user.image}
              onImageChange={handleImageChange}
              onImageDelete={handleImageDelete}
            />

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
            <div className="flex justify-center items-center gap-[5px] mb-5 text-body-sm-rg text-gray-500">
              <span className="text-gray-500">캠퍼스폼</span>
              <span className="text-gray-700">|</span>
              <span className="text-gray-700">이용약관</span>
              <span className="text-gray-700">|</span>
              <span className="text-gray-700">개인정보 처리방침</span>
              <span className="text-gray-700">|</span>
              <span className="text-gray-700">문의하기</span>
            </div>

            <Button variant="primary" size="lg" onClick={handleSave}>
              저장하기
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal isOpen={showLogoutModal} onConfirm={handleLogout} onCancel={() => setShowLogoutModal(false)} />
    </div>
  );
}
