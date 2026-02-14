'use client';

import { useState, useEffect } from 'react';
import ResultTab from '@/components/ui/ResultTab';
import ResultCard from '@/components/ui/ResultCard';
import Navbar from '@/components/Navbar';
import InterviewPassedList from '@/components/interview/InterviewPassedList';
import InterviewFailedList from '@/components/interview/InterviewFailedList';
import { documentResultService } from '@/services/documentResultService';
import type { DocumentResultStats, DocumentApplicantResult } from '@/types/document';

interface InterviewResultContentProps {
  projectId: number;
}

export default function InterviewResultContent({ projectId }: InterviewResultContentProps) {
  const [selectedTab, setSelectedTab] = useState<'합격자' | '불합격자'>('합격자');
  const [stats, setStats] = useState<DocumentResultStats | null>(null);
  const [passedList, setPassedList] = useState<DocumentApplicantResult[]>([]);
  const [failedList, setFailedList] = useState<DocumentApplicantResult[]>([]);
  const [passedTemplate, setPassedTemplate] = useState<string>('');
  const [failedTemplate, setFailedTemplate] = useState<string>('');
  const [passedAppliedTemplate, setPassedAppliedTemplate] = useState<string>('');
  const [failedAppliedTemplate, setFailedAppliedTemplate] = useState<string>('');
  const [passedIsVariableEnabled, setPassedIsVariableEnabled] = useState(false);
  const [failedIsVariableEnabled, setFailedIsVariableEnabled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      const [passedRes, failedRes] = await Promise.all([
        documentResultService.getInterviewResults(projectId, 'PASS'),
        documentResultService.getInterviewResults(projectId, 'FAIL'),
      ]);
      setStats(passedRes.stats);
      setPassedList(passedRes.applicants);
      setFailedList(failedRes.applicants);
      setPassedTemplate(passedRes.template.content);
      setFailedTemplate(failedRes.template.content);
      setIsLoaded(true);
    };

    fetchResults();
  }, [projectId]);

  // 결과가 없을 때 빈 화면
  if (isLoaded && passedList.length === 0 && failedList.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] px-5 bg-white">
          <h2 className="text-subtitle-md text-black text-center mb-2.5">진행 중인 면접이 없습니다.</h2>
          <p className="text-body-rg text-gray-500 text-center">
            면접 대상자 확정 또는 시간표 생성 후<br />
            면접 정보를 확인할 수 있습니다.
          </p>
        </div>
        <Navbar />
      </>
    );
  }

  return (
    <>
      {stats && (
        <ResultCard
          type="면접결과"
          totalApplicantCount={stats.totalApplicantCount}
          currentStagePassCount={stats.currentStagePassCount}
          competitionRate={stats.competitionRate}
          genderRatio={stats.genderRatio}
        />
      )}
      <ResultTab onTabChange={setSelectedTab} />
      <div className="p-4 bg-gray-50 min-h-screen">
        {isLoaded &&
          (selectedTab === '합격자' ? (
            <InterviewPassedList
              list={passedList}
              projectId={projectId}
              initialTemplate={passedTemplate}
              onTemplateChange={setPassedTemplate}
              appliedTemplate={passedAppliedTemplate}
              isVariableEnabled={passedIsVariableEnabled}
              onTemplateApply={(template, isVariable) => {
                setPassedAppliedTemplate(template);
                setPassedIsVariableEnabled(isVariable);
              }}
            />
          ) : (
            <InterviewFailedList
              list={failedList}
              projectId={projectId}
              initialTemplate={failedTemplate}
              onTemplateChange={setFailedTemplate}
              appliedTemplate={failedAppliedTemplate}
              isVariableEnabled={failedIsVariableEnabled}
              onTemplateApply={(template, isVariable) => {
                setFailedAppliedTemplate(template);
                setFailedIsVariableEnabled(isVariable);
              }}
            />
          ))}
      </div>
      <Navbar />
    </>
  );
}