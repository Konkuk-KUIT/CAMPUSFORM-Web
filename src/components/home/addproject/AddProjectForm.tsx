'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Textbox from '@/components/ui/Textbox';
import TextboxGoogle from '@/components/home/TextboxGoogle';
import Button from '@/components/ui/Btn';
import ProfileCross from '@/components/ui/ProfileCross';
import DateRangePickerModal from '@/components/home/addproject/DateRangePickerModal';
import InfoModal from '@/components/ui/InfoModal';
import { getGoogleAuthorizeUrl } from '@/services/googleSheetService';
import { toast, ToastContainer } from '@/components/Toast';

interface Admin {
  id: number;
  name: string;
  email: string;
  isLeader: boolean;
}

export default function AddProjectForm() {
  const router = useRouter();

  const [showWarningModal, setShowWarningModal] = useState(true);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [title, setTitle] = useState('');
  const [isTitleError, setIsTitleError] = useState(false);
  const [url, setUrl] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [adminInput, setAdminInput] = useState('');
  const [isAdminError, setIsAdminError] = useState(false);
  const [adminList, setAdminList] = useState<Admin[]>([
    { id: 1, name: '나(대표)', email: 'myemail@gmail.com', isLeader: true },
  ]);

  const handleConnectClick = async () => {
    if (!url.trim()) return;

    try {
      const authorizeUrl = await getGoogleAuthorizeUrl();
      sessionStorage.setItem('pendingSheetUrl', url);
      window.location.href = authorizeUrl;
    } catch (e) {
      console.error('OAuth URL 오류:', e);
      toast.error('Google 인증 URL을 불러오지 못했습니다.');
    }
  };

  const handleTitleChange = (newValue: string) => {
    setTitle(newValue);
    if (newValue === '') {
      setIsTitleError(false);
      return;
    }
    const regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z\s]*$/;
    setIsTitleError(!regex.test(newValue));
  };

  const handleUrlChange = (newValue: string) => {
    setUrl(newValue);
  };

  const handleAdminInputChange = (newValue: string) => {
    setAdminInput(newValue);
    if (newValue === '') setIsAdminError(false);
  };

  const handleAddAdmin = () => {
    if (!adminInput.trim()) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminInput)) {
      setIsAdminError(true);
      return;
    }
    setIsAdminError(false);

    if (adminInput === 'unregistered@test.com') {
      setShowInfoModal(true);
      return;
    }
    const newAdmin: Admin = {
      id: Date.now(),
      name: '새 관리자',
      email: adminInput,
      isLeader: false,
    };
    setAdminList([...adminList, newAdmin]);
    setAdminInput('');
  };

  const handleDeleteAdmin = (id: number) => {
    setAdminList(adminList.filter(admin => admin.id !== id));
  };

  const handleDateConfirm = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  };

  const isButtonDisabled = title.length === 0 || isTitleError;

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <ToastContainer />
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

      <div className="relative w-93.75 bg-white min-h-screen flex flex-col">
        <Header title="새 프로젝트 추가" backTo="/home" hideNotification={true} />

        <div className="flex-1 px-5 py-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide pb-10">
          <div className="flex flex-col gap-2">
            <label className="text-14 font-bold text-gray-950">모집 공고명</label>
            <Textbox
              placeholder="공고명을 입력해주세요"
              value={title}
              onChange={handleTitleChange}
              error={isTitleError}
              errorMessage="공고명에는 한글, 영문만 입력 가능합니다."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-14 font-bold text-gray-950">구글폼 스프레드 시트 URL</label>
            <p className="text-[11px] text-gray-500 leading-tight">
              스프레드시트의 항목을 서비스에서 사용할 수 있도록 변환합니다.
            </p>
            <div className="flex gap-2 items-start relative">
              <div className="flex-1">
                <TextboxGoogle
                  placeholder="https://docs.google.com/spreadsheets..."
                  value={url}
                  onChange={handleUrlChange}
                />
              </div>
              <Button
                variant="primary"
                className="!w-[50px] !h-[50px] !rounded-[10px] shrink-0 text-[13px] font-medium bg-white !text-primary border !border-primary hover:bg-blue-50"
                onClick={handleConnectClick}
                disabled={!url.trim()}
              >
                연동
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-14 font-bold text-gray-950">모집 기간 설정</label>
            <button
              onClick={() => setIsDateModalOpen(true)}
              className="w-full h-12 flex items-center justify-between px-4 text-left"
              type="button"
            >
              <span className={`text-14 ${startDate ? 'text-gray-950' : 'text-gray-400'}`}>
                {startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : 'yyyy-mm-dd - yyyy-mm-dd'}
              </span>
              <Image src="/icons/calendar.svg" alt="calendar" width={18} height={18} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-14 font-bold text-gray-950">관리자 추가하기</label>
            <div className="flex gap-2 items-start relative">
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
                  key={admin.id}
                  nickname={admin.name}
                  email={admin.email}
                  isLeader={admin.isLeader}
                  onDelete={() => handleDeleteAdmin(admin.id)}
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

        {showInfoModal && (
          <InfoModal
            description={'아직 캠퍼스폼 회원이 아니에요.\n미가입 계정은 초대할 수 없습니다.'}
            onConfirm={() => setShowInfoModal(false)}
          />
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-4 max-w-93.75 mx-auto">
          <Button variant="primary" size="lg" disabled={isButtonDisabled} className="w-full">
            생성하기
          </Button>
        </div>

        <div className="h-24" />

        {showWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="relative w-75 bg-white rounded-[20px] px-6 py-8 flex flex-col items-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowWarningModal(false)}
                className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
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
                <br />
                <span className="text-gray-500 text-12 mt-1 block">(예: 디자인팀 / Design팀)</span>
              </p>
              <p className="text-[13px] text-gray-950 text-center leading-snug">
                원활한 분류를 위해 구글 시트에서
                <br />
                <span className="text-primary font-bold">포지션 명칭을 하나로 통일</span> 후 연동해 주세요.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
