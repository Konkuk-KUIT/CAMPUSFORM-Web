// 서버에서 받는 댓글 기본 정보
export interface CommentResponse {
  commentId: number; // 댓글 고유 ID
  authorId: number; // 작성자 ID
  parentId: number; // 부모 댓글 ID (0이면 최상위 댓글, 0이 아니면 대댓글)
  content: string; // 댓글 내용
  createdAt: string; // 생성 시간
  updatedAt: string; // 수정 시간
}

// 댓글 작성/수정 시 서버로 보내는 데이터
export interface CommentRequest {
  content: string; // 댓글 내용
  parentId: number; // 부모 댓글 ID
}

// 댓글 작성 후 서버 응답
export interface CreateCommentResponse {
  commentId: number; // 생성된 댓글 ID
  parentId: number; // 부모 댓글 ID
  createdAt: string; // 생성 시간
}

// 댓글 수정 후 서버 응답
export interface UpdateCommentResponse {
  commentId: number; // 수정된 댓글 ID
  updatedAt: string; // 수정 시간
}

// 모집 단계 (DOCUMENT: 서류 단계, INTERVIEW: 면접 단계)
export type CommentStage = 'DOCUMENT' | 'INTERVIEW';

// Reply 컴포넌트에서 사용하는 Props
export interface ReplyProps {
  commentId: number; // 댓글 고유 ID
  authorId: number; // 작성자 ID
  authorName: string; // 작성자 이름 (UI 표시용)
  authorProfileImage?: string; // 작성자 프로필 이미지 URL
  content: string; // 댓글 내용
  createdAt: string; // 생성 시간
  updatedAt: string; // 수정 시간
  parentId: number; // 부모 댓글 ID (0이면 최상위, 아니면 대댓글)
  isAuthor: boolean; // 현재 로그인한 사용자가 작성한 댓글인지 여부
  isNested?: boolean; // 대댓글인지 여부 (UI 들여쓰기용)
  onReply?: (commentId: number) => void; // 답글 버튼 클릭 핸들러
  onEdit?: (commentId: number) => void; // 수정 버튼 클릭 핸들러
  onDelete?: (commentId: number) => void; // 삭제 버튼 클릭 핸들러
  replies?: ReplyProps[]; // 하위 대댓글들 (재귀 구조)
}
