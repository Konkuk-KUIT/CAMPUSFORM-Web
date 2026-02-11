import apiClient from '@/lib/api';

// 프로젝트 타입 정의
export interface Project {
  id: number;
  title: string;
  ownerId: number;
  state: 'DOCUMENT_OPEN' | 'DOCUMENT_CLOSED' | 'INTERVIEW_OPEN' | 'INTERVIEW_CLOSED' | 'COMPLETED';
  sheetUrl: string;
  sheetSyncStatus: 'NOT_SYNCED' | 'SYNCED' | 'SYNCING' | 'FAILED';
  lastSyncedAt: string;
  startAt: string;
  endAt: string;
  admins: number[];
  createdAt: string;
  applicantCount: number;
}

class ProjectService {
  // 면접 마감 및 프로젝트 전체 종료
  async completeAll(projectId: number): Promise<Project> {
    try {
      const response = await apiClient.patch<Project>(
        `/recruiting/projects/${projectId}/complete-all`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to complete project:', error);
      throw error;
    }
  }
}

export const projectService = new ProjectService();