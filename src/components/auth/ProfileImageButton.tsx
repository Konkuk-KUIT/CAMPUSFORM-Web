'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import SelectModal from '../ui/SelectModal';

interface ProfileImageButtonProps {
  profileImageUrl?: string | null;
  onImageChange?: (file: File | null) => void;
  onImageDelete?: () => void;
}

export default function ProfileImageButton({ profileImageUrl, onImageChange, onImageDelete }: ProfileImageButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string>(''); // 미리보기 전용
  const inputRef = useRef<HTMLInputElement>(null);

  const profileOptions = [
    { id: 'edit', label: '이미지 수정' },
    { id: 'delete', label: '이미지 삭제' },
  ];

  const handleOptionSelect = (optionId: string) => {
    if (optionId === 'edit') {
      inputRef.current?.click();
    } else if (optionId === 'delete') {
      handleImageRemove();
    }
    setIsModalOpen(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 미리보기 표시
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (reader.readyState === 2 && e.target?.result) {
        setPreviewSrc(e.target.result as string);
      }
    };

    onImageChange?.(file);
  };

  const handleImageRemove = () => {
    setPreviewSrc('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onImageDelete?.();
  };

  // 표시할 이미지: 미리보기 > 기존 프로필 이미지 > 기본 아이콘
  const displayImage = previewSrc || profileImageUrl;

  return (
    <div className="relative">
      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="relative cursor-pointer block mx-auto"
        type="button"
      >
        {displayImage ? (
          <div className="w-22.5 h-22.5 relative">
            <Image src={displayImage} alt="프로필 이미지" fill className="rounded-full object-cover" />
          </div>
        ) : (
          <Image src="/icons/profile.svg" alt="프로필" width={90} height={90} loading="eager" />
        )}
        <div className="absolute -bottom-1 -right-1">
          <Image src="/icons/camera-button.svg" alt="사진 변경" width={28} height={28} />
        </div>
      </button>

      <input type="file" ref={inputRef} accept="image/*" className="hidden" onChange={handleImageSelect} />

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
