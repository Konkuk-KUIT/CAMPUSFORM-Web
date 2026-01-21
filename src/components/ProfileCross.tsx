"use client";

import { useState } from 'react';
import DeleteManagerModal from './DeleteManagerModal';

interface ProfileCrossProps {
  nickname: string;
  email: string;
  onDelete?: () => void;
  isLeader?: boolean;   
}

export default function ProfileCross({
  nickname,
  email,
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
    
    <div className="w-full h-[66px] bg-white flex items-center justify-between px-[20px] py-[8px] border-b border-gray-100">
      
      <div className="flex items-center gap-[10px]">
        <div className="w-[35px] h-[35px] bg-[#D9D9D9] rounded-full flex-shrink-0" />

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h3 className="text-[14px] font-medium text-gray-950 leading-tight">
              {nickname}
            </h3>
            {isLeader && (
              <span className="flex items-center justify-center px-[7px] h-[15px] border border-primary rounded-full text-[10px] text-primary bg-white leading-none mt-0.5">
                대표자
              </span>
            )}
          </div>
          <p className="text-[12px] text-gray-500 mt-[2px]">
            {email}
          </p>
        </div>
      </div>

      {!isLeader && onDelete && (
        <button 
          onClick={handleDeleteClick} 
          className="w-[24px] h-[24px] flex items-center justify-center text-gray-950 cursor-pointer hover:bg-gray-50 rounded-full transition-colors"
        >
          <svg 
            width="20" height="20" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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