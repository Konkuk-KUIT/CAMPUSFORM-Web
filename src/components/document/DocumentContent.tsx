'use client';

import { useState, useMemo } from 'react';
import PullToRefresh from '@/components/PullToRefresh';
import TopTab from '@/components/ui/TopTab';
import SearchBar from '@/components/form/SearchBar';
import ApplicantFileCard from '@/components/ui/ApplicantFileCard';
import BottomSheet from '@/components/ui/BottomSheet';
import BtnRound from '@/components/ui/BtnRound';
import CommentSection from '@/components/sections/CommentSection';
import { useNewProjectStore } from '@/store/newProjectStore';
import { mockApplicants } from '@/data/applicants';

export default function DocumentContent() {
  const [selectedTab, setSelectedTab] = useState<'전체' | '보류' | '합격' | '불합격'>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>('전체');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [selectedApplicantId, setSelectedApplicantId] = useState<number>(0);
  const [applicants, setApplicants] = useState(mockApplicants);
  const { createdProjectId } = useNewProjectStore();

  const projectId = createdProjectId ?? 1;
  const currentUserId = 1;

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setApplicants([...mockApplicants]);
  };

  const positions = useMemo(() => {
    const uniquePositions = Array.from(new Set(applicants.map(a => a.position)));
    return ['전체', ...uniquePositions];
  }, [applicants]);

  const filteredApplicants = useMemo(() => {
    let result = [...applicants];

    if (selectedTab !== '전체') {
      result = result.filter(a => a.status === selectedTab);
    }

    if (searchQuery) {
      result = result.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedPosition !== '전체') {
      result = result.filter(a => a.position === selectedPosition);
    }

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

  const counts = useMemo(
    () => ({
      전체: applicants.length,
      보류: applicants.filter(a => a.status === '보류').length,
      합격: applicants.filter(a => a.status === '합격').length,
      불합격: applicants.filter(a => a.status === '불합격').length,
    }),
    [applicants]
  );

  const handleCommentClick = (applicantId: number) => {
    setSelectedApplicantId(applicantId);
    setCommentOpen(true);
  };

  const handleToggleFavorite = (applicantId: number) => {
    setFavorites(prev => {
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
    <div className="h-full flex flex-col">
      {/* 고정 영역 */}
      <div className="flex-shrink-0">
        <TopTab counts={counts} onTabChange={setSelectedTab} />
        <SearchBar
          placeholder="지원자의 이름을 검색하세요."
          onSearch={setSearchQuery}
          onFilterClick={() => setIsFilterOpen(true)}
          showSort={true}
          sortValue={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* 스크롤 가능 영역 */}
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="px-4 py-1 pb-20">
          {filteredApplicants.length === 0 ? (
            <div className="text-center py-8 text-gray-400">검색 결과가 없습니다.</div>
          ) : (
            filteredApplicants.map(applicant => (
              <ApplicantFileCard
                key={applicant.applicantId}
                id={applicant.applicantId}
                name={applicant.name}
                info={`${applicant.university} / ${applicant.major} / ${applicant.position}`}
                initialStatus={applicant.status}
                commentCount={applicant.commentCount}
                isFavorite={favorites.has(applicant.applicantId)}
                onToggleFavorite={() => handleToggleFavorite(applicant.applicantId)}
                onCommentClick={() => handleCommentClick(applicant.applicantId)}
              />
            ))
          )}
        </div>
      </PullToRefresh>

      {/* 바텀시트 */}
      <BottomSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <h2 className="text-subtitle-md">지원 포지션</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {positions.map(position => (
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

      {/* 댓글 섹션 */}
      <CommentSection
        isOpen={isCommentOpen}
        onClose={() => setCommentOpen(false)}
        projectId={projectId}
        applicantId={selectedApplicantId}
        stage="DOCUMENT"
        currentUserId={currentUserId}
      />
    </div>
  );
}
