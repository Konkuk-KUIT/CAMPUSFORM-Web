// src/data/projects.ts
import { Project, Admin } from '@/types/project';

export const mockProjects: Project[] = [
  {
    id: 1,
    title: '요리퐁 6기 신입부원 모집',
    status: '모집 중',
    dateRange: '2025-11-12 ~ 2025-11-14',
    applicantCount: 5,
    startDate: '2025-11-12',
    endDate: '2025-11-14',
  },
  {
    id: 2,
    title: 'KUIT 5기 신입부원 모집',
    status: '모집 완료',
    dateRange: '2025-10-01 ~ 2025-10-15',
    applicantCount: 12,
    startDate: '2025-10-01',
    endDate: '2025-10-15',
  },
];

export const mockAdmins: Admin[] = [
  { id: 1, name: '나(대표)', email: 'myemail@gmail.com', isLeader: true },
  { id: 2, name: '닉네임', email: 'xxxxx@gmail.com' },
];