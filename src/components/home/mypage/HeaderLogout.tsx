'use client';

import { useState } from 'react';

export default function HeaderLogout() {
  const [isOpen, setIsOpen] = useState(false);  

  const handleConfirm = () => {
    console.log("로그아웃 처리됨");
    window.location.href = "/login";
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors pr-4 pb-2"
      >
        로그아웃
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="flex flex-col w-[330px] bg-white rounded-xl shado w-lg overflow-hidden">
            <div className="mt-12 w-full pl-6">
              <p className="text-base font-medium text-gray-90 0 leading-snug">
                로그아웃 하시겠습니까?
              </p>
            </div>

            <div className="mt-auto flex justify-end w-full pb-3 pr-3 pt-8">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-16 h-12 flex items-center justify-center text-base font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                취소
              </button>

              <button 
                onClick={handleConfirm}
                className="w-16 h-12 flex items-center justify-center text-base font-medium text-gray-900 hover:text-black transition-colors"
              >
                확인
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}