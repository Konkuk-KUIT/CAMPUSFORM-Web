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
      case 'NEW_APPLICANT':
        return isUnread ? '/icons/newapplicant-blue.svg' : '/icons/newapplicant.svg';
      case 'COMMENT_CREATED':
        return isUnread ? '/icons/comment-blue.svg' : '/icons/comment-black.svg';
      case 'ADMIN_ADDED':
        return isUnread ? '/icons/admin-blue.svg' : '/icons/admin.svg';
      default:
        return '/icons/comment.svg';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`border-t border-gray-100 flex flex-col cursor-pointer px-[20px] py-[12px]
                  ${isUnread ? 'bg-blue-50' : 'bg-white'}`}
    >
      <div className="flex items-center w-full">
        <div className={`shrink-0 relative ${isUnread ? 'text-primary' : 'text-gray-950'}`}>
          <Image
            src={getIconSrc()}
            alt={type}
            width={16.5}
            height={16.5}
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
