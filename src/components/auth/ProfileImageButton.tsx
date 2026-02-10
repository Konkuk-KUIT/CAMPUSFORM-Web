'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import SelectModal from '../ui/SelectModal';
import { authService } from '@/services/authService';

interface ProfileImageButtonProps {
  profileImageUrl?: string | null;
  onImageUpdate?: (imageUrl: string | null) => void;
}

export default function ProfileImageButton({ profileImageUrl, onImageUpdate }: ProfileImageButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(profileImageUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const profileOptions = [
    { id: 'edit', label: '이미지 수정' },
    { id: 'delete', label: '이미지 삭제' },
  ];

  // 모달에서 옵션 선택
  const handleOptionSelect = (optionId: string) => {
    if (optionId === 'edit') {
      inputRef.current?.click();
    } else if (optionId === 'delete') {
      imgRemove();
    }
    setIsModalOpen(false);
  };

  // 이미지 선택 시 서버 업로드
  const attachImgPath = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 미리보기 먼저 표시
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (reader.readyState === 2 && e.target?.result) {
        setImgSrc(e.target.result as string);
      }
    };

    // 서버에 업로드
    setIsUploading(true);
    try {
      const response = await authService.updateProfileImage(file);
      setImgSrc(response.profileImageUrl);
      onImageUpdate?.(response.profileImageUrl);
      alert('프로필 이미지가 변경되었습니다.');
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('이미지 업로드에 실패했습니다.');
      setImgSrc(profileImageUrl || '');
    } finally {
      setIsUploading(false);
    }
  };

  // 이미지 삭제
  const imgRemove = async () => {
    if (!imgSrc) return;

    setIsUploading(true);
    try {
      await authService.deleteProfileImage();
      setImgSrc('');
      onImageUpdate?.(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      alert('프로필 이미지가 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('이미지 삭제에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="relative cursor-pointer block mx-auto"
        disabled={isUploading}
      >
        {imgSrc ? (
          <div className="w-22.5 h-22.5 relative">
            <Image src={imgSrc} alt="프로필 이미지" fill className="rounded-full object-cover" />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <p className="text-white text-sm">업로드 중...</p>
              </div>
            )}
          </div>
        ) : (
          <Image src="/icons/profile.svg" alt="프로필" width={90} height={90} loading="eager" />
        )}
        <div className="absolute -bottom-1 -right-1">
          <Image src="/icons/camera-button.svg" alt="사진 변경" width={28} height={28} />
        </div>
      </button>

      <input type="file" ref={inputRef} accept="image/*" className="hidden" onChange={attachImgPath} />

      {isModalOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsModalOpen(false)} />
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50">
            <SelectModal
              options={profileOptions}
              onChange={handleOptionSelect}
              width="w-[113px]"
              backgroundColor="gray-100"
            />
          </div>
        </>
      )}
    </div>
  );
}
