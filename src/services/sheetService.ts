import apiClient from '@/lib/api';

// 구글 시트 헤더(컬럼) 조회
// projectId를 반드시 전달하도록 변경
export async function fetchGoogleSheetHeaders(sheetUrl: string) {
  // 실제 API 명세: GET /api/projects/sheet-headers?sheetUrl=...
  const response = await apiClient.get(`/projects/sheet-headers`, {
    params: { sheetUrl },
  });
  console.log('시트 헤더 API 응답:', response.data);
  return response.data;
}
