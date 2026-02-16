import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// FormData일 때 Content-Type 자동 제거
apiClient.interceptors.request.use(config => {
  // FormData인 경우 Content-Type을 브라우저가 자동으로 설정하도록 제거
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

export default apiClient;
