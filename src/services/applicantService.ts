import { Applicant, ApplicantsResponse, Stage, UpdateStatusRequest } from '@/types/applicant';

class ApplicantService {
  private baseUrl = '/api/projects';

  // 지원자 목록 조회 (stage별 필터링)
  async getApplicants(projectId: number, stage: Stage, sort?: string): Promise<ApplicantsResponse> {
    const params = new URLSearchParams({
      stage,
      ...(sort && { sort }),
    });

    const response = await fetch(`${this.baseUrl}/${projectId}/applicants?${params}`);
    return response.json();
  }

  // 특정 지원자 상세 조회
  async getApplicant(projectId: number, applicantId: number, stage: Stage): Promise<Applicant> {
    const response = await fetch(`${this.baseUrl}/${projectId}/applicants/${applicantId}?stage=${stage}`);
    return response.json();
  }

  // 지원자 상태 변경 (합격/불합격)
  async updateStatus(
    projectId: number,
    applicantId: number,
    stage: Stage,
    status: string
  ): Promise<{ applicantId: number; currentStatus: string; updatedAt: string }> {
    const response = await fetch(`${this.baseUrl}/${projectId}/applicants/${applicantId}?stage=${stage}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return response.json();
  }

  // 즐겨찾기 토글
  async toggleBookmark(projectId: number, applicantId: number, stage: Stage): Promise<void> {
    await fetch(`${this.baseUrl}/${projectId}/applicants/${applicantId}/bookmark?stage=${stage}`, { method: 'PATCH' });
  }
}

export const applicantService = new ApplicantService();
