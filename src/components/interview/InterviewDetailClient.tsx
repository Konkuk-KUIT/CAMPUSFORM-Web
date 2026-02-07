// 면접 상세 페이지 클라이언트 컴포넌트
'use client';

import { useState } from 'react';
import ApplicantCardBasic from '@/components/interview/ApplicantCardBasic';
import AppointmentModal from '@/components/interview/AppointmentModal';
import BottomSheet from '@/components/ui/BottomSheet';
import InputComment from '@/components/ui/InputComment';
import Reply from '@/components/ui/Reply';
import { mockInterviewApplicants } from '@/data/interviews';
import { mockComments } from '@/data/comments';

interface InterviewDetailClientProps {
  applicantId: string;
}

export default function InterviewDetailClient({ applicantId }: InterviewDetailClientProps) {
  // 지원자 데이터 가져오기
  const applicant = mockInterviewApplicants.find((a) => a.id === applicantId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(applicant?.appointmentDate || '');
  const [appointmentTime, setAppointmentTime] = useState(applicant?.appointmentTime || '');

  // 댓글 데이터 가져오기
  const comments = mockComments.filter((c) => c.applicantId === applicantId);

  const handleAppointmentClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = (date: string, time: string) => {
    setAppointmentDate(date);
    setAppointmentTime(time);
    setIsModalOpen(false);
  };

  // 즐겨찾기 토글 핸들러
  const handleToggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  // 지원자를 찾지 못한 경우
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
        {/* 상세 내용 */}
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

        {/* 댓글 바텀시트 */}
        <BottomSheet isOpen={isCommentOpen} onClose={() => setCommentOpen(false)}>
          <InputComment />
          <div className="space-y-4 mt-4">
            {comments.length === 0 ? (
              <p className="text-center text-gray-400 py-4">아직 댓글이 없습니다.</p>
            ) : (
              comments.map((comment) => (
                <Reply
                  key={comment.id}
                  id={comment.id}
                  author={comment.author}
                  content={comment.content}
                  createdAt={comment.createdAt}
                  isAuthor={comment.isAuthor}
                  replies={comment.replies}
                />
              ))
            )}
          </div>
        </BottomSheet>
      </div>

      {/* 모달 */}
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