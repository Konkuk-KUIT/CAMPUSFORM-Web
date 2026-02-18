'use client';

import { useState, useEffect } from 'react';
import Loading from '@/components/ui/Loading';
import OwnerView from './OwnerView';
import AdminView from './AdminView';
import { projectService } from '@/services/projectService';
import { authService } from '@/services/authService';
import type { Project, ProjectAdmin, ProjectAdminRaw } from '@/types/project';
import { useManualCloseStore } from '@/store/manualCloseStore';

export interface ManageViewProps {
  projectId: number;
  project: Project;
  adminList: ProjectAdmin[];
  ownerUserId: number;
  status: string;
  onStatusChange?: (newStatus: string) => void;
  startDate: Date | null;
  endDate: Date | null;
}

export default function ManageApplicationForm({ projectId }: { projectId: number }) {
  const { closedProjectIds, openedProjectIds, closeProject, openProject } = useManualCloseStore();
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [viewProps, setViewProps] = useState<ManageViewProps | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        const [projects, auth, { owner, admins }] = await Promise.all([
          projectService.getProjects(),
          authService.getCurrentUser(),
          projectService.getProjectAdmins(projectId),
        ]);

        const found = projects.find(p => p.id === projectId);
        if (!found || !auth.isAuthenticated || !auth.user) return;

        const isManuallyClosed = closedProjectIds.includes(projectId);
        const isActive = found.state === 'DOCUMENT' && !isManuallyClosed;

        const currentUserId = auth.user.userId;
        const ownerIsMe = currentUserId === owner.adminId;

        const ownerAdmin: ProjectAdmin = {
          userId: owner.adminId,
          nickname: owner.adminName,
          email: owner.email,
          profileImageUrl: owner.profileImageUrl ?? '',
        };

        const mappedAdmins: ProjectAdmin[] = admins.map((a: ProjectAdminRaw) => ({
          userId: a.adminId,
          nickname: a.adminName,
          email: a.email,
          profileImageUrl: a.profileImageUrl ?? '',
        }));

        setIsOwner(ownerIsMe);
        setViewProps({
          projectId,
          project: found,
          adminList: [ownerAdmin, ...mappedAdmins],
          ownerUserId: owner.adminId,
          status: isActive ? '모집 중' : '모집 완료',
          onStatusChange: (newStatus: string) => {
            if (newStatus === '모집 완료') {
              closeProject(projectId);
            } else {
              openProject(projectId);
            }
          },
          startDate: new Date(found.startAt),
          endDate: new Date(found.endAt),
        });
      } catch (e) {
        console.error('프로젝트 정보 조회 오류:', e);
      }
    };

    fetchData();
  }, [projectId, closedProjectIds, openedProjectIds]);

  if (isOwner === null || !viewProps) return <Loading />;

  return isOwner ? <OwnerView {...viewProps} /> : <AdminView {...viewProps} />;
}