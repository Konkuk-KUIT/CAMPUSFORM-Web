import apiClient from '@/lib/api';

// 구글 OAuth 권한 요청 URL 받아오기 (GET, redirectUrl 쿼리 파라미터)
export async function fetchGoogleAuthorizeUrl(redirectUrl: string) {
  const response = await apiClient.get('/projects/google-oauth/authorize-url', { params: { redirectUri: redirectUrl } });
  return response.data;
}

// 구글 OAuth 인증 코드로 토큰 교환
export async function exchangeGoogleOAuthCode(code: string, redirectUri: string) {
  const response = await apiClient.post('/projects/google-oauth/exchange-code', { code, redirectUri });
  return response.data;
}
