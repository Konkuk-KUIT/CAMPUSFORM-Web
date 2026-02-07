'use client';

import { useState } from 'react';
import { authService } from '@/services/authService';

export default function HeaderLogout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      await authService.logout();

      // 랜딩 페이지로 리디렉션
      window.location.href = '/';
    } catch (error) {
      console.error('로그아웃 실패:', error);
      window.location.href = '/';
    } finally {
      setIsLoading(false);
    }
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
          <div className="flex flex-col w-[330px] bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="mt-12 w-full pl-6">
              <p className="text-base font-medium text-gray-900 leading-snug">로그아웃 하시겠습니까?</p>
            </div>

            <div className="mt-auto flex justify-end w-full pb-3 pr-3 pt-8">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="w-16 h-12 flex items-center justify-center text-base font-medium text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
              >
                취소
              </button>

              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-16 h-12 flex items-center justify-center text-base font-medium text-gray-900 hover:text-black transition-colors disabled:opacity-50"
              >
                {isLoading ? '처리중...' : '확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
