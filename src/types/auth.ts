export interface User {
  userId: number; // 사용자 고유 ID
  email: string; // 사용자 이메일
  nickname: string | null; // 사용자 닉네임
  profileImageUrl?: string | null; // 사용자 이미지 URL
  image: string; // 사용자 이미지
}

export interface AuthResponse {
  isAuthenticated: boolean;
  user: User | null;
}
