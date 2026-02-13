'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import StatusDropdown from '@/components/ui/StatusDropdown';

interface ApplicantFileCardProps {
  id: number;
  href: string;
  name: string;
  info: string;
  initialStatus: string;
  commentCount?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onCommentClick?: () => void;
  onStatusChange?: (id: number, newStatus: '보류' | '합격' | '불합격') => void;
  appointmentDate?: string;
  appointmentTime?: string;
  onAppointmentClick?: () => void;
}

export default function ApplicantFileCard({
  id,
  href,
  name,
  info,
  initialStatus,
  commentCount = 0,
  isFavorite = false,
  onToggleFavorite,
  onCommentClick,
  onStatusChange,
  appointmentDate,
  appointmentTime,
  onAppointmentClick,
}: ApplicantFileCardProps) {
  const [status, setStatus] = useState(initialStatus as '보류' | '합격' | '불합격');

  const handleStatusChange = (newStatus: '보류' | '합격' | '불합격') => {
    setStatus(newStatus);
    onStatusChange?.(id, newStatus);
  };

  return (
    <div className="relative w-85.75 h-18.75 bg-white border-b border-gray-100 flex items-center first:border-t">
      <Link href={href} className="flex flex-col flex-1">
        <h3 className="text-subtitle-sm-md text-gray-950">{name}</h3>
        <p className="mt-1 text-body-rg text-gray-400">{info}</p>
        {appointmentDate && appointmentTime && (
          <p className="mt-1 text-body-xs-rg text-gray-400">
            {appointmentDate} {appointmentTime}
          </p>
        )}
      </Link>

      <div className="flex flex-col items-end gap-2">
        <StatusDropdown value={status} onChange={handleStatusChange} />

        <div className="flex items-center gap-2.5 text-gray-300">
          <div className="flex items-center gap-1">
            <button className="w-4 h-4 relative" onClick={onCommentClick}>
              <Image src="/icons/comment.svg" alt="댓글" fill />
            </button>
            <span className="text-body-xs-rg text-gray-300">{commentCount}</span>
          </div>
          <button className="w-4.5 h-4.5 relative" onClick={onToggleFavorite}>
            <Image src={isFavorite ? '/icons/star.svg' : '/icons/star-off.svg'} alt="즐겨찾기" fill />
          </button>
        </div>
      </div>
    </div>
  );
}
