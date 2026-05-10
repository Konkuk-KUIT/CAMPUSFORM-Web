'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import Header from '@/components/ui/Header';
import Navbar from '@/components/Navbar';
import Btn from '@/components/ui/Btn';
import ConfirmModal from '@/components/ConfirmModal';
import SmartScheduleButton from '@/components/ui/SmartScheduleButton';
import SmartScheduleStepIndicator from '@/components/ui/SmartScheduleStepIndicator';
import SmartScheduleSummaryCard from '@/components/ui/SmartScheduleSummaryCard';

import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { projectService } from '@/services/projectService';
import { authService } from '@/services/authService';
import { documentResultService } from '@/services/documentResultService';
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
  const projectId = useCurrentProjectStore(s => s.projectId);

  const [interviewSetting, setInterviewSetting] = useState<InterviewSetting | null>(null);
  const [investigationLink, setInvestigationLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleStepClick = (step: SmartScheduleStep) => {
    if (!projectId) return;

    const paths: Record<SmartScheduleStep, string> = {
      1: `/smart-schedule/${projectId}/setting?readonly=true`,
      2: `/smart-schedule/${projectId}/interview-schedule?readonly=true`,
      3: `/smart-schedule/${projectId}/applicant`,
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

  useEffect(() => {
    fetchInterviewSetting();
    fetchInvestigationLink();
  }, [projectId]);

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

  const handleConfirmGenerate = async () => {
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
        toast.error('사용자 정보를 확인할 수 없습니다.');
        return;
      }

      await projectService.generateSmartSchedule(projectId, userId);

      toast.success('스마트 시간표가 생성되었습니다.');
      router.push(`/smart-schedule/${projectId}/result`);
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || '';

      if (
        status === 409 ||
        message.includes('이미') ||
        message.includes('existing') ||
        message.includes('duplicate')
      ) {
        toast.warning('이미 생성된 스마트 시간표가 있어 결과 화면으로 이동합니다.');
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
          backTo={
            projectId
              ? `/smart-schedule/${projectId}/interview-schedule?readonly=true`
              : '/smart-schedule'
          }
        />

        <SmartScheduleStepIndicator
          currentStep={3}
          maxAccessibleStep={3}
          onStepClick={handleStepClick}
        />

        <SmartScheduleSummaryCard interviewSetting={interviewSetting} />

        <div className="flex-1 px-4 pt-4 pb-32 overflow-y-auto">
          <div className="text-left mb-3">
            <h3 className="text-subtitle-sm-sb text-gray-950 mb-1">
              지원자 면접 가능 시간 모집
            </h3>
            <p className="text-body-xs text-gray-300">
              응답 종료 전까지 지원자가 면접 가능 시간을 입력 후 제출합니다.
            </p>
          </div>

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
                router.push(`/smart-schedule/${projectId}/applicant-submit`);
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
          </div>

          <div className="fixed bottom-20 left-0 right-0 px-5 max-w-93.75 mx-auto">
            <Btn
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setShowConfirmDialog(true)}
              disabled={!interviewSetting || isGenerating}
            >
              {isGenerating ? '생성 중...' : '스마트 시간표 생성'}
            </Btn>
          </div>

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

          <div className="h-32" />
        </div>

        <Navbar />
      </div>
    </main>
  );
}