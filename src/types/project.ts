// src/types/project.ts
// export interface Project {
//   id: number;
//   title: string;
//   status: '모집 중' | '모집 완료';
//   dateRange: string;
//   applicantCount: number;
//   googleFormUrl?: string;
//   startDate?: string;
//   endDate?: string;
// }

// export interface Admin {
//   id: number;
//   name: string;
//   email: string;
//   isLeader?: boolean;
// }

export type ProjectState = 'DOCUMENT' | 'INTERVIEW' | 'DOCUMENT_COMPLETE' | 'INTERVIEW_COMPLETE';

export type ProjectRole = 'OWNER' | 'ADMIN';

export type SheetSyncStatus = 'OK' | 'NOT_SYNCED' | 'FAIL';

export interface RequiredMapping {
  nameIdx: number;
  schoolIdx: number;
  majorIdx: number;
  genderIdx: number;
  phoneIdx: number;
  emailIdx: number;
  positionIdx: number;
}

export interface ValueMapping {
  fromValue: string;
  toValue: string;
}

// ── Response ──────────────────────────────────────────────────

export interface Project {
  id: number;
  title: string;
  ownerId: number;
  state: ProjectState;
  sheetUrl: string;
  sheetSyncStatus: SheetSyncStatus;
  lastSyncedAt: string;
  startAt: string;
  endAt: string;
  admins: number[];
  createdAt: string;
  applicantCount: number;
}

export interface ProjectAdmin {
  userId: number;
  nickname: string;
  email: string;
  profileImageUrl: string;
}

export interface AddAdminResponse {
  adminId: number;
  adminName: string;
  email: string;
  profileImageUrl: string;
}

// ── Request ───────────────────────────────────────────────────

export interface ExchangeGoogleOAuthCodeRequest {
  code: string;
  redirectUri: string;
}

export interface CreateProjectRequest {
  title: string;
  sheetUrl: string;
  startAt: string; // YYYY-MM-DD
  endAt: string; // YYYY-MM-DD
  adminIds?: number[];
  requiredMappings: RequiredMapping;
  valueMappings?: ValueMapping[];
}

export interface AddAdminRequest {
  email: string;
}
