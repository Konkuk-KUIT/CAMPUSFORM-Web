'use client';

import { useState, useEffect } from 'react';
import PullToRefresh from '@/components/PullToRefresh';
import ApplicantCardBasic from '@/components/ui/ApplicantCardBasic';
import CommentSection from '@/components/sections/CommentSection';
import QuestionSection from '@/components/document/QuestionSection';
import Loading from '@/components/ui/Loading';
import { toast } from '@/components/Toast';
import { applicantService } from '@/services/applicantService';
import type { Applicant, ApplicantDetail, Stage } from '@/types/applicant';

interface DocumentDetailClientProps {
  applicantId: number;
  projectId: number;
  stage: Stage;
}

const statusMap: Record<string, string> = {
  HOLD: '보류',
  PASS: '합격',
  FAIL: '불합격',
};

const mapApplicant = (data: ApplicantDetail): Applicant => ({
  applicantId: data.applicantId,
  name: data.name,
  major: data.major,
  university: data.school ?? '',
  position: data.position ?? '',
  gender: data.gender ?? '',
  phoneNumber: data.phoneNumber ?? '',
  email: data.email ?? '',
  favorite: data.favorite,
  status: statusMap[data.status] ?? '보류',
  commentCount: data.commentCount ?? 0,
  answers: (data.answers ?? []).filter(a => a.question !== '타임스탬프'),
});

export default function DocumentDetailClient({ applicantId, projectId, stage }: DocumentDetailClientProps) {
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const currentUserId = 1;

  const fetchApplicant = async () => {
    try {
      const data = await applicantService.getApplicant(projectId, applicantId, stage);
      const mapped = mapApplicant(data);
      setApplicant(mapped);
      setIsFavorite(data.favorite);
    } catch (error) {
      console.error('지원자 조회 실패:', error);
      toast.error('지원자 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicant();
  }, [applicantId, projectId, stage]);

  const handleRefresh = async () => {
    try {
      await fetchApplicant();
    } catch {
      toast.error('새로고침에 실패했습니다.');
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await applicantService.toggleBookmark(projectId, applicantId, stage);
      setIsFavorite(prev => !prev);
    } catch (error) {
      console.error('북마크 토글 실패:', error);
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

          <div className="p-4 mx-4 bg-white rounded-10">
            {applicant.answers.map((answer, index) => (
              <QuestionSection key={index} title={answer.question} content={answer.answer} />
            ))}
          </div>
        </div>
      </PullToRefresh>

      <CommentSection
        isOpen={isCommentOpen}
        onClose={() => setCommentOpen(false)}
        projectId={projectId}
        applicantId={applicantId}
        stage={stage}
        currentUserId={currentUserId}
      />
    </div>
  );
}
