'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Textbox from '@/components/ui/Textbox';
import TextboxGoogle from '@/components/home/TextboxGoogle';
import Button from '@/components/ui/Btn';
import ProfileCross from '@/components/ui/ProfileCross';
import DateRangePickerModal from '@/components/home/addproject/DateRangePickerModal';
import InfoModal from '@/components/ui/InfoModal';
import { authService } from '@/services/authService';
import { createProject, getSheetHeaders, getGoogleAuthUrl, type RequireMappings } from '@/services/projectService';

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
  const [mappings, setMappings] = useState<RequireMappings | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [needsOAuth, setNeedsOAuth] = useState(false);

  // sessionStorage에서 저장된 폼 데이터 로드
  useEffect(() => {
    // 매핑 데이터 복원
    const savedMappings = sessionStorage.getItem('projectMappings');
    if (savedMappings) {
      const parsedMappings = JSON.parse(savedMappings) as RequireMappings;
      setMappings(parsedMappings);
      setIsConnected(true);
      // 사용 후 삭제
      sessionStorage.removeItem('projectMappings');
    }

    // 폼 데이터 복원
    const savedFormData = sessionStorage.getItem('addProjectFormData');
    if (savedFormData) {
      try {
        const formData = JSON.parse(savedFormData);
        if (formData.title) setTitle(formData.title);
        if (formData.url) setUrl(formData.url);
        if (formData.startDate) setStartDate(new Date(formData.startDate));
        if (formData.endDate) setEndDate(new Date(formData.endDate));
        if (formData.adminInput) setAdminInput(formData.adminInput);
        if (formData.adminList) setAdminList(formData.adminList);
        if (formData.isConnected !== undefined) setIsConnected(formData.isConnected);
      } catch (err) {
        console.error('Failed to restore form data:', err);
      }
    }
  }, []);

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

  const handleConnect = async () => {
    console.log('=== handleConnect 호출됨 ===');
    console.log('url:', url);
    
    if (!url) {
      console.log('URL 없음');
      alert('구글 스프레드시트 URL을 먼저 입력해주세요.');
      return;
    }

    // URL 유효성 검사
    if (!url.includes('docs.google.com/spreadsheets')) {
      console.log('URL 형식 오류');
      alert('올바른 구글 스프레드시트 URL을 입력해주세요.');
      return;
    }

    console.log('유효성 검사 통과, API 호출 시작');
    setIsConnecting(true);
    setNeedsOAuth(false);

    try {
      // 헤더 조회 시도
      console.log('getSheetHeaders 호출 중...');
      const headers = await getSheetHeaders(url);
      console.log('getSheetHeaders 결과:', headers);
      
      if (headers && headers.length > 0) {
        // 성공: sessionStorage에 저장하고 ConnectForm으로 이동
        sessionStorage.setItem('sheetUrl', url);
        sessionStorage.setItem('sheetHeaders', JSON.stringify(headers));
        
        // 현재 폼 데이터 저장
        const formData = {
          title,
          url,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          adminInput,
          adminList,
          isConnected: true,
        };
        sessionStorage.setItem('addProjectFormData', JSON.stringify(formData));
        
        setIsConnected(true);
        router.push('/home/addproject/connect');
      } else {
        alert('스프레드시트가 비어있습니다. 데이터를 확인해주세요.');
      }
    } catch (error: any) {
      console.error('시트 연동 실패:', error);
      
      if (error.response?.status === 403) {
        // OAuth 인증 필요
        setNeedsOAuth(true);
        alert('구글 시트 접근 권한이 필요합니다.\n아래 "구글 인증" 버튼을 클릭하여 권한을 부여해주세요.');
      } else if (error.response?.status === 400) {
        alert('구글 시트 URL이 올바르지 않습니다.\n\n확인사항:\n1. 링크가 올바른지 확인\n2. 시트가 공유 설정되어 있는지 확인');
      } else if (error.response?.status === 404) {
        alert('해당 구글 시트를 찾을 수 없습니다.\n링크를 다시 확인해주세요.');
      } else {
        alert('시트 연동에 실패했습니다.\n\n해결 방법:\n1. 구글 시트를 "링크가 있는 모든 사용자" 권한으로 공유\n2. 또는 구글 인증을 통해 접근 권한 부여');
        setNeedsOAuth(true);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const authUrlResponse = await getGoogleAuthUrl();
      // 리다이렉트 URI는 현재 도메인 + callback 경로
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      sessionStorage.setItem('googleAuthRedirectUri', redirectUri);
      sessionStorage.setItem('pendingSheetUrl', url);
      
      // Swagger 응답이 additionalProperties 형태이므로 첫 번째 값 사용
      const authUrl = Object.values(authUrlResponse)[0] as string;
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        alert('구글 인증 URL 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('구글 인증 URL 가져오기 실패:', error);
      alert('구글 인증을 시작할 수 없습니다.');
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    console.log('=== handleSubmit 호출됨 ===');
    console.log('title:', title);
    console.log('url:', url);
    console.log('startDate:', startDate);
    console.log('endDate:', endDate);
    console.log('mappings:', mappings);
    console.log('isConnected:', isConnected);
    
    // 유효성 검사
    if (!title || isTitleError) {
      console.log('제목 오류');
      alert('프로젝트 제목을 올바르게 입력해주세요.');
      return;
    }

    if (!url) {
      console.log('URL 없음');
      alert('구글 스프레드시트 URL을 입력해주세요.');
      return;
    }

    if (!startDate || !endDate) {
      console.log('날짜 없음');
      alert('모집 기간을 설정해주세요.');
      return;
    }

    if (!mappings || !isConnected) {
      console.log('매핑 정보 없음');
      alert('스프레드시트 연동을 완료해주세요.');
      return;
    }

    console.log('유효성 검사 통과, API 호출 시작');
    setIsSubmitting(true);

    try {
      // 현재 사용자 정보 가져오기
      const authResponse = await authService.getCurrentUser();
      
      if (!authResponse.isAuthenticated || !authResponse.user) {
        alert('로그인이 필요합니다.');
        router.push('/auth/login');
        return;
      }

      const userId = authResponse.user.id;

      // 관리자 ID 배열 생성 (현재는 자신만 포함, 실제로는 추가된 관리자들의 ID를 포함해야 함)
      const adminIds = [userId];

      // API 호출
      const result = await createProject(userId, {
        title,
        sheetUrl: url,
        startAt: formatDate(startDate),
        endAt: formatDate(endDate),
        adminIds: adminIds,
        requiredMappings: mappings,
      });

      console.log('프로젝트 생성 성공:', result);
      
      // sessionStorage 정리
      sessionStorage.removeItem('sheetUrl');
      sessionStorage.removeItem('projectMappings');
      sessionStorage.removeItem('addProjectFormData');
      sessionStorage.removeItem('sheetHeaders');
      
      // 홈으로 바로 이동
      router.push('/home');
    } catch (error: any) {
      console.error('프로젝트 생성 실패:', error);
      
      // 더 구체적인 에러 메시지
      let errorMessage = '프로젝트 생성에 실패했습니다.';
      
      if (error.response?.status === 401) {
        errorMessage = '로그인이 만료되었습니다. 다시 로그인해주세요.';
        router.push('/auth/login');
      } else if (error.response?.status === 400) {
        errorMessage = '입력 정보를 확인해주세요. 구글 시트 URL이나 날짜 형식이 올바른지 확인해주세요.';
      } else if (error.response?.status === 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.message) {
        errorMessage = `오류: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = title.length === 0 || isTitleError || !mappings || isSubmitting;

  // 디버깅용 로그
  console.log('=== 버튼 상태 ===');
  console.log('title:', title);
  console.log('isTitleError:', isTitleError);
  console.log('mappings:', mappings);
  console.log('isSubmitting:', isSubmitting);
  console.log('isButtonDisabled:', isButtonDisabled);

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

      <div className="relative w-[375px] bg-white min-h-screen flex flex-col">
        <Header title="새 프로젝트 추가" backTo="/home" />

        <div className="flex-1 px-5 py-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide pb-10">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-950">모집 공고명</label>
            <Textbox
              placeholder="공고명을 입력해주세요"
              value={title}
              onChange={handleTitleChange}
              error={isTitleError}
              errorMessage="공고명에는 한글, 영문만 입력 가능합니다."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-950">구글폼 스프레드 시트 URL</label>
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
                  className={`!w-[50px] !h-[50px] !rounded-[10px] shrink-0 text-[13px] font-medium ${
                    isConnected
                      ? 'bg-green-500 !text-white border-green-500 hover:bg-green-600'
                      : 'bg-white !text-primary border !border-primary hover:bg-blue-50'
                  }`}
                  onClick={handleConnect}
                  disabled={isConnecting}
                >
                  {isConnecting ? '...' : isConnected ? '완료' : '연동'}
                </Button>
            </div>
            
            {needsOAuth && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-[12px] text-blue-800 mb-2">
                  🔐 구글 시트 접근 권한이 필요합니다.
                </p>
                <Button
                  variant="primary"
                  className="w-full !h-[40px] text-[13px]"
                  onClick={handleGoogleAuth}
                >
                  구글 계정으로 인증하기
                </Button>
              </div>
            )}
          </div>

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

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-950">관리자 추가하기</label>
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
          <Button 
            variant="primary" 
            size="lg" 
            disabled={isButtonDisabled} 
            className="w-full"
            onClick={handleSubmit}
          >
            {isSubmitting ? '생성 중...' : '생성하기'}
          </Button>
        </div>
        
        {/* Spacer for fixed button */}
        <div className="h-24" />

        {showWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="relative w-[300px] bg-white rounded-[20px] px-6 py-8 flex flex-col items-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
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
                <span className="text-gray-500 text-[12px] mt-1 block">(예: 디자인팀 / Design팀)</span>
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
