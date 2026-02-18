'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Project } from '@/types/project';

interface InterviewCompleteContentProps {
  projectId: number;
}

export default function InterviewCompleteContent({ projectId }: InterviewCompleteContentProps) {
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
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="mb-2">
        <Image src="/icons/celebration.svg" alt="축하" width={196} height={196} />
      </div>
      <h1 className="text-subtitle-sm-md text-center">와! &apos;{projectTitle}&apos;</h1>
      <h2 className="text-subtitle-md text-center mb-6">절차가 모두 마무리 되었습니다!</h2>
      <p className="text-subtitle-md text-black text-center mb-8">긴 절차 동안 수고 많으셨어요</p>
    </div>
  );
}