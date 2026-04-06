'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TextboxGoogle from '@/components/home/TextboxGoogle';
import ProfileCross from '@/components/ui/ProfileCross';
import DateRangePickerModal from '@/components/home/addproject/DateRangePickerModal';
import ConfirmModal from '@/components/ConfirmModal';
import SheetDropdown from '@/components/home/addproject/SheetDropdown';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Btn';
import NotificationBell from '@/components/ui/NotificationBell';
import { toast } from '@/components/Toast';
import { projectService } from '@/services/projectService';
import { authService } from '@/services/authService';
import type { ProjectAdmin } from '@/types/project';
import type { ManageViewProps } from './ManageApplicationForm';
import { useManualCloseStore } from '@/store/manualCloseStore';

export default function OwnerView({
  projectId,
  project,
  adminList: initialAdminList,
  ownerUserId,
  status: initialStatus,
  startDate: initialStartDate,
  endDate: initialEndDate,
}: ManageViewProps) {
  const [status, setStatus] = useState(initialStatus);
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [adminList, setAdminList] = useState<ProjectAdmin[]>(initialAdminList);
  const [projectName, setProjectName] = useState(project.title);
  const [isEditingName, setIsEditingName] = useState(false);
  const [adminInput, setAdminInput] = useState('');
  const [isAdminError, setIsAdminError] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showPositionTooltip, setShowPositionTooltip] = useState(false);
  const { closedProjectIds, openedProjectIds, closeProject, openProject } = useManualCloseStore();
  const isManuallyClosed = closedProjectIds.includes(projectId);
  const isManuallyOpened = openedProjectIds.includes(projectId);
  const currentStatus = isManuallyOpened ? '모집 중' : isManuallyClosed ? '모집 완료' : initialStatus;

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  };

  const handleAdminInputChange = (newValue: string) => {
    setAdminInput(newValue);
    if (newValue === '') setIsAdminError(false);
  };

  const handleAddAdmin = async () => {
    if (!adminInput.trim()) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminInput)) {
      setIsAdminError(true);
      return;
    }
    setIsAdminError(false);
    try {
      const user = await authService.getUserDetailByEmail(adminInput);
      if (!user.exists) {
        setShowInfoModal(true);
        return;
      }
      const result = await projectService.addProjectAdmin(projectId, { email: adminInput });
      setAdminList(prev => [
        ...prev,
        {
          userId: result.adminId,
          nickname: result.adminName,
          email: result.email,
          profileImageUrl: result.profileImageUrl,
        },
      ]);
      setAdminInput('');
    } catch (e) {
      console.error('관리자 추가 오류:', e);
    }
  };

  const handleDeleteAdmin = async (userId: number) => {
    try {
      await projectService.removeProjectAdmin(projectId, userId);
      setAdminList(prev => prev.filter(admin => admin.userId !== userId));
    } catch (e) {
      console.error('관리자 삭제 오류:', e);
    }
  };

  const handleDateConfirm = async (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    setIsDateModalOpen(false);

    if (!start || !end) return;

    try {
      await projectService.updateProjectPeriod(projectId, {
        startAt: formatDate(start),
        endAt: formatDate(end),
      });
      toast.success('모집 기간이 수정되었습니다.');
    } catch (e) {
      console.error('모집 기간 수정 실패:', e);
      toast.error('모집 기간 수정에 실패했습니다.');
    }
  };

  const handleSaveProjectName = async () => {
    if (!projectName.trim()) return;
    try {
      await projectService.updateProjectName(projectId, projectName);
      setIsEditingName(false);
      toast.success('프로젝트 이름이 수정되었습니다.');
    } catch (e) {
      console.error('프로젝트 이름 수정 실패:', e);
      toast.error('프로젝트 이름 수정에 실패했습니다.');
    }
  };

  const positionEditHref = `/home/addproject/connect/edit-position?from=manage&projectId=${projectId}&sheetUrl=${encodeURIComponent(project.sheetUrl ?? '')}`;

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <style jsx global>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker__header {
          background-color: var(--color-gray-100);
          border-bottom: none;
        }
        .react-datepicker__day--selected {
          background-color: var(--color-primary) !important;
        }
        .react-datepicker__day--keyboard-selected {
          background-color: var(--color-blue-500) !important;
        }
      `}</style>

      <div className="relative w-[375px] bg-white min-h-screen flex flex-col pb-10">
        <div className="flex items-center justify-between h-12 px-4 bg-white border-b border-gray-100">
          <Link href="/home" className="w-6 h-6 flex items-center justify-center">
            <Image src="/icons/logo.svg" alt="logo" width={21} height={22} />
          </Link>
          <span className="text-[15px] font-semibold text-gray-950">지원서 관리</span>
          <NotificationBell />
        </div>

        <div className="flex-1 px-5 py-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide pb-10">
          {/* 프로젝트 이름 */}
          <div className="flex flex-col gap-2">
            <label className="text-body text-gray-950 pl-[10px]">프로젝트 이름</label>
            <div className="flex gap-1 items-start">
              <div className="flex-1">
                <TextboxGoogle
                  placeholder="프로젝트 이름을 입력해주세요"
                  value={projectName}
                  onChange={val => {
                    setProjectName(val);
                    setIsEditingName(true);
                  }}
                />
              </div>
              {isEditingName && (
                <Button
                  variant="primary"
                  className="w-[54px]! h-[50px]! rounded-10! shrink-0 font-normal text-[14px] leading-[20px] tracking-[0px] text-center [font-variant-numeric:lining-nums_proportional-nums]"
                  onClick={handleSaveProjectName}
                >
                  저장
                </Button>
              )}
            </div>
          </div>

          {/* 모집 상태 */}
          <div className="flex flex-col gap-2">
            <label className="text-body text-gray-950 pl-[10px]">모집 상태</label>
            <SheetDropdown
              options={['모집 중', '모집 완료']}
              value={currentStatus}
              onChange={val => {
                if (val === '모집 완료') {
                  closeProject(projectId);
                  setStatus('모집 완료');
                } else {
                  openProject(projectId);
                  setStatus('모집 중');
                }
              }}
              placeholder="모집 상태를 선택하세요"
              showNoneOption={false}
            />
          </div>

          {/* 구글폼 URL */}
          <div className="flex flex-col gap-2">
            <label className="text-body text-gray-950 pl-[10px]">구글폼 스프레드 시트 URL</label>
            <p className="text-[11px] text-gray-500 leading-tight pl-[10px]">
              스프레드시트의 항목을 서비스에서 사용할 수 있도록 변환합니다.
            </p>
            <TextboxGoogle placeholder="스프레드 시트 URL을 입력해주세요" value={project.sheetUrl ?? ''} disabled />
          </div>

          {/* 모집 기간 설정 */}
          <div className="flex flex-col gap-2">
            <label className="text-body text-gray-950 pl-[10px]">모집 기간 설정</label>
            <div className="flex items-center gap-[10px]">
              <button
                onClick={() => setIsDateModalOpen(true)}
                className="w-40 h-10 flex items-center justify-between pt-[7px] pr-[7px] pb-[8px] pl-[15px] border border-[#EFEFEF] rounded-5 bg-white hover:border-primary transition-colors"
                type="button"
              >
                <span
                  className={
                    startDate
                      ? 'text-14 text-gray-950'
                      : 'font-["Pretendard"] font-normal text-[14px] leading-[20px] tracking-[0px] align-middle text-[#B0B0B0] [font-variant-numeric:lining-nums_proportional-nums]'
                  }
                >
                  {startDate ? formatDate(startDate) : 'yyyy-mm-dd'}
                </span>
                <Image
                  src="/icons/calendar2.svg"
                  alt="calendar"
                  width={23}
                  height={23}
                  className={startDate ? '' : '[filter:brightness(0)_saturate(0%)_invert(82%)]'}
                />
              </button>

              <span className="text-gray-400 text-14 shrink-0">—</span>

              <button
                onClick={() => setIsDateModalOpen(true)}
                className="w-40 h-10 flex items-center justify-between pt-[7px] pr-[7px] pb-[8px] pl-[15px] border border-[#EFEFEF] rounded-5 bg-white hover:border-primary transition-colors"
                type="button"
              >
                <span
                  className={
                    endDate
                      ? 'text-14 text-gray-950'
                      : 'font-["Pretendard"] font-normal text-[14px] leading-[20px] tracking-[0px] align-middle text-[#B0B0B0] [font-variant-numeric:lining-nums_proportional-nums]'
                  }
                >
                  {endDate ? formatDate(endDate) : 'yyyy-mm-dd'}
                </span>
                <Image
                  src="/icons/calendar2.svg"
                  alt="calendar"
                  width={23}
                  height={23}
                  className={endDate ? '' : '[filter:brightness(0)_saturate(0%)_invert(82%)]'}
                />
              </button>
            </div>
          </div>

          {/* 포지션 설정 */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <label className="text-body text-gray-950 pl-[10px]">포지션 설정</label>
                <div
                  className="relative"
                  onMouseEnter={() => setShowPositionTooltip(true)}
                  onMouseLeave={() => setShowPositionTooltip(false)}
                >
                  <Image
                    src="/icons/info-2.svg"
                    alt="info"
                    width={13.5}
                    height={13.5}
                    className="ml-0.5 cursor-pointer"
                  />
                  {showPositionTooltip && (
                    <div className="absolute left-[-20px] bottom-full mb-4 z-50">
                      <div className="bg-primary rounded-5 whitespace-nowrap px-3 py-[10px]">
                        <p className="text-body-md text-white">
                          중복되거나 다른 표기의 포지션이 있으십니까?
                          <br />
                          하나의 포지션 표기로 통합해 주세요.
                        </p>
                      </div>
                      <div className="absolute left-6 -bottom-2">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M5 8L0 0L10 0L5 8Z" fill="#5A81FA" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Link
                href={positionEditHref}
                className="flex items-center gap-1 text-[13px] font-normal leading-[18px] tracking-[0.13px] text-[var(--color-primary)] underline decoration-solid"
              >
                편집하기
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                  <path
                    d="M1 1l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* 관리자 추가 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-body text-gray-950 pl-[10px]">관리자 추가</label>
              <span className="text-[13px] text-gray-500">({adminList.length}명)</span>
            </div>
            <div className="flex gap-1 items-start">
              <div className="flex-1">
                <TextboxGoogle
                  placeholder="구글 계정을 입력해주세요"
                  value={adminInput}
                  onChange={handleAdminInputChange}
                  error={isAdminError}
                  errorMessage="유효하지 않은 이메일입니다."
                  className="[&_input]:px-2.5"
                />
              </div>
              <Button
                variant="primary"
                className="w-[54px]! h-[50px]! rounded-10! shrink-0 font-normal text-[14px] leading-[20px] tracking-[0px] text-center [font-variant-numeric:lining-nums_proportional-nums]"
                onClick={handleAddAdmin}
              >
                추가
              </Button>
            </div>
            <div className="flex flex-col mt-2">
              {adminList.map(admin => (
                <ProfileCross
                  key={admin.userId}
                  nickname={admin.nickname}
                  email={admin.email}
                  profileImageUrl={admin.profileImageUrl}
                  isLeader={admin.userId === ownerUserId}
                  onDelete={admin.userId === ownerUserId ? undefined : () => handleDeleteAdmin(admin.userId)}
                />
              ))}
            </div>
          </div>
        </div>

        {isDateModalOpen && (
          <DateRangePickerModal
            onClose={() => setIsDateModalOpen(false)}
            onConfirm={handleDateConfirm}
            initialStartDate={startDate}
            initialEndDate={endDate}
          />
        )}
        <ConfirmModal
          isOpen={showInfoModal}
          description={'아직 캠퍼스폼 회원이 아니에요.\n미가입 계정은 초대할 수 없습니다.'}
          onConfirm={() => setShowInfoModal(false)}
        />
        {showWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="relative w-[300px] bg-white rounded-[20px] px-6 py-8 flex flex-col items-center shadow-2xl">
              <button
                onClick={() => setShowWarningModal(false)}
                className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center"
              >
                <Image src="/icons/cross.svg" alt="close" width={14} height={14} />
              </button>
              <h3 className="text-[15px] font-bold text-primary mb-6 text-center">잠깐! 포지션별로 모집하시나요?</h3>
              <div className="mb-6">
                <Image src="/icons/warning.svg" alt="warning" width={80} height={80} />
              </div>
              <p className="text-[13px] text-gray-950 text-center leading-snug mb-4">
                같은 포지션이라도 명칭이 다르면
                <br />
                서로 다른 그룹으로 분류될 수 있어요.
              </p>
            </div>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
}
