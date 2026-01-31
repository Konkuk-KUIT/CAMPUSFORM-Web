'use client';

import ReplyButton from '@/components/ui/ReplyButton';
import SelectModal from '@/components/ui/SelectModal';
import Image from 'next/image';
import { useState } from 'react';

interface ReplyProps {
  id: string;
  author: string;
  profileImage?: string;
  content: string;
  createdAt: string;
  isAuthor: boolean; // 내가 쓴 댓글
  isNested?: boolean; // 대댓글
  onReply?: (replyId: string) => void;
  replies?: ReplyProps[]; // 대댓글들
}

export default function Reply({
  id,
  author,
  profileImage,
  content,
  createdAt,
  isAuthor,
  isNested = false,
  onReply,
  replies = [],
}: ReplyProps) {
  const [showMenu, setShowMenu] = useState(false);

  const replyOptions = [
    { id: 'edit', label: '수정하기' },
    { id: 'delete', label: '삭제하기' },
  ];

  const handleOptionSelect = (optionId: string) => {
    if (optionId === 'edit') {
      console.log('댓글 수정');
    } else if (optionId === 'delete') {
      console.log('댓글 삭제');
    }
    setShowMenu(false);
  };

  return (
    <div className={`${isNested ? 'ml-3' : ''} py-3 mt-3`}>
      <div className="flex gap-3">
        {/* 프로필 이미지 */}
        <div className="shrink-0">
          {profileImage ? (
            <Image src={profileImage} alt={author} width={35} height={35} className="rounded-full" />
          ) : (
            <div className="w-11 h-11 bg-gray-300 rounded-full" />
          )}
        </div>

        {/* 댓글 내용 */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-body-md text-gray-950">{author}</h4>
              <p className="text-body-xs-rg text-gray-500">{createdAt}</p>
            </div>

            {/* 내 댓글일 때 메뉴 버튼 표시 */}
            {isAuthor && (
              <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)} className="p-1 cursor-pointer">
                  <Image src="/icons/more.svg" alt="메뉴" width={24} height={24} />
                </button>

                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <div className="absolute top-full -left-8 -translate-x-1/2 z-50">
                      <SelectModal
                        options={replyOptions}
                        onChange={handleOptionSelect}
                        width="w-[102px]"
                        backgroundColor="gray-50"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 댓글 텍스트 */}
          <p className="mt-2 text-body-rg text-gray-800 whitespace-pre-wrap">{content}</p>

          {/* 답글 버튼 */}
          {!isNested && <ReplyButton onClick={() => onReply?.(id)} className="mt-3" />}
        </div>
      </div>

      {/* 대댓글들 */}
      {replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {replies.map(reply => (
            <Reply key={reply.id} {...reply} isNested={true} />
          ))}
        </div>
      )}
    </div>
  );
}
