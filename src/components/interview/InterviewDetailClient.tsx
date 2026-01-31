// 면접 상세 페이지 클라이언트 컴포넌트
'use client';

import { useState } from 'react';
import ApplicantCardBasic from '@/components/interview/ApplicantCardBasic';
import AppointmentModal from '@/components/interview/AppointmentModal';
import BottomSheet from '@/components/ui/BottomSheet';
import InputComment from '@/components/ui/InputComment';
import Reply from '@/components/ui/Reply';

export default function InterviewDetailClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('11월 15일 (수)');
  const [appointmentTime, setAppointmentTime] = useState('14:00');
  
  const handleAppointmentClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = (date: string, time: string) => {
    setAppointmentDate(date);
    setAppointmentTime(time);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="p-4">
        {/* 상세 내용 */}
        <ApplicantCardBasic
          name="김민준"
          gender="남"
          status="합격"
          university="건국대/컴퓨터공학과/일반부원"
          phone="010-1234-5678"
          email="minjun@gmail.com"
          commentCount={3}
          onCommentClick={() => setCommentOpen(true)}
          appointmentDate={appointmentDate}
          appointmentTime={appointmentTime}
          onAppointmentClick={handleAppointmentClick}
        />

        {/* 댓글 바텀시트 */}
        <BottomSheet isOpen={isCommentOpen} onClose={() => setCommentOpen(false)}>
          <InputComment />
          <Reply
            id="1"
            author="Seohee LEE"
            content="지원동기가 인상적이었어요."
            createdAt="2025.11.20. 14:20"
            isAuthor={true}
            replies={[]}
          />
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