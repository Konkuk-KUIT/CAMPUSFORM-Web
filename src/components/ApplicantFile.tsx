'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import StatusDropdown from '@/components/StatusDropdown';

interface ApplicantFileCardProps {
  id: string;
  name: string;
  info: string;
  initialStatus: '보류' | '합격' | '불합격';
  commentCount?: number;
  onCommentClick?: () => void;
}

export default function ApplicantFileCard({
  id,
  name,
  info,
  initialStatus,
  commentCount = 0,
  onCommentClick,
}: ApplicantFileCardProps) {
  const [status, setStatus] = useState(initialStatus);

  return (
    <div className="relative w-85.75 h-18.75 bg-white border-b border-gray-100 flex items-center px-5">
      <Link href={`/document/${id}`} className="flex flex-col flex-1">
        <h3 className="text-subtitle-sm-md text-gray-950">{name}</h3>
        <p className="mt-1 text-body-md text-gray-400">{info}</p>
      </Link>

      <div className="flex flex-col items-end gap-2">
        <StatusDropdown value={status} onChange={setStatus} />

        <div className="flex items-center gap-2.5 text-gray-300">
          <div className="flex items-center gap-1">
            <button className="w-4 h-4 relative" onClick={onCommentClick}>
              <Image src="/icons/comment.svg" alt="댓글" fill />
            </button>
            <span className="text-body-xs-rg text-gray-300">{commentCount}</span>
          </div>
          <button className="w-4.5 h-4.5 relative">
            <Image src="/icons/star-off.svg" alt="즐겨찾기" fill />
          </button>
        </div>
      </div>
    </div>
  );
}
