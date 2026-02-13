'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ToastContainer } from '@/components/Toast';
import { projectService } from '@/services/projectService';

interface DocumentDetailHeaderProps {
  projectId: number;
}

export default function DocumentDetailHeader({ projectId }: DocumentDetailHeaderProps) {
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const projects = await projectService.getProjects();
        const project = projects.find(p => p.id === projectId);
        setProjectName(project?.title ?? '프로젝트');
      } catch {
        setProjectName('프로젝트');
      }
    };
    fetchProjectName();
  }, [projectId]);

  return (
    <>
      <ToastContainer />
      <header className="shrink-0 flex items-center justify-between h-12 px-4 bg-white">
        <Link href={`/document/${projectId}`} className="w-6 h-6">
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </Link>
        <span className="text-title">{projectName}</span>
        <button className="w-6 h-6">
          <Image src="/icons/notification.svg" alt="알림" width={24} height={24} />
        </button>
      </header>
    </>
  );
}
