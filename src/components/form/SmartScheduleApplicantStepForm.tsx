'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import Header from '@/components/ui/Header';
import Navbar from '@/components/Navbar';
import Btn from '@/components/ui/Btn';
import ConfirmModal from '@/components/ConfirmModal';
import SmartScheduleButton from '@/components/ui/SmartScheduleButton';
import SmartScheduleStepIndicator from '@/components/ui/SmartScheduleStepIndicator';
import SmartScheduleSummaryCard from '@/components/ui/SmartScheduleSummaryCard';
import SmartScheduleTutorialOverlay from '@/components/ui/SmartScheduleTutorialOverlay';
import Toggle from '@/components/ui/Toggle';

import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { useTutorialMode, TUTORIAL_DATES } from '@/hooks/useTutorialMode';
import { projectService } from '@/services/projectService';
import { documentResultService } from '@/services/documentResultService';
import { authService } from '@/services/authService';
import { toast } from '@/components/Toast';

type SmartScheduleStep = 1 | 2 | 3 | 4;

interface InterviewSetting {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  slotDurationMin: number;
  breakDurationMin?: number;
  breakTimeMin?: number;
  maxApplicantsPerSlot?: number;
  maxApplicantsPerInterview?: number;
  maxApplicantsPerTime?: number;
  minInterviewersPerSlot?: number;
  maxInterviewersPerSlot?: number;
  interviewDates?: string[];
}

export default function SmartScheduleApplicantStepForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReadOnly = searchParams.get('readonly') === 'true';
  const maxStepParam = Number(searchParams.get('maxStep'));
  const readonlyMaxAccessibleStep =
    isReadOnly && [1, 2, 3, 4].includes(maxStepParam)
      ? (maxStepParam as SmartScheduleStep)
      : 3;
  const projectId = useCurrentProjectStore(s => s.projectId);
  const isTutorialMode = useTutorialMode();

  const [interviewSetting, setInterviewSetting] = useState<InterviewSetting | null>(null);
  const [investigationLink, setInvestigationLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResetConfirmDialog, setShowResetConfirmDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [applicantResponseEnabled, setApplicantResponseEnabled] = useState<boolean>(true);
  const [isTogglingResponse, setIsTogglingResponse] = useState(false);
  const [showStopResponseDialog, setShowStopResponseDialog] = useState(false);

  const handleStepClick = (step: SmartScheduleStep) => {
    if (!projectId) return;
    if (step > readonlyMaxAccessibleStep) return;

    const currentProgressStep = isReadOnly ? readonlyMaxAccessibleStep : 3;
    const shouldOpenReadOnly = step < currentProgressStep;
    const query = shouldOpenReadOnly ? `?readonly=true&maxStep=${currentProgressStep}` : '';

    const paths: Record<SmartScheduleStep, string> = {
      1: `/smart-schedule/${projectId}/setting${query}`,
      2: `/smart-schedule/${projectId}/interview-schedule${query}`,
      3: `/smart-schedule/${projectId}/applicant${query}`,
      4: `/smart-schedule/${projectId}/result`,
    };

    router.push(paths[step]);
  };

  const fetchInterviewSetting = async () => {
    if (!projectId) return;

    try {
      const setting = await projectService.getInterviewSetting(projectId);

      const isValid =
        setting &&
        setting.interviewDates &&
        Array.isArray(setting.interviewDates) &&
        setting.interviewDates.length > 0 &&
        setting.startTime &&
        setting.endTime;

      if (isValid) {
        setInterviewSetting(setting);
      } else {
        setInterviewSetting(null);
      }
    } catch {
      setInterviewSetting(null);
    }
  };

  const fetchInvestigationLink = async () => {
    if (!projectId) return;

    try {
      const linkData = await projectService.getInvestigationLink(projectId);

      let link = linkData?.link || linkData?.url;

      if (link) {
        if (link.startsWith('/submit')) {
          link = link.replace('/submit', `/smart-schedule/${projectId}/applicant-submit`);
        }

        if (link.startsWith('/')) {
          const origin = typeof window !== 'undefined' ? window.location.origin : '';
          link = `${origin}${link}`;
        }

        setInvestigationLink(link);
      }
    } catch {
      console.warn('[SmartScheduleApplicantStep] 지원자 조사 링크 조회 실패');
    }
  };

  const fetchApplicantLinkConfig = async () => {
    if (!projectId) return;
    try {
      const config = await projectService.getApplicantLinkConfig(projectId);
      if (typeof config?.enabled === 'boolean') {
        setApplicantResponseEnabled(config.enabled);
      }
    } catch {
      // 설정이 없으면 기본값 유지
    }
  };

  const handleToggleApplicantResponse = async (enabled: boolean) => {
    if (!projectId || isTogglingResponse) return;
    setIsTogglingResponse(true);
    try {
      await projectService.updateApplicantLinkConfig(projectId, { enabled });
      setApplicantResponseEnabled(enabled);
      toast.success(
        enabled
          ? '응답을 받기 시작했습니다.'
          : '응답이 중단되었습니다.',
      );
    } catch {
      toast.error('응답 상태 변경에 실패했습니다.');
    } finally {
      setIsTogglingResponse(false);
    }
  };

  useEffect(() => {
    if (isTutorialMode === null) return;

    if (isTutorialMode) {
      setInterviewSetting({
        startDate: TUTORIAL_DATES[0],
        endDate: TUTORIAL_DATES[2],
        startTime: '09:00',
        endTime: '18:00',
        slotDurationMin: 30,
        interviewDates: TUTORIAL_DATES,
      });
      setInvestigationLink('https://campusform.kr/submit/tutorial-preview');
      setApplicantResponseEnabled(true);
      return;
    }

    fetchInterviewSetting();
    fetchInvestigationLink();
    fetchApplicantLinkConfig();
  }, [projectId, isTutorialMode]);

  const handleCopyInvestigationLink = async () => {
    if (!investigationLink) {
      toast.error('복사할 링크가 없습니다.');
      return;
    }

    try {
      await navigator.clipboard.writeText(investigationLink);
      toast.success('링크가 복사되었습니다.');
    } catch {
      toast.error('링크 복사에 실패했습니다.');
    }
  };

  const handleCopyPhoneNumbers = async () => {
    if (!projectId) {
      toast.error('프로젝트를 선택해주세요.');
      return;
    }

    try {
      const response = await documentResultService.getDocumentResults(projectId, 'PASS');
      const applicants = response.applicants || [];

      const phoneNumbers = applicants.map(a => a.phoneNumber).filter(Boolean) as string[];

      if (phoneNumbers.length === 0) {
        toast.error('복사할 전화번호가 없습니다.');
        return;
      }

      const text = phoneNumbers.join(' ');

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      toast.success(`${phoneNumbers.length}명의 전화번호가 복사되었습니다.`);
    } catch {
      toast.error('전화번호 복사에 실패했습니다.');
    }
  };

  const handleConfirmResetFromStep2 = async () => {
    if (!projectId) {
      toast.error('프로젝트를 선택해주세요.');
      return;
    }

    try {
      setIsResetting(true);
      const auth = await authService.getCurrentUser();
      const userId = auth.user?.userId;

      if (!userId) {
        toast.error('사용자 정보를 확인하지 못했습니다. 다시 로그인해주세요.');
        return;
      }

      await projectService.resetInterviewSetting(projectId, 2, userId);

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(`smartScheduleResult:${projectId}`);
      }

      toast.success('이후 단계 데이터가 초기화되었습니다. 면접관 시간부터 다시 입력해주세요.');
      setShowResetConfirmDialog(false);
      router.replace(`/smart-schedule/${projectId}/interview-schedule`);
    } catch (error: any) {
      console.error('[SmartScheduleApplicantStep] 단계 초기화 실패:', error);
      toast.error(error?.response?.data?.message || '기존 데이터 초기화에 실패했습니다.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleConfirmGenerate = async () => {
    if (isReadOnly) {
      setShowConfirmDialog(false);
      setShowResetConfirmDialog(true);
      return;
    }

    if (!projectId) {
      toast.error('프로젝트를 선택해주세요.');
      return;
    }

    setShowConfirmDialog(false);
    setIsGenerating(true);

    try {
      const auth = await authService.getCurrentUser();
      const userId = auth.user?.userId;

      if (!userId) {
        toast.error('사용자 정보를 확인하지 못했습니다. 다시 로그인해주세요.');
        return;
      }

      const result = await projectService.generateSmartSchedule(projectId, userId);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`smartScheduleResult:${projectId}`, JSON.stringify(result));
      }

      toast.success('스마트 시간표가 생성되었습니다.');
      router.push(`/smart-schedule/${projectId}/result?mode=preview`);
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || '';

      if (
        status === 409 ||
        message.includes('이미') ||
        message.includes('existing') ||
        message.includes('duplicate')
      ) {
        toast.warning('이미 확정된 스마트 시간표가 있어 결과 화면으로 이동합니다.');
        router.replace(`/smart-schedule/${projectId}/result`);
        return;
      }

      let errorMessage = '스마트 시간표 생성에 실패했습니다.';

      if (message.includes('foreign key constraint')) {
        errorMessage = '기존 스케줄 데이터가 있어 생성할 수 없습니다.\n관리자에게 문의해주세요.';
      } else if (message) {
        errorMessage = message;
      }

      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen flex justify-center bg-white">
      <div className="relative w-93.75 bg-white min-h-screen flex flex-col overflow-x-hidden">
        <Header
          title="지원자 시간 모집"
          backTo={projectId ? `/smart-schedule/${projectId}/interview-schedule` : '/smart-schedule'}
        />

        <SmartScheduleStepIndicator
          currentStep={3}
          maxAccessibleStep={isReadOnly ? readonlyMaxAccessibleStep : 3}
          onStepClick={handleStepClick}
        />

        <SmartScheduleSummaryCard interviewSetting={interviewSetting} />

        <div className="flex-1 px-4 pt-4 pb-32 overflow-y-auto">
          <div className="mb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">
                지원자 면접 가능 시간 모집
              </h3>
              {isReadOnly && (
                <button
                  type="button"
                  onClick={() => setShowResetConfirmDialog(true)}
                  className="h-[25px] rounded-[4px] bg-primary px-3 text-[12px] font-semibold text-white"
                >
                  수정하기
                </button>
              )}
            </div>
            <p className="text-body-xs text-gray-300">
              응답 종료 전까지 지원자가 면접 가능 시간을 입력 후 제출합니다.
            </p>
          </div>

          {isReadOnly && (
            <div className="mb-3 rounded-[4px] bg-[#FFF4C7] py-2 text-center text-[12px] text-gray-600">
              읽기 전용 모드입니다.
            </div>
          )}

          <div className="bg-white p-2.5 space-y-2.5">
            <div className="relative">
              <input
                type="text"
                value={investigationLink || '링크를 불러오는 중입니다.'}
                readOnly
                className="w-full bg-gray-50 border border-gray-100 rounded-radius-5 px-3 py-3 pr-10 text-body-md text-gray-300 placeholder-gray-300"
              />

              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="복사"
                disabled={!investigationLink}
                onClick={handleCopyInvestigationLink}
              >
                <Image
                  src="/icons/copy-gray.svg"
                  alt="copy"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!projectId) return;
                router.push(`/smart-schedule/${projectId}/applicant-edit`);
              }}
              className="w-full bg-blue-50 border-[0.5px] border-blue-200 rounded-10 px-2.5 py-2.5 flex items-center justify-center gap-1 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <span className="text-body-sm text-gray-950">지원자 시간 페이지 편집</span>
              <Image
                src="/icons/edit-blue.svg"
                alt="edit"
                width={14}
                height={13}
                className="w-3.5 h-3.25"
              />
            </button>

            <div className="flex gap-1.25">
              <SmartScheduleButton
                icon="/icons/graph.svg"
                iconWidth={7}
                iconHeight={9.3}
                onClick={() =>
                  projectId && router.push(`/smart-schedule/${projectId}/response-result`)
                }
              >
                응답 결과 확인
              </SmartScheduleButton>

              <SmartScheduleButton showHash={true} onClick={handleCopyPhoneNumbers}>
                지원자 전화번호 복사
              </SmartScheduleButton>
            </div>

            {/* 지원자 응답 상태 토글 */}
            {!isReadOnly && (
              <div className="border border-gray-100 rounded-[10px] px-3 py-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-body-md text-gray-950">지원자 응답 상태</span>
                  <Toggle
                    checked={applicantResponseEnabled}
                    onChange={(enabled) => {
                      if (!enabled) {
                        setShowStopResponseDialog(true);
                      } else {
                        handleToggleApplicantResponse(true);
                      }
                    }}
                  />
                </div>
                <p className="text-body-xs text-gray-400 whitespace-pre-line">
                  {applicantResponseEnabled
                    ? '응답을 받고 있습니다.\n지원자가 면접 시간을 선택할 수 있습니다.'
                    : '응답이 중단되었습니다.\n지원자가 면접 시간을 제출할 수 없습니다.'}
                </p>
              </div>
            )}
          </div>

          {!isReadOnly && (
            <div className="fixed bottom-20 left-0 right-0 px-5 max-w-93.75 mx-auto">
              <Btn
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleConfirmGenerate}
                disabled={!interviewSetting || isGenerating || isResetting}
              >
                {isGenerating ? '생성 중...' : '스마트 시간표 생성'}
              </Btn>
            </div>
          )}

          <ConfirmModal
            isOpen={showConfirmDialog}
            onCancel={() => setShowConfirmDialog(false)}
            onConfirm={handleConfirmGenerate}
            description={
              <>
                재설정 시 <span className="font-semibold">기존 데이터가 초기화</span>되며,
                <br />
                지원자들에게 다시 응답을 받아야 합니다.
                <br />
                진행하시겠습니까?
              </>
            }
            confirmText="완료"
          />

          <ConfirmModal
            isOpen={showResetConfirmDialog}
            onCancel={() => setShowResetConfirmDialog(false)}
            onConfirm={handleConfirmResetFromStep2}
            description={
              <>
                수정 시 기존 데이터가 초기화되며,
                <br />
                지원자들에게 다시 응답을 받아야 합니다.
                <br />
                진행하시겠습니까?
              </>
            }
            confirmText={isResetting ? '초기화 중...' : '확인'}
          />

          <ConfirmModal
            isOpen={showStopResponseDialog}
            onCancel={() => setShowStopResponseDialog(false)}
            onConfirm={() => {
              setShowStopResponseDialog(false);
              handleToggleApplicantResponse(false);
            }}
            description={
              <>
                중단하면 지원자는 더 이상
                <br />
                면접 시간을 선택할 수 없습니다.
                <br />
                응답을 중단하시겠습니까?
              </>
            }
            confirmText="확인"
            cancelText="취소"
          />

          <div className="h-32" />
        </div>

        <Navbar />

        <SmartScheduleTutorialOverlay currentStep={3} projectId={projectId} />
      </div>
    </main>
  );
}