'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCurrentProjectStore } from '@/store/currentProjectStore';
import type { Project } from '@/types/project';
import axios from 'axios';

export default function DocumentResultHeader() {
  const projectId = useCurrentProjectStore(s => s.projectId);
  const [title, setTitle] = useState<string>('서류 결과');

  useEffect(() => {
    if (!projectId) return;
    axios
      .get<Project[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        const project = data.find(p => p.id === projectId);
        if (project?.title) setTitle(project.title);
      });
  }, [projectId]);

  const backHref = projectId ? `/document/${projectId}` : '/document';

  return (
    <>
      <header className="flex items-center justify-between h-12 px-4 bg-white">
        <Link href={backHref} className="w-6 h-6">
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </Link>
        <span className="text-title">서류 결과</span>
        <button className="w-6 h-6">
          <Image src="/icons/notification.svg" alt="알림" width={24} height={24} />
        </button>
      </header>
      <div className="bg-blue-50 h-10.75 flex items-center justify-center">
        <span className="text-subtitle-sm-md">{title}</span>
      </div>
    </>
  );
}
