/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'campus-form-bucket.s3.ap-northeast-2.amazonaws.com',
        pathname: '/profile-images/**',
      },
      // 또는 모든 S3 경로 허용
      {
        protocol: 'https',
        hostname: 'campus-form-bucket.s3.ap-northeast-2.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;
