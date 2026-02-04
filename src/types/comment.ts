// 답글 타입
export interface Reply {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isAuthor: boolean;
}

// 댓글 타입
export interface Comment {
  id: string;
  applicantId: string; // 어떤 지원자의 댓글인지
  author: string;
  content: string;
  createdAt: string;
  isAuthor: boolean;
  replies?: Reply[];
}