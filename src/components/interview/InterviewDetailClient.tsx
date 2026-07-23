'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PullToRefresh from '@/components/PullToRefresh';
import ApplicantCardBasic from '@/components/interview/ApplicantCardBasic';
import AppointmentModal from '@/components/interview/AppointmentModal';
import CommentSection from '@/components/sections/CommentSection';
import QuestionSection from '@/components/document/QuestionSection';
import Loading from '@/components/ui/Loading';
import { toast } from '@/components/Toast';
import { applicantService } from '@/services/applicantService';
import { authService } from '@/services/authService';
import { projectService } from '@/services/projectService';
import type { ApplicantDetail } from '@/types/applicant';
import type { ProjectState } from '@/types/project';

const genderMap: Record<string, '남' | '여'> = {
  MALE: '남',
  FEMALE: '여',
};

const statusMap: Record<string, '보류' | '합격' | '불합격'> = {
  HOLD: '보류',
  PASS: '합격',
  FAIL: '불합격',
};

const formatInterviewDate = (raw: string | null | undefined): string => {
  if (!raw) return '';
  const date = new Date(raw);
  if (isNaN(date.getTime())) return '';
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  return `${month}월 ${day}일 (${dayOfWeek})`;
};

const formatInterviewTime = (raw: string | null | undefined): string => {
  if (!raw) return '';
  return raw.length >= 5 ? raw.substring(0, 5) : raw;
};

interface InterviewDetailClientProps {
  projectId: number;
  applicantId: number;
  initialDate?: string;
  initialTime?: string;
}

export default function InterviewDetailClient({
  projectId,
  applicantId,
  initialDate = '',
  initialTime = '',
}: InterviewDetailClientProps) {
  const searchParams = useSearchParams();
  const [applicant, setApplicant] = useState<ApplicantDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(decodeURIComponent(initialDate));
  const [appointmentTime, setAppointmentTime] = useState(decodeURIComponent(initialTime));
  const [currentUserId, setCurrentUserId] = useState<number>(0);

  // 프로젝트 상태
  const [projectState, setProjectState] = useState<ProjectState | null>(null);
  const [isProjectStateFailed, setIsProjectStateFailed] = useState(false);

  // 면접 단계에 아직 진입하지 않았거나, 재활성화로 서류 단계로 되돌아간 상태
  const isBeforeInterview = projectState === 'DOCUMENT' || projectState === 'DOCUMENT_COMPLETE';
  // 위 경우 + 모든 절차가 종료된 경우는 쓰기 불가
  const isReadOnly = isBeforeInterview || projectState === 'INTERVIEW_COMPLETE';

  const scrollToCommentId = searchParams.get('commentId') ? Number(searchParams.get('commentId')) : undefined;

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phone;
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const auth = await authService.getCurrentUser();
      if (auth.isAuthenticated && auth.user) {
        setCurrentUserId(auth.user.userId);
      }
    };
    fetchCurrentUser();
  }, []);

  // 프로젝트 상태 조회
  useEffect(() => {
    const fetchProjectState = async () => {
      try {
        const projects = await projectService.getProjects();
        const project = projects.find(p => p.id === projectId);
        if (project) {
          setProjectState(project.state);
        } else {
          setIsProjectStateFailed(true);
          setIsLoading(false);
        }
      } catch (e) {
        console.error('프로젝트 상태 조회 실패:', e);
        setIsProjectStateFailed(true);
        setIsLoading(false);
      }
    };
    fetchProjectState();
  }, [projectId]);

  // 알림에서 openComment=true로 진입 시 바텀시트 자동 오픈
  // 서류 단계로 되돌아간 프로젝트에서는 열지 않는다
  useEffect(() => {
    if (isBeforeInterview) return;
    if (searchParams.get('openComment') === 'true') {
      setCommentOpen(true);
    }
  }, [searchParams, isBeforeInterview]);

  const fetchApplicant = async () => {
    try {
      setIsLoading(true);
      const data = await applicantService.getApplicant(projectId, applicantId, 'INTERVIEW');
      setApplicant(data);
      setIsFavorite(data.favorite);
      if (data.interviewDate) setAppointmentDate(formatInterviewDate(data.interviewDate));
      if (data.interviewStartTime) setAppointmentTime(formatInterviewTime(data.interviewStartTime));
    } catch (e) {
      console.error('지원자 상세 조회 실패:', e);
      toast.error('지원자 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 지원자 상세 조회 (프로젝트 상태 확정 이후에만 실행)
  useEffect(() => {
    if (projectState === null) return;

    // 서류 단계로 되돌아간 프로젝트는 면접 정보를 노출하지 않는다
    if (isBeforeInterview) {
      setApplicant(null);
      setIsLoading(false);
      return;
    }

    fetchApplicant();
  }, [projectId, applicantId, projectState, isBeforeInterview]);

  const handleRefresh = async () => {
    if (isBeforeInterview) return;
    await fetchApplicant();
  };

  const handleConfirm = async (date: string, time: string, rawDate: string) => {
    if (isReadOnly) {
      toast.error('종료된 단계라 면접 일정을 변경할 수 없습니다.');
      setIsModalOpen(false);
      return;
    }
    try {
      await applicantService.manualAssignInterview(projectId, applicantId, rawDate, time);
      setAppointmentDate(date);
      setAppointmentTime(time);
    } catch (e) {
      toast.error('면접 일정 저장에 실패했습니다.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (isReadOnly) return;
    try {
      await applicantService.toggleBookmark(projectId, applicantId, 'INTERVIEW');
      setIsFavorite(prev => !prev);
    } catch (e) {
      toast.error('즐겨찾기 변경에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <Loading fullScreen={false} />;
  }

  // 프로젝트 정보를 확인하지 못한 경우
  if (isProjectStateFailed) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] px-5">
        <p className="text-gray-400 text-center">프로젝트 정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  // 서류 단계로 재활성화된 프로젝트
  if (isBeforeInterview) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] px-5">
        <h2 className="text-subtitle-md text-black mb-2">아직 면접 단계가 아닙니다.</h2>
        <p className="text-body-rg text-gray-500 text-center">서류 심사를 마치고 면접 단계로 이동하면</p>
        <p className="text-body-rg text-gray-500 text-center">이곳에서 면접 정보를 확인할 수 있습니다.</p>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-gray-400">지원자를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="pb-20">
          <div className="p-4">
            <ApplicantCardBasic
              name={applicant.name}
              gender={genderMap[applicant.gender] ?? '남'}
              status={statusMap[applicant.status] ?? '보류'}
              university={`${applicant.school}/${applicant.major}/${applicant.position}`}
              phone={formatPhoneNumber(applicant.phoneNumber)}
              email={applicant.email}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              commentCount={applicant.commentCount}
              onCommentClick={() => setCommentOpen(true)}
              appointmentDate={appointmentDate}
              appointmentTime={appointmentTime}
              onAppointmentClick={() => {
                if (isReadOnly) return;
                setIsModalOpen(true);
              }}
            />
          </div>

          <div className="p-4 mx-4 bg-white rounded-10">
            {applicant.answers
              .filter(item => item.question !== '타임스탬프')
              .map((item, idx) => (
                <QuestionSection key={idx} title={item.question} content={item.answer} />
              ))}
          </div>
        </div>
      </PullToRefresh>

      <CommentSection
        isOpen={isCommentOpen}
        onClose={() => setCommentOpen(false)}
        projectId={projectId}
        applicantId={applicantId}
        stage="INTERVIEW"
        currentUserId={currentUserId}
        scrollToCommentId={scrollToCommentId}
        readOnly={isReadOnly}
      />

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        initialDate={appointmentDate}
        initialTime={appointmentTime}
      />
    </div>
  );
}