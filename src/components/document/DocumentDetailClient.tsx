'use client';

import { useState } from 'react';
import ApplicantCardBasic from '@/components/ui/ApplicantCardBasic';
import CommentSection from '@/components/sections/CommentSection';
import { mockApplicants } from '@/data/applicants';

interface DocumentDetailClientProps {
  applicantId: string;
}

export default function DocumentDetailClient({ applicantId }: DocumentDetailClientProps) {
  const applicant = mockApplicants.find(a => a.id === applicantId);
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // TODO: 실제 값으로 교체 필요
  const projectId = 1;
  const currentUserId = 1;

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
          status={applicant.status}
          university={`${applicant.university}/${applicant.major}/${applicant.position}`}
          phone={applicant.phone}
          email={applicant.email}
          commentCount={applicant.commentCount}
          isFavorite={isFavorite}
          onToggleFavorite={handleToggleFavorite}
          onCommentClick={() => setCommentOpen(true)}
        />

        {/* CommentSection 컴포넌트 사용 */}
        <CommentSection
          isOpen={isCommentOpen}
          onClose={() => setCommentOpen(false)}
          projectId={projectId}
          applicantId={applicantId}
          stage="DOCUMENT"
          currentUserId={currentUserId}
        />
      </div>
    </>
  );
}
