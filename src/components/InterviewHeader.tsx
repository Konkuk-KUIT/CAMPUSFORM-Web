import Image from 'next/image';

export default function DocumentHeader() {
  return (
    <header className="flex items-center justify-between h-12 px-4">
      <div className="w-6 h-6">
        <Image src="/icons/logo.svg" alt="로고" width={22} height={22} />
      </div>
      <span className="text-title">면접 지원자 관리</span>
      <button className="w-6 h-6">
        <Image src="/icons/notification.svg" alt="알림" width={24} height={24} />
      </button>
    </header>
  );
}
