'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TextboxGoogle from '@/components/home/TextboxGoogle';
import ProfileCross from '@/components/ui/ProfileCross';
import DateRangePickerModal from '@/components/home/addproject/DateRangePickerModal';
import InfoModal from '@/components/ui/InfoModal';
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
  const { closedProjectIds, closeProject } = useManualCloseStore();
  const isManuallyClosed = closedProjectIds.includes(projectId);

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

  const handleDateConfirm = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
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
        {/* 헤더 */}
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
            <label className="text-[14px] font-bold text-gray-950">프로젝트 이름</label>
            <div className="flex gap-2 items-start">
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
                  className="!w-[50px] !h-[50px] !rounded-[10px] shrink-0 text-[13px] font-medium"
                  onClick={handleSaveProjectName}
                >
                  저장
                </Button>
              )}
            </div>
          </div>

          {/* 모집 상태 */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-950">모집 상태</label>
            {isManuallyClosed ? (
              <div className="w-full h-12.5 px-4 flex items-center rounded-10 border border-gray-100 bg-gray-100 text-body-rg text-gray-300">
                모집 마감
              </div>
            ) : (
              <SheetDropdown
                options={['모집 중', '모집 마감']}
                value={status}
                onChange={(val) => {
                  if (val === '모집 마감') {
                    closeProject(projectId);
                    toast.success('모집이 마감되었습니다.');
                  }
                }}
                placeholder="모집 상태를 선택하세요"
                showNoneOption={false}
              />
            )}
          </div>

          {/* 구글폼 URL */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-950">구글폼 스프레드 시트 URL</label>
            <p className="text-[11px] text-gray-500 leading-tight">
              스프레드시트의 항목을 서비스에서 사용할 수 있도록 변환합니다.
            </p>
            <TextboxGoogle
              placeholder="https://docs.google.com/spreadsheets..."
              value={project.sheetUrl ?? ''}
              disabled
            />
          </div>

          {/* 모집 기간 */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-950">모집 기간 설정</label>
            <button
              onClick={() => setIsDateModalOpen(true)}
              className="w-full h-[48px] flex items-center justify-between px-4 text-left"
              type="button"
            >
              <span className={`text-[14px] ${startDate ? 'text-gray-950' : 'text-gray-400'}`}>
                {startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : 'yyyy-mm-dd - yyyy-mm-dd'}
              </span>
              <Image src="/icons/calendar.svg" alt="calendar" width={18} height={18} />
            </button>
          </div>

          {/* 포지션 설정 */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <label className="text-[14px] font-bold text-gray-950">포지션 설정</label>
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
                    <div className="absolute left-[-20px] bottom-full mb-2 z-50">
                      <div className="bg-[#93affd] rounded-[5px] px-3 py-2 whitespace-nowrap">
                        <p className="text-[13px] font-normal leading-[18px] tracking-[0.13px] text-white">
                          중복되거나 다른 표기의 포지션이 있으십니까?
                          <br />
                          하나의 포지션 표기로 통합해 주세요.
                        </p>
                      </div>
                      <div className="absolute left-6 -bottom-2">
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                          <path d="M7 8L0.937823 0.5L13.0622 0.5L7 8Z" fill="#93affd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <Link
                href={`/home/addproject/connect/edit-position?from=manage&projectId=${projectId}`}
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
              <span className="text-[14px] font-bold text-gray-950">관리자 추가</span>
              <span className="text-[13px] text-gray-500">({adminList.length}명)</span>
            </div>
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <TextboxGoogle
                  placeholder="구글 계정을 입력해주세요"
                  value={adminInput}
                  onChange={handleAdminInputChange}
                  error={isAdminError}
                  errorMessage="유효하지 않은 이메일입니다."
                />
              </div>
              <Button
                variant="primary"
                className="!w-[50px] !h-[50px] !rounded-[10px] shrink-0 text-[13px] font-medium"
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

        {/* 모달들 */}
        {isDateModalOpen && (
          <DateRangePickerModal
            onClose={() => setIsDateModalOpen(false)}
            onConfirm={handleDateConfirm}
            initialStartDate={startDate}
            initialEndDate={endDate}
          />
        )}
        {showInfoModal && (
          <InfoModal
            description={'아직 캠퍼스폼 회원이 아니에요.\n미가입 계정은 초대할 수 없습니다.'}
            onConfirm={() => setShowInfoModal(false)}
          />
        )}
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
