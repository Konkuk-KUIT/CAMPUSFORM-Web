/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // S3 프로필 이미지
      {
        protocol: 'https',
        hostname: 'campus-form-bucket.s3.ap-northeast-2.amazonaws.com',
        pathname: '/profile-images/**',
      },
      {
        protocol: 'https',
        hostname: 'campus-form-bucket.s3.ap-northeast-2.amazonaws.com',
      },
      // 구글 프로필 이미지
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
