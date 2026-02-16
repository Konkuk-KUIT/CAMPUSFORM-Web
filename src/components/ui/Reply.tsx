'use client';

import ReplyButton from '@/components/ui/ReplyButton';
import SelectModal from '@/components/ui/SelectModal';
import DeleteCommentModal from '@/components/document/DeleteCommentModal';
import type { ReplyProps } from '@/types/comment';
import Image from 'next/image';
import { useState } from 'react';

function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${yyyy}.${mm}.${dd}. ${hh}:${min}`;
}

export default function Reply({
  commentId,
  authorNickname,
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
  const [showMenu, setShowMenu] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);
  const [editContent, setEditContent] = useState(content);

  // 댓글 메뉴 옵션 (수정/삭제)
  const menuOptions = [
    { id: 'edit', label: '수정하기' },
    { id: 'delete', label: '삭제하기' },
  ];

  // 메뉴 옵션 선택 핸들러
  const handleMenuSelect = (optionId: string) => {
    if (optionId === 'edit') {
      setEditContent(content);
      setShowEditInput(true);
    } else if (optionId === 'delete') {
      setShowDeleteModal(true);
    }
    setShowMenu(false);
  };

  // 삭제 확인 핸들러
  const handleDeleteConfirm = () => {
    onDelete?.(commentId);
    setShowDeleteModal(false);
  };

  // 답글 등록 핸들러
  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    onReply?.(commentId, replyContent);
    setReplyContent('');
    setShowReplyInput(false);
  };

  // 답글 취소 핸들러
  const handleReplyCancel = () => {
    setReplyContent('');
    setShowReplyInput(false);
  };

  // 수정 등록 핸들러
  const handleEditSubmit = () => {
    if (!editContent.trim()) return;
    onEdit?.(commentId, editContent);
    setShowEditInput(false);
  };

  // 수정 취소 핸들러
  const handleEditCancel = () => {
    setEditContent(content);
    setShowEditInput(false);
  };

  return (
    <div className={`${isNested ? 'ml-3' : ''} py-3 mt-1`}>
      <div className="flex gap-3">
        {/* 프로필 이미지 */}
        <div className="shrink-0">
          {authorProfileImage ? (
            <Image
              src={authorProfileImage}
              alt={authorNickname ?? '프로필'}
              width={35}
              height={35}
              className="rounded-full"
            />
          ) : (
            <div className="w-11 h-11 bg-gray-300 rounded-full" />
          )}
        </div>

        {/* 댓글 내용 */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-body-md text-gray-950">{authorNickname ?? '이름 없음'}</h4>
              <p className="text-body-xs-rg text-gray-500">{formatDateTime(createdAt)}</p>
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
          {!isNested && <ReplyButton onClick={() => setShowReplyInput(true)} className="mt-3" />}

          {/* 답글 입력창 */}
          {showReplyInput && (
            <div className="mt-3">
              <textarea
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder=""
                className="w-full border border-gray-200 rounded-5 px-3 py-2 text-body-rg text-gray-800 resize-none outline-none focus:border-primary"
                rows={1}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleReplyCancel}
                  className="px-3 py-3 rounded-5 text-body-sm-rg text-gray-500 bg-gray-100"
                >
                  취소
                </button>
                <button
                  onClick={handleReplySubmit}
                  className="px-3 py-3 rounded-5 text-body-sm-rg text-white bg-primary"
                >
                  등록
                </button>
              </div>
            </div>
          )}

          {/* 수정 입력창 */}
          {showEditInput && (
            <div className="mt-3">
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                placeholder=""
                className="w-full border border-gray-200 rounded-5 px-3 py-2 text-body-rg text-gray-800 resize-none outline-none focus:border-primary"
                rows={1}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={handleEditCancel}
                  className="px-3 py-3 rounded-5 text-body-sm-rg text-gray-500 bg-gray-100"
                >
                  취소
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-3 py-3 rounded-5 text-body-sm-rg text-white bg-primary"
                >
                  등록
                </button>
              </div>
            </div>
          )}
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

      {/* 삭제 확인 모달 */}
      <DeleteCommentModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
