
import apiClient from '@/lib/api';
import type {
  Project,
  GetProjectAdminsResponse,
  AddAdminResponse,
  CreateProjectRequest,
  AddAdminRequest,
} from '@/types/project';

class ProjectService {
    // GET : 면접 정보 설정 조회
    async getInterviewSetting(projectId: number): Promise<any> {
      const response = await apiClient.get(`/recruiting/projects/${projectId}/interview-setting`);
      return response.data;
    }
  
    // PUT : 면접 정보 설정 저장/수정
    async updateInterviewSetting(projectId: number, data: any): Promise<any> {
      const response = await apiClient.put(`/recruiting/projects/${projectId}/interview-setting`, data);
      return response.data;
    }
  // GET : 구글 OAuth 동의 URL 조회
  async getGoogleAuthorizeUrl(): Promise<string> {
    const response = await apiClient.get('/projects/google-oauth/authorize-url', {
      params: { useLocalhost: true },
    });
    return response.data.authorizeUrl;
  }

  // POST : OAuth 코드 → 토큰 교환
  async exchangeGoogleCode(code: string): Promise<void> {
    await apiClient.post('/projects/google-oauth/exchange-code', {
      code,
      redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI_2,
    });
  }

  // GET : 스프레드시트 헤더(컬럼) 목록 조회
  async getSheetHeaders(sheetUrl: string): Promise<{ headers: string[] }> {
    const response = await apiClient.get('/projects/sheet-headers', {
      params: { sheetUrl },
    });
    return response.data;
  }

  // GET : 프로젝트 목록 조회
  async getProjects(): Promise<Project[]> {
    const response = await apiClient.get('/projects');
    return Array.isArray(response.data) ? response.data : (response.data.projects ?? []);
  }

  // POST : 프로젝트 생성 (exchangeGoogleCode 완료 후 호출)
  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await apiClient.post<Project>('/projects', data);
    return response.data;
  }

  // DELETE : 프로젝트 삭제 (OWNER 전용)
  async deleteProject(projectId: number): Promise<void> {
    await apiClient.delete(`/projects/${projectId}`);
  }

  // GET : 프로젝트 상세 내보내기
  async exportProject(projectId: number): Promise<Project> {
    const response = await apiClient.get<Project>(`/projects/${projectId}/export`);
    return response.data;
  }

  // GET : 관리자 목록 조회 (OWNER 제외하고 ADMIN만 반환)
  async getProjectAdmins(projectId: number): Promise<GetProjectAdminsResponse> {
    const response = await apiClient.get(`/projects/${projectId}/admins`);
    return response.data;
  }

  // POST : 관리자 추가 (OWNER 전용)
  async addProjectAdmin(projectId: number, data: AddAdminRequest): Promise<AddAdminResponse> {
    const response = await apiClient.post<AddAdminResponse>(`/projects/${projectId}/admins`, data);
    return response.data;
  }

  // DELETE : 관리자 제거 (OWNER 전용, 자기 자신 제거 불가)
  async removeProjectAdmin(projectId: number, adminId: number): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/admins/${adminId}`);
  }

  // GET : 포지션 컬럼 고유값 조회 (치환 규칙 설정용)
  async getMappingColumnValues(sheetUrl: string, positionColumnIndex: number): Promise<{ values: string[] }> {
    const response = await apiClient.get('/projects/mapping-column-values', {
      params: { sheetUrl, positionColumnIndex },
    });
    return response.data;
  }

  // POST : 시트 수동 동기화
  async syncSheet(projectId: number): Promise<void> {
    await apiClient.post(`/projects/${projectId}/sync-sheet`);
  }

  // PATCH : 서류 단계 종료
  async completeDocument(projectId: number): Promise<Project> {
    const response = await apiClient.patch<Project>(`/recruiting/projects/${projectId}/complete-document`);
    return response.data;
  }

  // PATCH : 면접 단계 종료 (프로젝트 전체 종료)
  async completeAll(projectId: number): Promise<Project> {
    const response = await apiClient.patch<Project>(`/recruiting/projects/${projectId}/complete-all`);
    return response.data;
  }

  // GET : 면접관 시간 등록 상태 조회 (availability)
  async getInterviewerAvailability(projectId: number, adminId: number): Promise<any> {
    const response = await apiClient.get(`/recruiting/projects/${projectId}/interviewers/${adminId}/availability`);
    return response.data;
  }

  // POST/PUT : 면접관 시간 등록 (availability 저장)
  async updateInterviewerAvailability(projectId: number, adminId: number, data: any): Promise<any> {
    const response = await apiClient.put(`/recruiting/projects/${projectId}/interviewers/${adminId}/availability`, data);
    return response.data;
  }

  // GET : 지원자 시간 제출 페이지 설정 조회
  async getApplicantLinkConfig(projectId: number): Promise<any> {
    const response = await apiClient.get(`/recruiting/projects/${projectId}/investigation-link/config`);
    return response.data;
  }

  // PUT : 지원자 시간 제출 페이지 설정 수정
  async updateApplicantLinkConfig(projectId: number, data: { enabled?: boolean; guidanceText?: string }): Promise<any> {
    const response = await apiClient.put(`/recruiting/projects/${projectId}/investigation-link/config`, data);
    return response.data;
  }

  // GET : 지원자 시간 제출 링크 조회
  async getInvestigationLink(projectId: number): Promise<any> {
    const response = await apiClient.get(`/recruiting/projects/${projectId}/investigation-link`);
    return response.data;
  }

  // POST : 지원자 면접 가능 시간 제출 (공개 API)
  async submitApplicantAvailability(token: string, data: {
    name: string;
    phoneNumber: string;
    availabilities: Array<{ date: string; startTimes: string[] }>;
  }): Promise<any> {
    const response = await apiClient.post(`/public/interview/submit?token=${token}`, data);
    return response.data;
  }

  // GET : 슬롯별 신청 지원자 목록 조회 (응답 결과)
  async getInterviewSlotsApplicants(projectId: number): Promise<any> {
    const response = await apiClient.get(`/recruiting/projects/${projectId}/interview-slots/applicants`);
    return response.data;
  }

  // GET : 면접 슬롯 조회 (공개 API - 지원자용, 토큰 기반)
  async getPublicInterviewSlots(token: string): Promise<any> {
    const response = await apiClient.get(`/public/interview/slots?token=${token}`);
    return response.data;
  }

  // GET : 관리자용 전체 면접 슬롯 목록 조회
  async getInterviewSlots(projectId: number): Promise<any> {
    const response = await apiClient.get(`/recruiting/projects/${projectId}/interview-slots`);
    return response.data;
  }
}

export const projectService = new ProjectService();
