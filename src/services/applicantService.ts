import apiClient from '@/lib/api';
import type { Applicant, ApplicantsRawResponse, Stage } from '@/types/applicant';

class ApplicantService {
  // GET : 지원자 목록 조회 (stage별 필터링)
  async getApplicants(projectId: number, stage: Stage, sort?: string): Promise<ApplicantsRawResponse> {
    const response = await apiClient.get(`/projects/${projectId}/applicants`, {
      params: { stage, ...(sort && { sort }) },
    });
    return response.data;
  }

  // GET : 특정 지원자 상세 조회
  async getApplicant(projectId: number, applicantId: number, stage: Stage): Promise<Applicant> {
    const response = await apiClient.get(`/projects/${projectId}/applicants/${applicantId}`, {
      params: { stage },
    });
    return response.data;
  }

  // PATCH : 지원자 상태 변경 (HOLD / PASS / FAIL)
  async updateStatus(
    projectId: number,
    applicantId: number,
    stage: Stage,
    status: string
  ): Promise<{ applicantId: number; currentStatus: string; updatedAt: string }> {
    const response = await apiClient.patch(
      `/projects/${projectId}/applicants/${applicantId}`,
      { status },
      { params: { stage } }
    );
    return response.data;
  }

  // PATCH : 즐겨찾기 토글
  async toggleBookmark(projectId: number, applicantId: number, stage: Stage): Promise<void> {
    await apiClient.patch(`/projects/${projectId}/applicants/${applicantId}/bookmark`, null, { params: { stage } });
  }
}

export const applicantService = new ApplicantService();
