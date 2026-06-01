'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileImageButton from '@/components/auth/ProfileImageButton';
import TermsCheckbox from '@/components/auth/TermsCheckbox';
import Button from '@/components/ui/Btn';
import Textbox from '@/components/ui/Textbox';
import { authService } from '@/services/authService';
import type { User } from '@/types/auth';
import Loading from '@/components/ui/Loading';
import { toast, ToastContainer } from '@/components/Toast';

export default function ProfileSetupForm() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState(false);
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authResponse = await authService.getCurrentUser();

        if (!authResponse.isAuthenticated || !authResponse.user) {
          router.push('/auth/login');
          return;
        }

        const userDetail = await authService.getUserDetailByEmail(authResponse.user.email);

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
      setNicknameErrorMessage('이름(닉네임)을 입력해주세요.');
      return false;
    }

    if (nickname.length < 1 || nickname.length > 12) {
      setNicknameError(true);
      setNicknameErrorMessage('1-12자 이내로 입력해 주세요.');
      return false;
    }

    const nameRegex = /^[가-힣a-zA-Z]+$/;
    if (!nameRegex.test(nickname)) {
      setNicknameError(true);
      setNicknameErrorMessage('한글, 영문만 입력 가능합니다.');
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

  const handleSignup = async () => {
    if (!termsAgreed || !privacyAgreed) {
      toast.warning('필수 약관에 모두 동의해주세요.');
      return;
    }

    if (!validateNickname()) {
      return;
    }

    setNicknameError(false);

    // 이미지 삭제
    if (shouldDeleteImage && user?.profileImageUrl) {
      try {
        await authService.deleteProfileImage();
      } catch (error) {
        console.error('Failed to delete profile image:', error);
        toast.warning('프로필 이미지 삭제에 실패했습니다.');
      }
    }

    // 새 이미지 업로드
    if (imageFile) {
      try {
        await authService.updateProfileImage(imageFile);
      } catch (error) {
        console.error('Failed to upload profile image:', error);
        toast.error('이미지 용량이 초과되었습니다. (최대 10MB)');
      }
    }

    // 닉네임 변경 및 라우팅
    try {
      if (nickname && nickname !== user?.nickname) {
        await authService.updateNickname(nickname);
      }
      router.push('/onboarding');
    } catch (error) {
      console.error('Failed to update nickname:', error);
      toast.error('프로필 저장에 실패했습니다.');
    }
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    if (nicknameError) {
      setNicknameError(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <ToastContainer />
      <div className="flex justify-center min-h-screen bg-white">
        <div className="relative w-93.75 bg-white min-h-screen flex flex-col">
          <div className="px-6 py-8 pb-28 flex flex-col gap-3">
            <ProfileImageButton
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
                errorMessage={nicknameErrorMessage}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-subtitle-sm-md pl-2">구글 계정</label>
              <Textbox value={user.email} disabled />
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 max-w-93.75 mx-auto">
            <div className="flex flex-col gap-3 mb-4">
              <TermsCheckbox
                label=""
                linkText="이용약관"
                linkUrl="https://spiky-cheek-6cb.notion.site/2f498732e20180f38b55ec4cf97b123c?source=copy_link"
                isRequired={true}
                checked={termsAgreed}
                onChange={setTermsAgreed}
              />
              <TermsCheckbox
                label=""
                linkText="개인정보 처리방침"
                linkUrl="https://spiky-cheek-6cb.notion.site/2f498732e20180c88f2ec5d914a66119?source=copy_link"
                isRequired={true}
                checked={privacyAgreed}
                onChange={setPrivacyAgreed}
              />
            </div>

            <Button variant="primary" size="lg" onClick={handleSignup} disabled={!termsAgreed || !privacyAgreed}>
              가입 완료
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
