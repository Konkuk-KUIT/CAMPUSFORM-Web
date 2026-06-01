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
      params: { useLocalhost: false },
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

  // PATCH : 프로젝트 이름 수정
  async updateProjectName(projectId: number, title: string): Promise<Project> {
    const response = await apiClient.patch<Project>(`/projects/${projectId}/name`, { title });
    return response.data;
  }

  // PATCH : 프로젝트 모집 기간 수정
  async updateProjectPeriod(projectId: number, data: { startAt: string; endAt: string }): Promise<any> {
    const response = await apiClient.patch(`/projects/${projectId}/period`, data);
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

  // GET: 기존 포지션 매핑 불러오기
  async getPositionValues(projectId: number) {
    const response = await apiClient.get(`/projects/${projectId}/position-values`);
    return response.data;
  }

  // PUT: 포지션 매핑 저장/수정 (upsert)
  async savePositionValues(projectId: number, valueMappings: { fromValue: string; toValue: string }[]) {
    const response = await apiClient.put(`/projects/${projectId}/position-values`, { valueMappings });
    return response.data;
  }

  // POST : 시트 수동 동기화
  async syncSheet(projectId: number): Promise<void> {
    await apiClient.post(`/projects/${projectId}/sync-sheet`);
  }

  // PATCH : 서류 단계 → 면접 단계로 전환 (파란 버튼: 다음 단계 면접 설정하기)
  // DOCUMENT → INTERVIEW
  async startInterview(projectId: number): Promise<Project> {
    const response = await apiClient.patch<Project>(`/recruiting/projects/${projectId}/start-interview`);
    return response.data;
  }

  // PATCH : 서류 단계 종료 - 면접 없이 모집 종료 (흰색 버튼)
  // DOCUMENT → DOCUMENT_COMPLETE
  async completeDocument(projectId: number): Promise<Project> {
    const response = await apiClient.patch<Project>(`/recruiting/projects/${projectId}/complete-document`);
    return response.data;
  }

  // PATCH : 면접 단계 종료 (프로젝트 전체 종료)
  async completeAll(projectId: number): Promise<Project> {
    const response = await apiClient.patch<Project>(`/recruiting/projects/${projectId}/complete-all`);
    return response.data;
  }

  // PATCH : 서류 단계로 롤백 (재활성화)
  // INTERVIEW 또는 DOCUMENT_COMPLETE → DOCUMENT
  // 면접 관련 데이터 전체 삭제, 서류 데이터는 유지
  async revertToDocument(projectId: number, userId: number): Promise<Project> {
    const response = await apiClient.patch<Project>(
      `/recruiting/projects/${projectId}/revert-to-document`,
      null,
      { params: { userId } }
    );
    return response.data;
  }

  // GET : 면접관 시간 등록 상태 조회 (availability)
  async getInterviewerAvailability(projectId: number, adminId: number): Promise<any> {
    const response = await apiClient.get(`/recruiting/projects/${projectId}/interviewers/${adminId}/availability`);
    return response.data;
  }

  // POST/PUT : 면접관 시간 등록 (availability 저장)
  async updateInterviewerAvailability(projectId: number, adminId: number, data: any): Promise<any> {
    const response = await apiClient.put(
      `/recruiting/projects/${projectId}/interviewers/${adminId}/availability`,
      data
    );
    return response.data;
  }

  // GET : 필수 면접관 목록 조회
  async getRequiredInterviewers(projectId: number): Promise<{ adminIds: number[] }> {
    const response = await apiClient.get(`/recruiting/projects/${projectId}/required-interviewers`);
    return response.data;
  }

  // PUT : 필수 면접관 전체 설정
  async updateRequiredInterviewers(projectId: number, adminIds: number[]): Promise<{ adminIds: number[] }> {
    const response = await apiClient.put(`/recruiting/projects/${projectId}/required-interviewers`, { adminIds });
    return response.data;
  }

  // PUT : 특정 면접관 필수 여부 설정/해제
  async updateRequiredInterviewer(
    projectId: number,
    adminId: number,
    required: boolean
  ): Promise<{ adminIds: number[] }> {
    const response = await apiClient.put(`/recruiting/projects/${projectId}/required-interviewers/${adminId}`, {
      required,
    });
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
  async submitApplicantAvailability(
    token: string,
    data: {
      name: string;
      phone: string;
      selections: Array<{ date: string; startTimes: string[] }>;
    }
  ): Promise<any> {
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

  // GET : 면접 공개 페이지 설정 조회 (공개 API - 지원자용, 토큰 기반)
  async getPublicInterviewConfig(token: string): Promise<{ projectTitle: string; guidanceText: string }> {
    const response = await apiClient.get(`/public/interview/config?token=${token}`);
    return response.data;
  }

  // GET : 관리자용 전체 면접 슬롯 목록 조회
  async getInterviewSlots(projectId: number): Promise<any> {
    const response = await apiClient.get(`/recruiting/projects/${projectId}/interview-slots`);
    return response.data;
  }
  // POST : 스마트 시간표 생성 미리보기
  // 알고리즘을 실행해 결과만 반환하고 DB에는 저장하지 않습니다.
  async generateSmartSchedule(projectId: number, userId: number): Promise<any> {
    const response = await apiClient.post(
      `/projects/${projectId}/interview/smart-schedule/generate`,
      null,
      {
        params: { userId },
      },
    );

    return response.data;
  }

  // POST : 스마트 시간표 최종 확정
  // 알고리즘 결과를 DB에 저장하여 확정합니다.
  async confirmSmartSchedule(projectId: number, userId: number): Promise<any> {
    const response = await apiClient.post(
      `/projects/${projectId}/interview/smart-schedule/confirm`,
      null,
      {
        params: { userId },
      },
    );

    return response.data;
  }

  // GET : 스마트 시간표 생성 미리보기
  async getSmartSchedulePreview(projectId: number): Promise<any> {
    const response = await apiClient.get(`/projects/${projectId}/interview/smart-schedule`);
    return response.data;
  }

  // GET : 확정된 스마트 시간표 조회
  // DB에 저장된 확정 시간표를 그대로 조회합니다.
  async getConfirmedSmartSchedule(projectId: number): Promise<any> {
    const response = await apiClient.get(
      `/projects/${projectId}/interview/smart-schedule/confirmed`,
    );
    return response.data;
  }

  // POST : 면접 설정 단계별 초기화
  // fromStep=1: 전체 초기화, fromStep=2: Step2~4 초기화
  async resetInterviewSetting(
    projectId: number,
    fromStep: 1 | 2,
    userId: number,
  ): Promise<any> {
    const response = await apiClient.post(
      `/recruiting/projects/${projectId}/interview-setting/reset`,
      null,
      {
        params: {
          fromStep,
          userId,
        },
      },
    );

    return response.data;
  }

  // DELETE : 특정 지원자의 수동 배정 정보 삭제
  async deleteManualAssignmentApplicant(
    projectId: number,
    applicantId: number,
    userId: number,
  ): Promise<any> {
    const response = await apiClient.delete(
      `/projects/${projectId}/interview/manual-assignments/applicants/${applicantId}`,
      {
        params: { userId },
      },
    );

    return response.data;
  }


  async resetSmartScheduleFromStep(
    projectId: number,
    step: 1 | 2,
    userId?: number,
  ): Promise<{ success: boolean }> {
    if (!userId) {
      console.warn('[ProjectService] resetSmartScheduleFromStep requires userId', { projectId, step });
      return { success: false };
    }

    await this.resetInterviewSetting(projectId, step, userId);
    return { success: true };
  }
}

export const projectService = new ProjectService();