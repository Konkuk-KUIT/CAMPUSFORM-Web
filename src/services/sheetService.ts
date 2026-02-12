import apiClient from '@/lib/api';

// 구글 시트 헤더(컬럼) 조회
export async function fetchGoogleSheetHeaders(sheetUrl: string) {
  // 주소를 안전하게 변환 (인코딩)
  const encodedUrl = encodeURIComponent(sheetUrl);
  
  // 백엔드 설정대로 sheetUrl 파라미터만 전송
  const response = await apiClient.get(`/projects/sheet-headers?sheetUrl=${encodedUrl}`);
  return response.data;
}