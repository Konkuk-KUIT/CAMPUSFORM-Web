'use client';

import { useState } from 'react';
import ApplicantCardBasic from '@/components/interview/ApplicantCardBasic';
import AppointmentModal from '@/components/interview/AppointmentModal';
import CommentSection from '@/components/sections/CommentSection';
import { mockInterviewApplicants } from '@/data/interviews';

interface InterviewDetailClientProps {
  applicantId: string;
}

export default function InterviewDetailClient({ applicantId }: InterviewDetailClientProps) {
  const applicant = mockInterviewApplicants.find(a => a.id === applicantId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(applicant?.appointmentDate || '');
  const [appointmentTime, setAppointmentTime] = useState(applicant?.appointmentTime || '');

  // TODO: 실제 값으로 교체 필요
  const projectId = 1;
  const currentUserId = 1;

  const handleAppointmentClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = (date: string, time: string) => {
    setAppointmentDate(date);
    setAppointmentTime(time);
    setIsModalOpen(false);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(prev => !prev);
  };

  if (!applicant) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-gray-400">지원자를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        <ApplicantCardBasic
          name={applicant.name}
          gender={applicant.gender}
          status={applicant.interviewStatus}
          university={`${applicant.university}/${applicant.major}/${applicant.position}`}
          phone={applicant.phone}
          email={applicant.email}
          commentCount={applicant.commentCount}
          isFavorite={isFavorite}
          onToggleFavorite={handleToggleFavorite}
          onCommentClick={() => setCommentOpen(true)}
          appointmentDate={appointmentDate}
          appointmentTime={appointmentTime}
          onAppointmentClick={handleAppointmentClick}
        />

        {/* CommentSection 컴포넌트 사용 */}
        <CommentSection
          isOpen={isCommentOpen}
          onClose={() => setCommentOpen(false)}
          projectId={projectId}
          applicantId={applicantId}
          stage="INTERVIEW"
          currentUserId={currentUserId}
        />
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        initialDate={appointmentDate}
        initialTime={appointmentTime}
      />
    </>
  );
}
