'use client';

import { useState, useEffect } from 'react';
import Loading from '@/components/ui/Loading';
import OwnerView from './OwnerView';
import AdminView from './AdminView';
import { projectService } from '@/services/projectService';
import { authService } from '@/services/authService';
import type { Project, ProjectAdmin, ProjectAdminRaw } from '@/types/project';

export interface ManageViewProps {
  projectId: number;
  project: Project;
  adminList: ProjectAdmin[];
  ownerUserId: number;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}

export default function ManageApplicationForm({ projectId }: { projectId: number }) {
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [viewProps, setViewProps] = useState<ManageViewProps | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        const [projects, auth, { admins }] = await Promise.all([
          projectService.getProjects(),
          authService.getCurrentUser(),
          projectService.getProjectAdmins(projectId),
        ]);

        console.log('raw admins:', admins);

        const found = projects.find(p => p.id === projectId);

        console.log('raw project:', found);

        if (!found || !auth.isAuthenticated || !auth.user) return;

        const currentUserId = auth.user.userId;
        const ownerIsMe = currentUserId === found.ownerId;

        const mappedAdmins: ProjectAdmin[] = admins.map((a: ProjectAdminRaw) => ({
          userId: a.adminId,
          nickname: a.adminName,
          email: a.email,
          profileImageUrl: a.profileImageUrl ?? '',
        }));

        const ownerAdmin: ProjectAdmin = ownerIsMe
          ? {
              userId: currentUserId,
              nickname: auth.user.nickname ?? '나(대표)',
              email: auth.user.email ?? '',
              profileImageUrl: auth.user.profileImageUrl ?? '',
            }
          : (mappedAdmins.find(a => a.userId === found.ownerId) ?? {
              userId: found.ownerId,
              nickname: '대표',
              email: '',
              profileImageUrl: '',
            });

        console.log('ownerAdmin:', ownerAdmin);
        console.log('ownerAdmin.userId:', ownerAdmin.userId);

        setIsOwner(ownerIsMe);
        setViewProps({
          projectId,
          project: found,
          adminList: [ownerAdmin, ...mappedAdmins.filter(a => a.userId !== found.ownerId)],
          ownerUserId: ownerAdmin.userId,
          status: found.state === 'DOCUMENT' ? '모집 중' : '모집 마감',
          startDate: new Date(found.startAt),
          endDate: new Date(found.endAt),
        });
      } catch (e) {
        console.error('프로젝트 정보 조회 오류:', e);
      }
    };

    fetchData();
  }, [projectId]);

  if (isOwner === null || !viewProps) return <Loading />;

  return isOwner ? <OwnerView {...viewProps} /> : <AdminView {...viewProps} />;
}
