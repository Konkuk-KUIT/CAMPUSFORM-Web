import apiClient from '@/lib/api';

export interface RequireMappings {
  nameIdx: number;
  schoolIdx: number;
  majorIdx: number;
  phoneIdx: number;
  emailIdx: number;
  positionIdx: number;
}

export interface CreateProjectRequest {
  title: string;
  sheetUrl: string;
  startAt: string;
  endAt: string;
  admins: number[];
  requireMappings: RequireMappings;
}

export interface CreateProjectResponse {
  id: number;
  title: string;
  ownerId: number;
  state: string;
  sheetUrl: string;
  sheetSyncStatus: string;
  lastSyncedAt: string;
  startAt: string;
  endAt: string;
  admins: number[];
  createdAt: string;
  applicantCount: number;
}

export interface GetProjectsResponse {
  id: number;
  title: string;
  ownerId: number;
  state: string;
  sheetUrl: string;
  sheetSyncStatus: string;
  lastSyncedAt: string;
  startAt: string;
  endAt: string;
  admins: number[];
  createdAt: string;
  applicantCount: number;
}

/**
 * 프로젝트 목록 조회
 */
export const getProjects = async (userId: number): Promise<GetProjectsResponse[]> => {
  const response = await apiClient.get('/projects', {
    params: { userId },
  });
  return response.data;
};

/**
 * 새 프로젝트 생성
 */
export const createProject = async (
  ownerId: number,
  data: CreateProjectRequest
): Promise<CreateProjectResponse> => {
  const response = await apiClient.post('/projects', data, {
    params: { ownerId },
  });
  return response.data;
};

/**
 * 프로젝트 삭제
 */
export const deleteProject = async (projectId: number, userId: number): Promise<void> => {
  await apiClient.delete(`/projects/${projectId}`, {
    params: { userId },
  });
};

export interface SheetHeader {
  name: string;
  index: number;
}

/**
 * 구글 시트 헤더 조회
 */
export const getSheetHeaders = async (sheetUrl: string): Promise<SheetHeader[]> => {
  const response = await apiClient.get('/projects/sheet-headers', {
    params: { sheetUrl },
  });
  return response.data;
};

/**
 * 구글 시트 데이터 동기화
 */
export const syncSheet = async (projectId: number): Promise<{ status: string; syncedCount: number; message: string }> => {
  const response = await apiClient.post(`/projects/${projectId}/sync-sheet`);
  return response.data;
};

/**
 * 구글 OAuth 권한 요청 URL 생성
 */
export const getGoogleAuthUrl = async (): Promise<{ additionalProp1: string; additionalProp2: string; additionalProp3: string }> => {
  const response = await apiClient.get('/projects/google-oauth/authorize-url');
  return response.data;
};

/**
 * 구글 OAuth 인증 코드 교환
 */
export const exchangeGoogleAuthCode = async (code: string, redirectUri: string): Promise<any> => {
  const response = await apiClient.post('/projects/google-oauth/exchange-code', {
    code,
    redirectUri,
  });
  return response.data;
};
