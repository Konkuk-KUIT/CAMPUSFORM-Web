'use client';

import { useState, useEffect } from 'react';
import ResultTab from '@/components/ui/ResultTab';
import ResultCard from '@/components/ui/ResultCard';
import Navbar from '@/components/Navbar';
import DocumentPassedList from '@/components/document/DocumentPassedList';
import DocumentFailedList from '@/components/document/DocumentFailedList';
import { documentResultService } from '@/services/documentResultService';
import type { DocumentResultStats, DocumentApplicantResult } from '@/types/document';

interface DocumentResultContentProps {
  projectId: number;
}

export default function DocumentResultContent({ projectId }: DocumentResultContentProps) {
  const [selectedTab, setSelectedTab] = useState<'합격자' | '불합격자'>('합격자');
  const [stats, setStats] = useState<DocumentResultStats | null>(null);
  const [passedList, setPassedList] = useState<DocumentApplicantResult[]>([]);
  const [failedList, setFailedList] = useState<DocumentApplicantResult[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const [passedRes, failedRes] = await Promise.all([
        documentResultService.getDocumentResults(projectId, 'PASS'),
        documentResultService.getDocumentResults(projectId, 'FAIL'),
      ]);
      setStats(passedRes.stats);
      setPassedList(passedRes.applicants);
      setFailedList(failedRes.applicants);
    };

    fetchResults();
  }, [projectId]);

  return (
    <>
      {stats && (
        <ResultCard
          type="서류결과"
          totalApplicantCount={stats.totalApplicantCount}
          currentStagePassCount={stats.currentStagePassCount}
          competitionRate={stats.competitionRate}
          genderRatio={stats.genderRatio}
        />
      )}
      <ResultTab onTabChange={setSelectedTab} />
      <div className="p-4 bg-gray-50 min-h-screen">
        {selectedTab === '합격자' ? (
          <DocumentPassedList list={passedList} projectId={projectId} />
        ) : (
          <DocumentFailedList list={failedList} projectId={projectId} />
        )}
      </div>
      <Navbar />
    </>
  );
}
