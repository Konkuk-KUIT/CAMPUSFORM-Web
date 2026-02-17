'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Project } from '@/types/project';
import NotificationBell from '@/components/ui/NotificationBell';

interface ResultPageHeaderProps {
  projectId: number;
  title: string;
  backHref: string;
  showSubtitle?: boolean;
}

export default function ResultPageHeader({ projectId, title, backHref, showSubtitle = true }: ResultPageHeaderProps) {
  const [projectTitle, setProjectTitle] = useState<string>('');

  useEffect(() => {
    axios
      .get<Project[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        const project = data.find(p => p.id === projectId);
        if (project?.title) setProjectTitle(project.title);
      });
  }, [projectId]);

  return (
    <>
      <header className="flex items-center justify-between h-12 px-4 bg-white">
        <Link href={backHref} className="w-6 h-6">
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </Link>
        <span className="text-title">{title}</span>
        <NotificationBell />
      </header>
      {showSubtitle && (
        <div className="bg-blue-50 h-10.75 flex items-center justify-center">
          <span className="text-subtitle-sm-md truncate flex-1 min-w-0 text-center mx-2">{projectTitle}</span>
        </div>
      )}
    </>
  );
}
