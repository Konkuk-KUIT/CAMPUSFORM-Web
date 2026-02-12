// components/Toast.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  isLeaving?: boolean;
}

const showToast = (type: ToastType, message: string) => {
  const toast: ToastMessage = {
    id: Date.now().toString(),
    type,
    message,
    isLeaving: false,
  };
  const event = new CustomEvent('show-toast', { detail: toast });
  window.dispatchEvent(event);
};

export const toast = {
  success: (message: string) => showToast('success', message),
  error: (message: string) => showToast('error', message),
  warning: (message: string) => showToast('warning', message),
};

const ToastItem = ({ toast }: { toast: ToastMessage }) => {
  const iconPaths = {
    success: '/icons/toast-success.svg',
    error: '/icons/toast-error.svg',
    warning: '/icons/toast-warning.svg',
  };

  return (
    <div
      className={`flex items-center gap-3 bg-gray-700 px-3 py-2 rounded-full mb-3 
        transition-all duration-500 ease-out
        ${toast.isLeaving ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}
    >
      <Image src={iconPaths[toast.type]} alt="" width={22} height={22} className="flex-shrink-0" />
      <span className="text-white text-sm">{toast.message}</span>
    </div>
  );
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastMessage>;
      const newToast = customEvent.detail;
      setToasts(prev => [...prev, newToast]);

      // 1초 후 사라지기 시작
      setTimeout(() => {
        setToasts(prev => prev.map(t => (t.id === newToast.id ? { ...t, isLeaving: true } : t)));
      }, 1000);

      // 1.5초 후 완전히 제거
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 1500);
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
