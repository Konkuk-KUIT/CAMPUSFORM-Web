'use client';

import { useState, useEffect } from 'react';
import { commentService } from '@/services/commentService';
import type { ReplyProps, CommentResponse, CommentStage } from '@/types/comment';
import BottomSheet from '@/components/ui/BottomSheet';
import InputComment from '@/components/ui/InputComment';
import Reply from '@/components/ui/Reply';

interface CommentSectionProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  applicantId: string;
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

  // 댓글 트리 만들기
  const buildCommentTree = (commentList: CommentResponse[]): ReplyProps[] => {
    const commentMap = new Map<number, ReplyProps>();
    const rootComments: ReplyProps[] = [];

    commentList.forEach(comment => {
      commentMap.set(comment.commentId, {
        commentId: comment.commentId,
        authorId: comment.authorId,
        authorName: `사용자${comment.authorId}`,
        authorProfileImage: undefined,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        parentId: comment.parentId,
        isAuthor: comment.authorId === currentUserId,
        replies: [],
      });
    });

    commentList.forEach(comment => {
      const currentComment = commentMap.get(comment.commentId)!;
      if (comment.parentId === 0) {
        rootComments.push(currentComment);
      } else {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(currentComment);
        }
      }
    });

    return rootComments;
  };

  // 댓글 불러오기
  const loadComments = async () => {
    if (!applicantId) return;

    setIsLoading(true);
    try {
      const response = await commentService.getComments(projectId, Number(applicantId), stage);
      const tree = buildCommentTree(response);
      setComments(tree);
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
        parentId: 0,
      });
      await loadComments();
    } catch (error) {
      alert('댓글 작성 실패');
    }
  };

  // 댓글 수정
  const handleEdit = async (commentId: number) => {
    const newContent = prompt('수정할 내용:');
    if (!newContent) return;

    try {
      await commentService.updateComment(projectId, Number(applicantId), commentId, stage, {
        content: newContent,
        parentId: 0,
      });
      await loadComments();
    } catch (error) {
      alert('댓글 수정 실패');
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId: number) => {
    if (!confirm('삭제하시겠습니까?')) return;

    try {
      await commentService.deleteComment(projectId, Number(applicantId), commentId, stage);
      await loadComments();
    } catch (error) {
      alert('댓글 삭제 실패');
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

      <div className="space-y-4 mt-4">
        {isLoading ? (
          <p className="text-center text-gray-400 py-4">로딩 중...</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-400 py-4">아직 댓글이 없습니다.</p>
        ) : (
          comments.map(comment => (
            <Reply key={comment.commentId} {...comment} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        )}
      </div>
    </BottomSheet>
  );
}
