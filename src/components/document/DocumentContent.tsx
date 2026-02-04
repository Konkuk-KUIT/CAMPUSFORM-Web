'use client';

import { useState, useMemo } from 'react';
import PullToRefresh from '@/components/PullToRefresh';
import TopTab from '@/components/ui/TopTab';
import SearchBar from '@/components/form/SearchBar';
import ApplicantFileCard from '@/components/ui/ApplicantFile';
import BottomSheet from '@/components/ui/BottomSheet';
import BtnRound from '@/components/ui/BtnRound';
import InputComment from '@/components/ui/InputComment';
import Reply from '@/components/ui/Reply';
import { mockApplicants } from '@/data/applicants';
import { mockComments } from '@/data/comments';

export default function DocumentContent() {
  const [selectedTab, setSelectedTab] = useState<'전체' | '보류' | '합격' | '불합격'>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('전체');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [applicants, setApplicants] = useState(mockApplicants);
  const [comments, setComments] = useState(mockComments);

   // 새로고침 핸들러
  const handleRefresh = async () => {
    // 실제로는 API 호출 등을 수행
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 데이터 다시 불러오기
    setApplicants([...mockApplicants]);
  };

  // 포지션 목록 추출
  const positions = useMemo(() => {
    const uniquePositions = Array.from(new Set(applicants.map((a) => a.position)));
    return ['전체', ...uniquePositions];
  }, [applicants]);

  // 필터링 및 정렬된 지원자 목록
  const filteredApplicants = useMemo(() => {
    let result = [...applicants];

    // 탭 필터링
    if (selectedTab !== '전체') {
      result = result.filter((a) => a.status === selectedTab);
    }

    // 검색 필터링
    if (searchQuery) {
      result = result.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // 포지션 필터링
    if (selectedPosition !== '전체') {
      result = result.filter((a) => a.position === selectedPosition);
    }

    // 정렬
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name, 'ko');
        case 'name-desc':
          return b.name.localeCompare(a.name, 'ko');
        default:
          return 0;
      }
    });

    return result;
  }, [applicants, selectedTab, searchQuery, selectedPosition, sortBy]);

  // 탭별 개수 계산
  const counts = useMemo(
    () => ({
      전체: applicants.length,
      보류: applicants.filter((a) => a.status === '보류').length,
      합격: applicants.filter((a) => a.status === '합격').length,
      불합격: applicants.filter((a) => a.status === '불합격').length,
    }),
    [applicants]
  );

  // 선택된 지원자의 댓글 가져오기
  const selectedApplicantComments = useMemo(() => {
    return comments.filter((c) => c.applicantId === selectedApplicantId);
  }, [comments, selectedApplicantId]);

  // 댓글 열기 핸들러
  const handleCommentClick = (applicantId: string) => {
    setSelectedApplicantId(applicantId);
    setCommentOpen(true);
  };

  // 즐겨찾기 토글 핸들러
  const handleToggleFavorite = (applicantId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(applicantId)) {
        newFavorites.delete(applicantId);
      } else {
        newFavorites.add(applicantId);
      }
      return newFavorites;
    });
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
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
        {filteredApplicants.length === 0 ? (
          <div className="text-center py-8 text-gray-400">검색 결과가 없습니다.</div>
        ) : (
          filteredApplicants.map((applicant) => (
            <ApplicantFileCard
              key={applicant.id}
              id={applicant.id}
              name={applicant.name}
              info={`${applicant.university} / ${applicant.major} / ${applicant.position}`}
              initialStatus={applicant.status}
              commentCount={applicant.commentCount}
              isFavorite={favorites.has(applicant.id)}
              onToggleFavorite={() => handleToggleFavorite(applicant.id)}
              onCommentClick={() => handleCommentClick(applicant.id)}
            />
          ))
        )}
      </div>

      {/* 바텀시트 - 포지션 필터 */}
      <BottomSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <h2 className="text-subtitle-md">지원 포지션</h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {positions.map((position) => (
            <BtnRound
              key={position}
              size="sm"
              variant={selectedPosition === position ? 'outline' : 'neutral'}
              onClick={() => {
                setSelectedPosition(position);
                setIsFilterOpen(false);
              }}
            >
              {position}
            </BtnRound>
          ))}
        </div>
      </BottomSheet>

      {/* 바텀시트 - 댓글 */}
      <BottomSheet isOpen={isCommentOpen} onClose={() => setCommentOpen(false)}>
        <InputComment />
        <div className="space-y-4 mt-4">
          {selectedApplicantComments.length === 0 ? (
            <p className="text-center text-gray-400 py-4">아직 댓글이 없습니다.</p>
          ) : (
            selectedApplicantComments.map((comment) => (
              <Reply
                key={comment.id}
                id={comment.id}
                author={comment.author}
                content={comment.content}
                createdAt={comment.createdAt}
                isAuthor={comment.isAuthor}
                replies={comment.replies}
              />
            ))
          )}
        </div>
      </BottomSheet>
    </PullToRefresh>
  );
}