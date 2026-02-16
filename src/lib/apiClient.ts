// lib/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // 세션 쿠키 자동 전송 (중요!)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 세션 만료 시 로그인 페이지로
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;