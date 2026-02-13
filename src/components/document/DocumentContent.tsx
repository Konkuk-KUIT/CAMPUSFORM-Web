'use client';

import { useState, useMemo, useEffect } from 'react';
import PullToRefresh from '@/components/PullToRefresh';
import TopTab from '@/components/ui/TopTab';
import SearchBar from '@/components/form/SearchBar';
import ApplicantFileCard from '@/components/ui/ApplicantFileCard';
import BottomSheet from '@/components/ui/BottomSheet';
import BtnRound from '@/components/ui/BtnRound';
import CommentSection from '@/components/sections/CommentSection';
import Loading from '@/components/ui/Loading';
import { toast } from '@/components/Toast';
import { applicantService } from '@/services/applicantService';
import { authService } from '@/services/authService';
import { projectService } from '@/services/projectService';
import type { Applicant, ApplicantRaw } from '@/types/applicant';

const statusMap: Record<string, '보류' | '합격' | '불합격'> = {
  HOLD: '보류',
  PASS: '합격',
  FAIL: '불합격',
};

const statusReverseMap: Record<string, string> = {
  보류: 'HOLD',
  합격: 'PASS',
  불합격: 'FAIL',
};

const mapApplicant = (a: ApplicantRaw): Applicant => ({
  applicantId: a.id,
  name: a.name,
  major: a.major,
  university: a.school ?? '',
  position: a.position ?? '',
  gender: a.gender ?? '',
  phoneNumber: a.phoneNumber ?? '',
  email: a.email ?? '',
  favorite: a.bookmarked,
  status: statusMap[a.status] ?? '보류',
  commentCount: a.commentCount,
  answers: [],
});

export default function DocumentContent({ projectId }: { projectId: number }) {
  const [selectedTab, setSelectedTab] = useState<'전체' | '보류' | '합격' | '불합격'>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>('전체');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [selectedApplicantId, setSelectedApplicantId] = useState<number>(0);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const auth = await authService.getCurrentUser();
      if (auth.isAuthenticated && auth.user) {
        setCurrentUserId(auth.user.userId);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setIsLoading(true);
        await projectService.syncSheet(projectId);
        const res = await applicantService.getApplicants(projectId, 'DOCUMENT');
        const mappedApplicants = res.applicants.map(mapApplicant);
        setApplicants(mappedApplicants);
        setFavorites(new Set(mappedApplicants.filter(a => a.favorite).map(a => a.applicantId)));
      } catch (e) {
        console.error('지원자 목록 조회 실패:', e);
        toast.error('지원자 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, [projectId]);

  const handleRefresh = async () => {
    try {
      const res = await applicantService.getApplicants(projectId, 'DOCUMENT');
      const mappedApplicants = res.applicants.map(mapApplicant);
      setApplicants(mappedApplicants);
      setFavorites(new Set(mappedApplicants.filter(a => a.favorite).map(a => a.applicantId)));
    } catch (e) {
      console.error('지원자 목록 조회 실패:', e);
      toast.error('지원자 목록을 불러오지 못했습니다.');
    }
  };

  const handleStatusChange = async (applicantId: number, newStatus: '보류' | '합격' | '불합격') => {
    try {
      await applicantService.updateStatus(projectId, applicantId, 'DOCUMENT', statusReverseMap[newStatus]);
      setApplicants(prev => prev.map(a => (a.applicantId === applicantId ? { ...a, status: newStatus } : a)));
    } catch (e) {
      console.error('상태 변경 실패:', e);
      toast.error('상태 변경에 실패했습니다.');
    }
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

  const handleToggleFavorite = async (applicantId: number) => {
    try {
      await applicantService.toggleBookmark(projectId, applicantId, 'DOCUMENT');
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(applicantId)) {
          newFavorites.delete(applicantId);
        } else {
          newFavorites.add(applicantId);
        }
        return newFavorites;
      });
    } catch (e) {
      console.error('즐겨찾기 토글 실패:', e);
      toast.error('즐겨찾기 변경에 실패했습니다.');
    }
  };

  return (
    <div className="h-full flex flex-col">
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

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="px-4 py-1 pb-20">
          {isLoading ? (
            <div className="mt-20">
              <Loading fullScreen={false} />
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="text-center py-8 text-gray-400">검색 결과가 없습니다.</div>
          ) : (
            filteredApplicants.map((applicant, index) => (
              <ApplicantFileCard
                key={applicant.applicantId ?? index}
                id={applicant.applicantId}
                name={applicant.name}
                info={[applicant.university, applicant.major, applicant.position].filter(Boolean).join(' / ')}
                initialStatus={applicant.status}
                commentCount={applicant.commentCount}
                isFavorite={favorites.has(applicant.applicantId)}
                onToggleFavorite={() => handleToggleFavorite(applicant.applicantId)}
                onCommentClick={() => handleCommentClick(applicant.applicantId)}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </PullToRefresh>

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
