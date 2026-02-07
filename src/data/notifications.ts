// src/data/notifications.ts
import { Notification } from '@/types/notification';

export const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'comment',
    title: '요리퐁 6기 신입부원 모집',
    subContent: '- 이현지 님의 지원서',
    message: '한상회 님이 댓글을 작성했어요.',
    time: '1분 전',
    isRead: false,
  },
  {
    id: 2,
    type: 'applicant',
    title: '요리퐁 6기 신입부원 모집',
    message: '김혜연 님이 새롭게 지원했어요.',
    time: '1분 전',
    isRead: false,
  },
  {
    id: 3,
    type: 'comment',
    title: '요리퐁 6기 신입부원 모집',
    subContent: '- 박민수 님의 지원서',
    message: '한상회 님이 댓글을 작성했어요.',
    time: '10분 전',
    isRead: true,
  },
  {
    id: 4,
    type: 'applicant',
    title: '요리퐁 6기 신입부원 모집',
    message: '김혜연 님이 새롭게 지원했어요.',
    time: '30분 전',
    isRead: true,
  },
  {
    id: 5,
    type: 'comment',
    title: '요리퐁 6기 신입부원 모집',
    subContent: '- 노수현 님의 지원서',
    message: '지원서 내용이 수정되었습니다.',
    time: '1시간 전',
    isRead: false,
  },
];