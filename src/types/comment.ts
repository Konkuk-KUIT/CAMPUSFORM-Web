export type CommentStage = 'DOCUMENT' | 'INTERVIEW';

// 요청 바디
export interface CommentRequest {
  content: string;
  parentId: number | null;
}

// GET 응답
export interface CommentResponse {
  commentId: number;
  authorId: number;
  authorNickname: string;
  authorProfileImageUrl?: string | null;
  parentId: number | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  replies: CommentResponse[];
}

// POST/PATCH 응답 (동일해서 하나로 합침)
export interface CommentMutationResponse {
  commentId: number;
  authorId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentId: number | null;
}

// 트리 구조로 변환된 댓글 (UI용)
export interface ReplyProps {
  commentId: number;
  authorId: number;
  authorNickname: string;
  authorProfileImage?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentId: number | null;
  isAuthor: boolean;
  isNested?: boolean;
  replies?: ReplyProps[];
  onReply?: (commentId: number, content: string) => void;
  onEdit?: (commentId: number, content: string) => void;
  onDelete?: (commentId: number) => void;
}
