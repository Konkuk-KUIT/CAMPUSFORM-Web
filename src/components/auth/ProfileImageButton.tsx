'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import SelectModal from '../ui/SelectModal';

export default function ProfileImageButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
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

  // 이미지 선택 시 미리보기
  const attachImgPath = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 이미지 미리보기
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (reader.readyState === 2 && e.target?.result) {
        setImgSrc(e.target.result as string);
      }
    };

    // TODO: 나중에 서버 연동할때 파일 부모 컴포넌트로 전달
  };

  // 이미지 삭제
  const imgRemove = () => {
    setImgSrc('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsModalOpen(!isModalOpen)} className="relative cursor-pointer block mx-auto">
        {imgSrc ? (
          <div className="w-22.5 h-22.5 relative">
            <Image src={imgSrc} alt="프로필 이미지" fill className="rounded-full object-cover" />
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
