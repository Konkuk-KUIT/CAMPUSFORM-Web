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
        documentResultService.getDocumentResults(projectId, 'PASS'),
        documentResultService.getDocumentResults(projectId, 'FAIL'),
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
        {isLoaded &&
          (selectedTab === '합격자' ? (
            <DocumentPassedList
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
            <DocumentFailedList
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
