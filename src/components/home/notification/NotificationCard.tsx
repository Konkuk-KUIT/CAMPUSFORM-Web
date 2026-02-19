'use client';

import Image from 'next/image';
import type { NotificationType } from '@/types/notification';

interface NotificationCardProps {
  type: NotificationType;
  title: string;
  subContent?: string;
  content: string;
  timeAgo: string;
  isUnread?: boolean;
  onClick?: () => void;
}

export default function NotificationCard({
  type,
  title,
  subContent,
  content,
  timeAgo,
  isUnread = false,
  onClick,
}: NotificationCardProps) {
  const getIconSrc = () => {
    switch (type) {
      case 'SHEET_SYNC_RESULT':
        return isUnread ? '/icons/newapplicant-blue.svg' : '/icons/newapplicant.svg';
      case 'COMMENT_CREATED':
        return isUnread ? '/icons/comment-blue.svg' : '/icons/comment-black.svg';
      case 'ADMIN_ADDED':
        return isUnread ? '/icons/admin-blue.svg' : '/icons/admin.svg';
      case 'NEW_APPLICANT':
        return isUnread ? '/icons/newapplicant-blue.svg' : '/icons/newapplicant.svg';
      default:
        return '/icons/comment.svg';
    }
  };

  const getIconSize = () => {
    switch (type) {
      case 'NEW_APPLICANT':
        return { width: 18, height: 18 };
      case 'COMMENT_CREATED':
        return { width: 15, height: 15 };
      case 'ADMIN_ADDED':
        return { width: 20, height: 20 };
      case 'SHEET_SYNC_RESULT':
        return { width: 18, height: 18 };
      default:
        return { width: 16, height: 16 };
    }
  };

  return (
    <div
      onClick={onClick}
      className={`border-t border-gray-100 flex flex-col cursor-pointer px-[20px] py-[12px]
                  ${isUnread ? 'bg-blue-50' : 'bg-white'}`}
    >
      <div className="flex items-center w-full">
        <div className="shrink-0 w-[18px] flex items-center justify-center">
          <Image
            src={getIconSrc()}
            alt={type}
            width={getIconSize().width}
            height={getIconSize().height}
            className={type === 'NEW_APPLICANT' && !isUnread ? 'grayscale' : ''}
          />
        </div>

        <h4 className="ml-2 text-body-sm text-gray-950 flex-1 truncate">{title}</h4>

        <span className="text-body-sm text-gray-500 shrink-0 ml-4">{timeAgo}</span>
      </div>

      <div className="ml-8.75 mt-0.5 flex flex-col gap-0.5">
        {subContent && <p className="text-body-md text-gray-500">{subContent}</p>}
        <p className="text-body-md text-gray-950">{content}</p>
      </div>
    </div>
  );
}
