import Image from 'next/image';

interface LoadingProps {
  size?: number;
  fullScreen?: boolean;
}

export default function Loading({ size = 25, fullScreen = true }: LoadingProps) {
  const containerClass = fullScreen
    ? 'flex items-center justify-center min-h-screen'
    : 'flex items-center justify-center';

  return (
    <div className={containerClass}>
      <Image src="/icons/loading.svg" alt="로딩 중" width={size} height={size} className="animate-spin" />
    </div>
  );
}
