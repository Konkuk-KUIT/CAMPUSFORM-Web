import apiClient from '@/lib/api';
import type { User, AuthResponse } from '@/types/auth';

class AuthService {
  // Google OAuth 시작
  loginWithGoogle(): void {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

    let loginUrl = `${baseURL}/oauth2/authorization/google`;

    // 로컬 개발 환경에서만 redirect_uri 추가
    if (redirectUri) {
      loginUrl += `?redirect_uri=${encodeURIComponent(redirectUri)}`;
    }

    window.location.href = loginUrl;
  }

  // 현재 사용자 정보 확인
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await apiClient.get<AuthResponse>('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return { isAuthenticated: false, user: null };
    }
  }

  // 프로필 완성 여부 체크
  isProfileCompleted(user: User | null): boolean {
    if (!user) return false;
    return !!(user.nickname && user.nickname.trim() !== '');
  }

  // 로그아웃
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/';
    }
  }
}

export const authService = new AuthService();
