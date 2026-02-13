import apiClient from '@/lib/api';
import type { CommentRequest, CommentMutationResponse, CommentResponse, CommentStage } from '@/types/comment';

class CommentService {
  // GET : 댓글 조회
  async getComments(projectId: number, applicantId: number, stage: CommentStage): Promise<CommentResponse[]> {
    const response = await apiClient.get(`/projects/${projectId}/applicants/${applicantId}/comments`, {
      params: { stage },
    });
    return response.data;
  }

  // POST : 댓글 작성
  async createComment(
    projectId: number,
    applicantId: number,
    stage: CommentStage,
    data: CommentRequest
  ): Promise<CommentMutationResponse> {
    const response = await apiClient.post(`/projects/${projectId}/applicants/${applicantId}/comments`, data, {
      params: { stage },
    });
    return response.data;
  }

  // PATCH : 댓글 수정
  async updateComment(
    projectId: number,
    applicantId: number,
    commentId: number,
    stage: CommentStage,
    data: CommentRequest
  ): Promise<CommentMutationResponse> {
    const response = await apiClient.patch(
      `/projects/${projectId}/applicants/${applicantId}/comments/${commentId}`,
      data,
      { params: { stage } }
    );
    return response.data;
  }

  // DELETE : 댓글 삭제
  async deleteComment(projectId: number, applicantId: number, commentId: number, stage: CommentStage): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/applicants/${applicantId}/comments/${commentId}`, {
      params: { stage },
    });
  }
}

export const commentService = new CommentService();
