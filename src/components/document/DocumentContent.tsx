'use client';

import { useState } from 'react';
import TopTab from '@/components/ui/TopTab';
import SearchBar from '@/components/form/SearchBar';
import ApplicantFileCard from '@/components/ui/ApplicantFile';
import BottomSheet from '@/components/ui/BottomSheet';
import BtnRound from '@/components/ui/BtnRound';
import InputComment from '@/components/ui/InputComment';
import Reply from '@/components/ui/Reply';

export default function DocumentContent() {
  const [selectedTab, setSelectedTab] = useState<'전체' | '보류' | '합격' | '불합격'>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCommentOpen, setCommentOpen] = useState(false);

  const counts = {
    전체: 3,
    보류: 1,
    합격: 1,
    불합격: 1,
  };

  return (
    <>
      {/* 상단 탭 */}
      <TopTab counts={counts} onTabChange={setSelectedTab} />

      {/* 검색 / 필터 */}
      <SearchBar
        placeholder="지원자의 이름을 검색하세요."
        onSearch={setSearchQuery}
        onFilterClick={() => setIsFilterOpen(true)}
        showSort={true}
        sortValue={sortBy}
        onSortChange={setSortBy}
      />

      {/* 리스트 */}
      <div className="flex-1 overflow-y-auto px-4 py-1 pb-20">
        {selectedTab === '전체' && (
          <>
            <ApplicantFileCard
              id="1"
              name="최수아"
              info="한양대 / 산업디자인과 / 매니저"
              initialStatus="보류"
              commentCount={0}
              onCommentClick={() => setCommentOpen(true)}
            />
            <ApplicantFileCard
              id="2"
              name="홍길동"
              info="서울대 / 컴퓨터공학과 / 개발자"
              initialStatus="합격"
              commentCount={2}
              onCommentClick={() => setCommentOpen(true)}
            />
            <ApplicantFileCard
              id="3"
              name="김철수"
              info="연세대 / 경영학과 / 기획자"
              initialStatus="불합격"
              commentCount={5}
              onCommentClick={() => setCommentOpen(true)}
            />
          </>
        )}

        {selectedTab === '보류' && (
          <ApplicantFileCard
            id="1"
            name="최수아"
            info="한양대 / 산업디자인과 / 매니저"
            initialStatus="보류"
            commentCount={0}
            onCommentClick={() => setCommentOpen(true)}
          />
        )}

        {selectedTab === '합격' && (
          <ApplicantFileCard
            id="2"
            name="홍길동"
            info="서울대 / 컴퓨터공학과 / 개발자"
            initialStatus="합격"
            commentCount={2}
            onCommentClick={() => setCommentOpen(true)}
          />
        )}

        {selectedTab === '불합격' && (
          <ApplicantFileCard
            id="3"
            name="김철수"
            info="연세대 / 경영학과 / 기획자"
            initialStatus="불합격"
            commentCount={5}
            onCommentClick={() => setCommentOpen(true)}
          />
        )}
      </div>

      {/* 바텀시트 - 포지션 */}
      <BottomSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <h2 className="text-subtitle-md">지원 포지션</h2>

        <div className="mt-4 flex flex-wrap gap-2">
          <BtnRound size="sm" variant="outline">
            일반 부원
          </BtnRound>
          <BtnRound size="sm" variant="neutral">
            요리사
          </BtnRound>
          <BtnRound size="sm" variant="neutral">
            조리사
          </BtnRound>
          <BtnRound size="sm" variant="neutral">
            파티셰
          </BtnRound>
          <BtnRound size="sm" variant="neutral">
            부서명
          </BtnRound>
          <BtnRound size="sm" variant="neutral">
            부서명
          </BtnRound>
          <BtnRound size="sm" variant="neutral">
            부서명
          </BtnRound>
        </div>
      </BottomSheet>

      {/* 바텀시트 - 댓글 */}
      <BottomSheet isOpen={isCommentOpen} onClose={() => setCommentOpen(false)}>
        <InputComment />
        <Reply
          id="1"
          author="Seohee LEE"
          content="지원동기가 저희 동아리에 진심이신 것 같아 너무 좋아요~!"
          createdAt="2025.11.20. 14:20"
          isAuthor={true}
          replies={[
            {
              id: '2',
              author: '정승제',
              content:
                '동아리 참여 열정 많아보이는듯... 그런데 너무 바빠보임... 지금 하는 동아리랑 학회랑 3개인데 이것까지 할 수 있을까...??? 거리도 먼데..',
              createdAt: '2025.11.20. 14:20',
              isAuthor: false,
            },
          ]}
        />
      </BottomSheet>
    </>
  );
}
