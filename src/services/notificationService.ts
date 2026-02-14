import apiClient from '@/lib/api';
import type {
  Notification,
  NotificationsResponse,
  UnreadCountResponse,
  ReadAllResponse,
  NotificationSetting,
} from '@/types/notification';

class NotificationService {
  // GET : 알림 목록 조회 (페이지네이션)
  async getNotifications(page = 0, size = 20): Promise<NotificationsResponse> {
    const response = await apiClient.get<NotificationsResponse>('/notifications', {
      params: { page, size },
    });
    return response.data;
  }

  // GET : 안 읽은 알림 개수 조회
  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await apiClient.get<UnreadCountResponse>('/notifications/unread-count');
    return response.data;
  }

  // PATCH : 알림 단건 읽음 처리
  async markAsRead(id: number): Promise<Notification> {
    const response = await apiClient.patch<Notification>(`/notifications/${id}/read`);
    return response.data;
  }

  // PATCH : 모든 알림 읽음 처리
  async markAllAsRead(): Promise<ReadAllResponse> {
    const response = await apiClient.patch<ReadAllResponse>('/notifications/read-all');
    return response.data;
  }

  // GET : 알림 수신 설정 조회
  async getNotificationSetting(): Promise<NotificationSetting> {
    const response = await apiClient.get<NotificationSetting>('/users/notification-setting');
    return response.data;
  }

  // PATCH : 알림 수신 설정 변경
  async updateNotificationSetting(enabled: boolean): Promise<NotificationSetting> {
    const response = await apiClient.patch<NotificationSetting>('/users/notification-setting', { enabled });
    return response.data;
  }
}

export const notificationService = new NotificationService();
