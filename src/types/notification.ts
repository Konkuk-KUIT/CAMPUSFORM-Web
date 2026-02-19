export type NotificationType = 'COMMENT_CREATED' | 'NEW_APPLICANT' | 'ADMIN_ADDED' | 'SHEET_SYNC_RESULT';

export interface NotificationPayload {
  commenter?: string;
  content?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: number;
  projectId: number;
  type: NotificationType;
  payload: NotificationPayload;
  read: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationsResponse {
  notifications: Notification[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface ReadAllResponse {
  updatedCount: number;
}

export interface NotificationSetting {
  enabled: boolean;
}
