'use client';

import { useEffect } from 'react';
import { useCurrentProjectStore } from '@/store/currentProjectStore';

export default function ProjectIdSetter({ projectId }: { projectId: number }) {
  const setProjectId = useCurrentProjectStore(s => s.setProjectId);

  useEffect(() => {
    setProjectId(projectId);
  }, [projectId, setProjectId]);

  return null;
}