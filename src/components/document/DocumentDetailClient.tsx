// 서류 상세 페이지 클라이언트 컴포넌트
'use client';

import { useState } from 'react';
import ApplicantCardBasic from '@/components/ui/ApplicantCardBasic';
import BottomSheet from '@/components/ui/BottomSheet';
import InputComment from '@/components/ui/InputComment';
import Reply from '@/components/ui/Reply';
import { mockApplicants } from '@/data/applicants';
import { mockComments } from '@/data/comments';

interface DocumentDetailClientProps {
  applicantId: string;
}

export default function DocumentDetailClient({ applicantId }: DocumentDetailClientProps) {
  // 지원자 데이터 가져오기
  const applicant = mockApplicants.find((a) => a.id === applicantId);

  const [isCommentOpen, setCommentOpen] = useState(false);

  // 댓글 데이터 가져오기
  const comments = mockComments.filter((c) => c.applicantId === applicantId);

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
          status={applicant.status}
          university={`${applicant.university}/${applicant.major}/${applicant.position}`}
          phone={applicant.phone}
          email={applicant.email}
          commentCount={applicant.commentCount}
          onCommentClick={() => setCommentOpen(true)}
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
    </>
  );
}