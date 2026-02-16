'use client';

import { useState, useEffect } from 'react';
import PullToRefresh from '@/components/PullToRefresh';
import ApplicantCardBasic from '@/components/interview/ApplicantCardBasic';
import AppointmentModal from '@/components/interview/AppointmentModal';
import CommentSection from '@/components/sections/CommentSection';
import QuestionSection from '@/components/document/QuestionSection';
import Loading from '@/components/ui/Loading';
import { toast } from '@/components/Toast';
import { applicantService } from '@/services/applicantService';
import { authService } from '@/services/authService';
import type { ApplicantDetail } from '@/types/applicant';

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
  const [applicant, setApplicant] = useState<ApplicantDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(decodeURIComponent(initialDate));
  const [appointmentTime, setAppointmentTime] = useState(decodeURIComponent(initialTime));
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  

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

  const fetchApplicant = async () => {
    try {
      setIsLoading(true);
      const data = await applicantService.getApplicant(projectId, applicantId, 'INTERVIEW');
      setApplicant(data);
      setIsFavorite(data.favorite);
      // API가 날짜/시간을 돌려주면 덮어쓰고, 없으면 URL params 값 유지
      if (data.interviewDate) setAppointmentDate(formatInterviewDate(data.interviewDate));
      if (data.interviewStartTime) setAppointmentTime(formatInterviewTime(data.interviewStartTime));
    } catch (e) {
      console.error('지원자 상세 조회 실패:', e);
      toast.error('지원자 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicant();
  }, [projectId, applicantId]);

  const handleRefresh = async () => {
    await fetchApplicant();
  };

  const handleConfirm = async (date: string, time: string, rawDate: string) => {
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
              onAppointmentClick={() => setIsModalOpen(true)}
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