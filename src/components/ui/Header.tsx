// components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  title: string;
  backTo?: string;
}

export default function Header({ title, backTo }: HeaderProps) {
  return (
    <header className="flex items-center justify-center h-12 relative">
      {backTo && (
        <Link href={backTo} className="absolute left-4 p-2">
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </Link>
      )}
      <span className="text-title font-semibold">{title}</span>
    </header>
  );
}
