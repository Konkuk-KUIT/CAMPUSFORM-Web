'use client';

import { useState, useEffect } from 'react';
import { commentService } from '@/services/commentService';
import type { ReplyProps, CommentResponse, CommentStage } from '@/types/comment';
import BottomSheet from '@/components/ui/BottomSheet';
import InputComment from '@/components/ui/InputComment';
import Reply from '@/components/ui/Reply';
import { toast } from '@/components/Toast';
import Loading from '@/components/ui/Loading';

interface CommentSectionProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  applicantId: number;
  stage: CommentStage;
  currentUserId: number;
}

export default function CommentSection({
  isOpen,
  onClose,
  projectId,
  applicantId,
  stage,
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<ReplyProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 서버가 트리로 주기 때문에 isAuthor만 추가
  const mapComments = (commentList: CommentResponse[]): ReplyProps[] => {
    return commentList.map(comment => ({
      ...comment,
      authorProfileImage: comment.authorProfileImageUrl ?? undefined,
      isAuthor: comment.authorId === currentUserId,
      replies: comment.replies ? mapComments(comment.replies) : [],
    }));
  };

  // 댓글 불러오기
  const loadComments = async () => {
    if (!applicantId) return;

    setIsLoading(true);
    try {
      const response = await commentService.getComments(projectId, Number(applicantId), stage);
      setComments(mapComments(response));
    } catch (error) {
      console.error('댓글 불러오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async (content: string) => {
    try {
      await commentService.createComment(projectId, Number(applicantId), stage, {
        content,
        parentId: null,
      });
      await loadComments();
    } catch (error) {
      toast.error('댓글 작성에 실패했습니다.');
    }
  };

  // 답글 작성
  const handleReply = async (parentId: number, content: string) => {
    try {
      await commentService.createComment(projectId, Number(applicantId), stage, {
        content,
        parentId,
      });
      await loadComments();
    } catch (error) {
      toast.error('답글 작성에 실패했습니다.');
    }
  };

  // 댓글 수정
  const handleEdit = async (commentId: number, newContent: string) => {
    try {
      await commentService.updateComment(projectId, Number(applicantId), commentId, stage, {
        content: newContent,
        parentId: null,
      });
      await loadComments();
    } catch (error) {
      toast.error('댓글 수정에 실패했습니다.');
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId: number) => {
    try {
      await commentService.deleteComment(projectId, Number(applicantId), commentId, stage);
      await loadComments();
    } catch (error) {
      toast.error('댓글 삭제에 실패했습니다.');
    }
  };

  // 바텀시트 열릴 때 댓글 불러오기
  useEffect(() => {
    if (isOpen && applicantId) {
      loadComments();
    }
  }, [isOpen, applicantId]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <InputComment onSubmit={handleCommentSubmit} />

      <div className="space-y-2 mt-4">
        {isLoading ? (
          <Loading />
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-400 py-4">아직 댓글이 없습니다.</p>
        ) : (
          comments.map(comment => (
            <Reply
              key={comment.commentId}
              {...comment}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </BottomSheet>
  );
}
