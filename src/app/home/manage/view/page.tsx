import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProfileCross from '@/components/ProfileCross';

interface Admin {
  id: number;
  name: string;
  email: string;
  isLeader?: boolean;
}

export default function ManageApplicationViewPage() {
  const status = '모집 중';
  const url = '';
  const startDate = '2025-11-12';
  const endDate = '2025-11-14';

  const adminList: Admin[] = [
    { id: 1, name: '닉네임', email: 'xxxxx@gmail.com', isLeader: true },
    { id: 2, name: '닉네임', email: 'xxxxx@gmail.com' },
  ];

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="relative w-[375px] bg-white min-h-screen shadow-lg flex flex-col">
        {/* Top bar: logo left, title center, bell right */}
        <div className="flex items-center justify-between h-12 px-4 bg-white border-b border-gray-100">
          <Image src="/icons/logo.svg" alt="logo" width={21} height={22} />
          <span className="text-[15px] font-semibold text-gray-950">지원서 관리</span>
          <Link href="/home/notification" className="w-6 h-6 flex items-center justify-center">
            <Image src="/icons/alarm.svg" alt="alarm" width={18} height={18} />
          </Link>
        </div>

        <div className="flex-1 px-5 py-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide pb-16">
          {/* 모집 상태 (read-only) */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-950">모집 상태</label>
            <div className="w-full h-[50px] px-4 flex items-center justify-between rounded-[10px] border border-gray-100 bg-gray-50 text-[14px] text-gray-800">
              <span>{status}</span>
              <Image src="/icons/dropdown-down.svg" alt="dropdown" width={24} height={24} />
            </div>
          </div>

          {/* 구글폼 URL (disabled) */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-950">구글폼 스프레드 시트 URL</label>
            <p className="text-[11px] text-gray-500 leading-tight">
              스프레드시트의 항목을 서비스에서 사용할 수 있도록 변환합니다.
            </p>
            <div className="flex gap-2 items-start relative">
              <div className="flex-1">
                <input
                  value={url}
                  disabled
                  placeholder="https://docs.google.com/spreadsheets..."
                  className="w-full h-[50px] px-4 rounded-[10px] border border-gray-100 bg-gray-100 text-[14px] text-gray-300 placeholder:text-gray-300 cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* 모집 기간 (read-only) */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-950">모집 기간 설정</label>
            <div className="w-full h-[48px] flex items-center justify-between px-4 text-left rounded-[10px] border border-gray-100 bg-gray-50 text-[14px] text-gray-800">
              <span>{startDate} - {endDate}</span>
              <Image src="/icons/calendar.svg" alt="calendar" width={18} height={18} />
            </div>
          </div>

          {/* 관리자 목록 (read-only) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-gray-950">관리자</span>
              <span className="text-[13px] text-gray-500">({adminList.length}명)</span>
              <div className="relative group">
                <Image src="/icons/info-2.svg" alt="info" width={16} height={16} />
                <div className="absolute left-0 top-6 z-20 hidden group-hover:block">
                  <div className="relative bg-blue-300 text-white text-[12px] px-3 py-2 rounded-[6px] shadow-sm whitespace-nowrap min-w-[220px] text-center">
                    다음 단계 이동은 대표자만 가능합니다.
                    <div className="absolute -top-1 left-4 w-2 h-2 rotate-45 bg-blue-300" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-2 gap-2">
              {adminList.map((admin) => (
                <ProfileCross
                  key={admin.id}
                  nickname={admin.name}
                  email={admin.email}
                  isLeader={admin.isLeader}
                />
              ))}
            </div>
          </div>
        </div>

        <Navbar />
      </div>
    </div>
  );
}
