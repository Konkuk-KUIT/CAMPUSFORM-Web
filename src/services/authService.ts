import apiClient from '@/lib/api';
import type { User, AuthResponse } from '@/types/auth';

class AuthService {
  // OAuth : Google 로그인 시작
  loginWithGoogle(): void {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

    let loginUrl = `${baseURL}/oauth2/authorization/google`;

    if (redirectUri) {
      loginUrl += `?redirect_uri=${encodeURIComponent(redirectUri)}`;
    }

    window.location.href = loginUrl;
  }

  // GET : 현재 사용자 정보 확인
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await apiClient.get<AuthResponse>('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return { isAuthenticated: false, user: null };
    }
  }

  // PATCH : 닉네임 변경
  async updateNickname(nickname: string): Promise<{ nickname: string }> {
    const response = await apiClient.patch('/users/nickname', { nickname });
    return response.data;
  }

  // PATCH : 프로필 이미지 변경
  async updateProfileImage(imageFile: File): Promise<{ profileImageUrl: string }> {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await apiClient.patch('/users/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // DELETE : 프로필 이미지 삭제
  async deleteProfileImage(): Promise<{ message: string }> {
    const response = await apiClient.delete('/users/profile-image');
    return response.data;
  }

  // 프로필 완성 여부 체크
  isProfileCompleted(user: User | null): boolean {
    if (!user) return false;
    return !!(user.nickname && user.nickname.trim() !== '');
  }

  // POST : 로그아웃
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
