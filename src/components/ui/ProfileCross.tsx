'use client';

import { useState } from 'react';
import Image from 'next/image';
import DeleteManagerModal from './DeleteManagerModal';

interface ProfileCrossProps {
  nickname: string;
  email: string;
  profileImageUrl?: string;
  onDelete?: () => void;
  isLeader?: boolean;
}

export default function ProfileCross({
  nickname,
  email,
  profileImageUrl,
  onDelete,
  isLeader = false,
}: ProfileCrossProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <>
      <DeleteManagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        managerName={nickname}
      />

      <div className="w-full h-16.5 bg-white flex items-center justify-between py-1 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8.75 h-8.75 rounded-full shrink-0 overflow-hidden bg-[#D9D9D9]">
            {profileImageUrl && (
              <Image src={profileImageUrl} alt={nickname} width={35} height={35} className="object-cover" />
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h3 className="text-14 font-medium text-gray-950 leading-tight">{nickname}</h3>
              {isLeader && (
                <span className="flex items-center justify-center px-1.75 h-3.75 border border-primary rounded-full text-10 text-primary bg-white leading-none mt-0.5">
                  대표자
                </span>
              )}
            </div>
            <p className="text-12 text-gray-500 mt-0.5">{email}</p>
          </div>
        </div>

        {!isLeader && onDelete && (
          <button
            onClick={handleDeleteClick}
            className="w-6 h-6 flex items-center justify-center text-gray-950 cursor-pointer hover:bg-gray-50 rounded-full transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </>
  );
}
