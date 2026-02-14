'use client';

import ApplicantCountHeader from '@/components/ui/ApplicantCountHeader';
import Button from '@/components/ui/Btn';
import NotificationMessageForm from '@/components/ui/NotificationMessageForm';
import ApplicantMessageCard from '@/components/document/ApplicantMessageCard';
import Link from 'next/link';
import type { DocumentApplicantResult } from '@/types/document';

interface DocumentFailedListProps {
  list: DocumentApplicantResult[];
  projectId: number;
  initialTemplate: string;
  onTemplateChange: (template: string) => void;
  appliedTemplate: string;
  isVariableEnabled: boolean;
  onTemplateApply: (template: string, isVariable: boolean) => void;
}

export default function DocumentFailedList({
  list,
  projectId,
  initialTemplate,
  onTemplateChange,
  appliedTemplate,
  isVariableEnabled,
  onTemplateApply,
}: DocumentFailedListProps) {
  return (
    <>
      <ApplicantCountHeader type="불합격자" list={list} />
      <NotificationMessageForm
        type="불합격자"
        onTemplateApply={onTemplateApply}
        onTemplateChange={onTemplateChange}
        projectId={projectId}
        status="FAIL"
        initialTemplate={initialTemplate}
      />
      <ApplicantMessageCard
        type="불합격자"
        template={appliedTemplate}
        isVariableEnabled={isVariableEnabled}
        list={list}
      />
      <Link href={`/document/${projectId}/complete`}>
        <Button variant="primary" size="lg" className="fixed bottom-20">
          서류 마감하기
        </Button>
      </Link>
    </>
  );
}
