'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import ProfileCross from '@/components/ui/ProfileCross';
import Navbar from '@/components/Navbar';
import NotificationBell from '@/components/ui/NotificationBell';
import type { ManageViewProps } from './ManageApplicationForm';
import Link from 'next/link';

export default function AdminView({ project, adminList, ownerUserId, status, startDate, endDate }: ManageViewProps) {
  useEffect(() => {
    console.log('ownerUserId:', ownerUserId);
    console.log('adminList:', adminList);
  }, [ownerUserId, adminList]);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="relative w-[375px] bg-white min-h-screen flex flex-col">
        <div className="flex items-center justify-between h-12 px-4 bg-white border-b border-gray-100">
          <Link href="/home" className="w-6 h-6 flex items-center justify-center">
            <Image src="/icons/logo.svg" alt="logo" width={21} height={22} />
          </Link>
          <span className="text-[15px] font-semibold text-gray-950">지원서 관리</span>
          <NotificationBell />
        </div>

        <div className="flex-1 px-5 py-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide pb-16">
          {/* 프로젝트 이름 */}
          <div className="flex flex-col gap-2">
            <label className="text-body text-gray-950 pl-[10px]">프로젝트 이름</label>
            <div className="w-full h-12.5 px-4 flex items-center rounded-10 border border-gray-100 bg-gray-100 text-body-rg text-gray-300">
              <span>{project.title}</span>
            </div>
          </div>

          {/* 모집 상태 */}
          <div className="flex flex-col gap-2">
            <label className="text-body text-gray-950 pl-[10px]">모집 상태</label>
            <div className="w-full h-12.5 px-4 flex items-center rounded-10 border border-gray-100 bg-gray-100 text-body-rg text-gray-300">
              <span>{status}</span>
            </div>
          </div>

          {/* 구글폼 URL */}
          <div className="flex flex-col gap-2">
            <label className="text-body text-gray-950 pl-[10px]">구글폼 스프레드 시트 URL</label>
            <input
              value={project.sheetUrl ?? ''}
              disabled
              placeholder="스프레드 시트 URL을 입력해주세요"
              className="w-full h-12.5 px-4 rounded-10 border border-gray-100 bg-gray-100 text-body-rg text-gray-300 placeholder:text-gray-300 cursor-not-allowed"
            />
          </div>

          {/* 모집 기간 */}
          <div className="flex flex-col gap-2">
            <label className="text-body text-gray-950 pl-[10px]">모집 기간</label>
            <div className="flex items-center gap-[10px]">
              <div className="w-40 h-10 flex items-center justify-between pt-[7px] pr-[7px] pb-[8px] pl-[15px] border border-[#EFEFEF] rounded-5 bg-gray-100">
                <span className="font-normal text-[14px] leading-[20px] text-gray-300">
                  {startDate ? formatDate(startDate) : 'yyyy-mm-dd'}
                </span>
                <Image
                  src="/icons/calendar2.svg"
                  alt="calendar"
                  width={23}
                  height={23}
                  className="[filter:brightness(0)_saturate(0%)_invert(82%)]"
                />
              </div>
              <span className="text-gray-400 text-14 shrink-0">—</span>
              <div className="w-40 h-10 flex items-center justify-between pt-[7px] pr-[7px] pb-[8px] pl-[15px] border border-[#EFEFEF] rounded-5 bg-gray-100">
                <span className="font-normal text-[14px] leading-[20px] text-gray-300">
                  {endDate ? formatDate(endDate) : 'yyyy-mm-dd'}
                </span>
                <Image
                  src="/icons/calendar2.svg"
                  alt="calendar"
                  width={23}
                  height={23}
                  className="[filter:brightness(0)_saturate(0%)_invert(82%)]"
                />
              </div>
            </div>
          </div>

          {/* 관리자 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <label className="text-body text-gray-950 pl-[10px]">관리자</label>
              <span className="text-body-rg text-gray-500">({adminList.length}명)</span>
              <div className="relative group">
                <Image src="/icons/info-2.svg" alt="info" width={13.5} height={13.5} />
                <div className="absolute left-0 top-6 z-20 hidden group-hover:block">
                  <div className="bg-blue-300 text-white text-body-xs-rg px-1 py-1 rounded-5 whitespace-nowrap min-w-[220px] text-center">
                    다음 단계 이동은 대표자만 가능합니다.
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-2 gap-2">
              {adminList.map(admin => (
                <ProfileCross
                  key={admin.userId}
                  nickname={admin.nickname}
                  email={admin.email}
                  profileImageUrl={admin.profileImageUrl}
                  isLeader={admin.userId === ownerUserId}
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