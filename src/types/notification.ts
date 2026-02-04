// src/types/notification.ts
export interface Notification {
  id: number;
  type: 'comment' | 'applicant';
  title: string;
  subContent?: string;
  message: string;
  time: string;
  isRead: boolean;
}