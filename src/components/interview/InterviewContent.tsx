'use client';

import { useState, useMemo, useEffect } from 'react';
import PullToRefresh from '@/components/PullToRefresh';
import TopTab from '@/components/ui/TopTab';
import SearchBar from '@/components/form/SearchBar';
import ApplicantFileCard from '@/components/interview/ApplicantFileCard';
import BottomSheet from '@/components/ui/BottomSheet';
import AppointmentModal from '@/components/interview/AppointmentModal';
import BtnRound from '@/components/ui/BtnRound';
import CommentSection from '@/components/sections/CommentSection';
import Loading from '@/components/ui/Loading';
import { toast } from '@/components/Toast';
import { applicantService } from '@/services/applicantService';
import { authService } from '@/services/authService';
import type { ApplicantRaw } from '@/types/applicant';
import type { InterviewApplicant } from '@/types/interview';

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

const mapApplicant = (a: ApplicantRaw): InterviewApplicant => ({
  applicantId: a.id,
  name: a.name,
  major: a.major,
  university: a.school ?? '',
  position: a.position ?? '',
  gender: (a.gender as '남' | '여') ?? '남',
  phoneNumber: a.phoneNumber ?? '',
  email: a.email ?? '',
  documentStatus: '합격',
  interviewStatus: statusMap[a.status] ?? '보류',
  appointmentDate: a.interviewDate ?? undefined,
  appointmentTime: a.interviewStartTime ?? undefined,
  commentCount: a.commentCount,
});

export default function InterviewContent({ projectId }: { projectId: number }) {
  const [selectedTab, setSelectedTab] = useState<'전체' | '보류' | '합격' | '불합격'>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<number>(0);
  const [selectedPosition, setSelectedPosition] = useState<string>('전체');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [applicants, setApplicants] = useState<InterviewApplicant[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [selectedAppointmentApplicantId, setSelectedAppointmentApplicantId] = useState<number | null>(null);

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
        const res = await applicantService.getApplicants(projectId, 'INTERVIEW');
        const mapped = res.applicants.map(mapApplicant);
        setApplicants(mapped);
        setFavorites(new Set(res.applicants.filter(a => a.bookmarked).map(a => a.id)));
      } catch (e) {
        console.error('면접 지원자 목록 조회 실패:', e);
        toast.error('지원자 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplicants();
  }, [projectId]);

  const handleRefresh = async () => {
    try {
      const res = await applicantService.getApplicants(projectId, 'INTERVIEW');
      const mapped = res.applicants.map(mapApplicant);
      setApplicants(mapped);
    } catch (e) {
      toast.error('새로고침에 실패했습니다.');
    }
  };

  const handleStatusChange = async (applicantId: number, newStatus: '보류' | '합격' | '불합격') => {
    try {
      await applicantService.updateStatus(projectId, applicantId, 'INTERVIEW', statusReverseMap[newStatus]);
      setApplicants(prev =>
        prev.map(a => (a.applicantId === applicantId ? { ...a, interviewStatus: newStatus } : a))
      );
    } catch (e) {
      toast.error('상태 변경에 실패했습니다.');
    }
  };

  const positions = useMemo(() => {
    const uniquePositions = Array.from(new Set(applicants.map(a => a.position)));
    return ['전체', ...uniquePositions];
  }, [applicants]);

  const filteredApplicants = useMemo(() => {
    let result = [...applicants];
    if (selectedTab !== '전체') result = result.filter(a => a.interviewStatus === selectedTab);
    if (searchQuery) result = result.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedPosition !== '전체') result = result.filter(a => a.position === selectedPosition);
    result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name, 'ko');
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name, 'ko');
      return 0;
    });
    return result;
  }, [applicants, selectedTab, searchQuery, selectedPosition, sortBy]);

  const counts = useMemo(() => ({
    전체: applicants.length,
    보류: applicants.filter(a => a.interviewStatus === '보류').length,
    합격: applicants.filter(a => a.interviewStatus === '합격').length,
    불합격: applicants.filter(a => a.interviewStatus === '불합격').length,
  }), [applicants]);

  const handleToggleFavorite = async (applicantId: number) => {
    try {
      await applicantService.toggleBookmark(projectId, applicantId, 'INTERVIEW');
      setFavorites(prev => {
        const next = new Set(prev);
        next.has(applicantId) ? next.delete(applicantId) : next.add(applicantId);
        return next;
      });
    } catch (e) {
      toast.error('즐겨찾기 변경에 실패했습니다.');
    }
  };

  const handleAppointmentConfirm = async (date: string, time: string, rawDate: string) => {
    if (!selectedAppointmentApplicantId) return;
    try {
      await applicantService.manualAssignInterview(projectId, selectedAppointmentApplicantId, rawDate, time);
      setApplicants(prev =>
        prev.map(a =>
          a.applicantId === selectedAppointmentApplicantId
            ? { ...a, appointmentDate: date, appointmentTime: time }
            : a
        )
      );
      setIsAppointmentOpen(false);
    } catch (e) {
      toast.error('면접 일정 저장에 실패했습니다.');
    }
  };

  if (!isLoading && applicants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] px-5">
        <h2 className="text-subtitle-md text-black mb-2">진행 중인 면접이 없습니다.</h2>
        <p className="text-body-rg text-gray-500 text-center">다음 단계를 진행하고 싶다면</p>
        <p className="text-body-rg text-gray-500 text-center">
          <span className="text-body-md">대표자에게 요청</span>해주세요.
        </p>
      </div>
    );
  }

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
            filteredApplicants.map(applicant => (
              <ApplicantFileCard
                key={applicant.applicantId}
                id={applicant.applicantId}
                projectId={projectId}
                name={applicant.name}
                info={`${applicant.university} / ${applicant.major} / ${applicant.position}`}
                initialStatus={applicant.interviewStatus}
                commentCount={applicant.commentCount}
                isFavorite={favorites.has(applicant.applicantId)}
                onToggleFavorite={() => handleToggleFavorite(applicant.applicantId)}
                onCommentClick={() => {
                  setSelectedApplicantId(applicant.applicantId);
                  setCommentOpen(true);
                }}
                appointmentDate={applicant.appointmentDate}
                appointmentTime={applicant.appointmentTime}
                onAppointmentClick={() => {
                  setSelectedAppointmentApplicantId(applicant.applicantId);
                  setIsAppointmentOpen(true);
                }}
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
              onClick={() => { setSelectedPosition(position); setIsFilterOpen(false); }}
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
        stage="INTERVIEW"
        currentUserId={currentUserId}
      />

      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        onConfirm={handleAppointmentConfirm}
      />
    </div>
  );
}