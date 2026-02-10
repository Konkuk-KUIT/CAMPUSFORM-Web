'use client';

import ReplyButton from '@/components/ui/ReplyButton';
import SelectModal from '@/components/ui/SelectModal';
import type { ReplyProps } from '@/types/comment';
import Image from 'next/image';
import { useState } from 'react';

export default function Reply({
  commentId,
  authorName,
  authorProfileImage,
  content,
  createdAt,
  isAuthor,
  isNested = false,
  onReply,
  onEdit,
  onDelete,
  replies = [],
}: ReplyProps) {
  // 메뉴 열림/닫힘 상태
  const [showMenu, setShowMenu] = useState(false);

  // 댓글 메뉴 옵션 (수정/삭제)
  const menuOptions = [
    { id: 'edit', label: '수정하기' },
    { id: 'delete', label: '삭제하기' },
  ];

  // 메뉴 옵션 선택 핸들러
  const handleMenuSelect = (optionId: string) => {
    if (optionId === 'edit') {
      onEdit?.(commentId);
    } else if (optionId === 'delete') {
      onDelete?.(commentId);
    }
    setShowMenu(false);
  };

  return (
    <div className={`${isNested ? 'ml-3' : ''} py-3 mt-3`}>
      <div className="flex gap-3">
        {/* 프로필 이미지 */}
        <div className="shrink-0">
          {authorProfileImage ? (
            <Image src={authorProfileImage} alt={authorName} width={35} height={35} className="rounded-full" />
          ) : (
            <div className="w-11 h-11 bg-gray-300 rounded-full" />
          )}
        </div>

        {/* 댓글 내용 */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-body-md text-gray-950">{authorName}</h4>
              <p className="text-body-xs-rg text-gray-500">{createdAt}</p>
            </div>

            {/* 내 댓글일 때만 메뉴 버튼 표시 */}
            {isAuthor && (
              <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)} className="p-1 cursor-pointer">
                  <Image src="/icons/more.svg" alt="메뉴" width={24} height={24} />
                </button>

                {showMenu && (
                  <>
                    {/* 메뉴 닫기용 배경 */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    {/* 수정/삭제 메뉴 */}
                    <div className="absolute top-full -left-8 -translate-x-1/2 z-50">
                      <SelectModal
                        options={menuOptions}
                        onChange={handleMenuSelect}
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

          {/* 답글 버튼 (최상위 댓글에만 표시) */}
          {!isNested && <ReplyButton onClick={() => onReply?.(commentId)} className="mt-3" />}
        </div>
      </div>

      {/* 대댓글들 (재귀적으로 렌더링) */}
      {replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {replies.map(reply => (
            <Reply
              key={reply.commentId}
              {...reply}
              isNested={true}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
