'use client';

import Button from '@/components/ui/Btn';
import NotificationMessageForm from '@/components/ui/NotificationMessageForm';
import ApplicantCountHeader from '@/components/interview/ApplicantCountHeader';
import ApplicantMessageCard from '@/components/interview/ApplicantMessageCard';
import Link from 'next/link';
import type { DocumentApplicantResult } from '@/types/document';

interface InterviewFailedListProps {
  list: DocumentApplicantResult[];
  projectId: number;
  initialTemplate: string;
  onTemplateChange: (template: string) => void;
  appliedTemplate: string;
  isVariableEnabled: boolean;
  onTemplateApply: (template: string, isVariable: boolean) => void;
}

export default function InterviewFailedList({
  list,
  projectId,
  initialTemplate,
  onTemplateChange,
  appliedTemplate,
  isVariableEnabled,
  onTemplateApply,
}: InterviewFailedListProps) {
  return (
    <>
      <ApplicantCountHeader type="불합격자" list={list} />
      <NotificationMessageForm
        type="불합격자"
        onTemplateApply={onTemplateApply}
        onTemplateChange={onTemplateChange}
        projectId={projectId}
        status="FAIL"
        stage="INTERVIEW"
        initialTemplate={initialTemplate}
      />
      <ApplicantMessageCard
        type="불합격자"
        template={appliedTemplate}
        isVariableEnabled={isVariableEnabled}
        list={list}
      />
      <Link href={`/interview/${projectId}/complete`}>
        <Button variant="primary" size="lg" className="fixed bottom-20">
          면접 마감하기
        </Button>
      </Link>
    </>
  );
}