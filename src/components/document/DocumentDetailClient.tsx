'use client';

import { useState } from 'react';
import PullToRefresh from '@/components/PullToRefresh';
import ApplicantCardBasic from '@/components/ui/ApplicantCardBasic';
import CommentSection from '@/components/sections/CommentSection';
import QuestionSection from '@/components/document/QuestionSection';
import { mockApplicants } from '@/data/applicants';

interface DocumentDetailClientProps {
  applicantId: number;
}

export default function DocumentDetailClient({ applicantId }: DocumentDetailClientProps) {
  const [applicant, setApplicant] = useState(mockApplicants.find(a => a.applicantId === applicantId));
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const projectId = 1;
  const currentUserId = 1;

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const refreshedApplicant = mockApplicants.find(a => a.applicantId === applicantId);
    setApplicant(refreshedApplicant);
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
    <div className="h-full flex flex-col">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="pb-20">
          {/* 지원자 기본 정보 카드 */}
          <div className="p-4">
            <ApplicantCardBasic
              name={applicant.name}
              gender={applicant.gender}
              status={applicant.status}
              university={`${applicant.university}/${applicant.major}/${applicant.position}`}
              phoneNumber={applicant.phoneNumber}
              email={applicant.email}
              commentCount={applicant.commentCount}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              onCommentClick={() => setCommentOpen(true)}
            />
          </div>

          {/* 질문 섹션들 */}
          <div className="p-4 mx-4 bg-white rounded-10">
            <QuestionSection
              title="지원동기"
              content="요리에 대한 관심을 꾸준히 가져왔고, 기본기를 제대로 배우고 싶어 지원했습니다. 혼자 할 때보다 함께 조리하며 배우는 과정이 더 큰 동기부여가 된다고 생각합니다. 다양한 레시피를 시도해 보고 서로의 노하우를 나누며 실력을 키우고 싶습니다. 동아리 활동을 통해 배운 내용을 일상에서도 활용할 수 있을 것이라 기대합니다."
            />

            <QuestionSection
              title="이 동아리에 참여하고 싶은 이유를 서술해주세요."
              content="요리에 대한 관심을 꾸준히 가져왔고, 기본기를 제대로 배우고 싶어 지원했습니다. 혼자 할 때보다 함께 조리하며 배우는 과정이 더 큰 동기부여가 된다고 생각합니다. 다양한 레시피를 시도해 보고 서로의 노하우를 나누며 실력을 키우고 싶습니다. 동아리 활동을 통해 배운 내용을 일상에서도 활용할 수 있을 것이라 기대합니다."
              maxLength={700}
            />

            <QuestionSection title="질문내용" content="질문답변" />
          </div>
        </div>
      </PullToRefresh>

      {/* CommentSection */}
      <CommentSection
        isOpen={isCommentOpen}
        onClose={() => setCommentOpen(false)}
        projectId={projectId}
        applicantId={applicantId}
        stage="DOCUMENT"
        currentUserId={currentUserId}
      />
    </div>
  );
}
