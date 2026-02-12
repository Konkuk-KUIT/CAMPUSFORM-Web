import apiClient from '@/lib/api';

// Google OAuth 권한 요청 URL 생성
export const getGoogleAuthorizeUrl = async (): Promise<string> => {
  const response = await apiClient.get('/projects/google-oauth/authorize-url', {
    params: {
      useLocalhost: true,
    },
  });
  return response.data.authorizeUrl;
};

// OAuth 코드 → 토큰 교환 (REDIRECT_URI_2 사용)
export const exchangeGoogleCode = async (code: string) => {
  const response = await apiClient.post('/projects/google-oauth/exchange-code', {
    code,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI_2,
  });
  return response.data;
};

// 시트 URL로 헤더(컬럼) 목록 조회
export const getSheetHeaders = async (sheetUrl: string): Promise<Array<{ name: string; index: number }>> => {
  const response = await apiClient.get('/projects/sheet-headers', {
    params: { sheetUrl },
  });
  return response.data;
};

// 시트 데이터 ↔ 지원자 정보 동기화
export const syncSheet = async (projectId: number) => {
  const response = await apiClient.post(`/projects/${projectId}/sync-sheet`);
  return response.data;
};

// 포지션 컬럼 고유값 조회 (편집 시 치환 규칙 설정용)
export const getMappingColumnValues = async (projectId: number): Promise<{ values: string[] }> => {
  const response = await apiClient.get(`/projects/${projectId}/mapping-column-values`);
  return response.data;
};
