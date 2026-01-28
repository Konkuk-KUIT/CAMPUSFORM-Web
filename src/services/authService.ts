export const authService = {
  // 로그인
  login: () => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    window.location.href = `${baseURL}/oauth2/authorization/google`;
  },
};
