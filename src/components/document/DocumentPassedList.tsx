'use client';

import ApplicantCountHeader from '@/components/ui/ApplicantCountHeader';
import Button from '@/components/ui/Btn';
import NotificationMessageForm from '@/components/ui/NotificationMessageForm';
import ApplicantMessageCard from '@/components/document/ApplicantMessageCard';
import Link from 'next/link';
import type { DocumentApplicantResult } from '@/types/document';

interface DocumentPassedListProps {
  list: DocumentApplicantResult[];
  projectId: number;
  initialTemplate: string;
  onTemplateChange: (template: string) => void;
  appliedTemplate: string;
  isVariableEnabled: boolean;
  onTemplateApply: (template: string, isVariable: boolean) => void;
}

export default function DocumentPassedList({
  list,
  projectId,
  initialTemplate,
  onTemplateChange,
  appliedTemplate,
  isVariableEnabled,
  onTemplateApply,
}: DocumentPassedListProps) {
  return (
    <>
      <ApplicantCountHeader type="합격자" list={list} />
      <NotificationMessageForm
        type="합격자"
        onTemplateApply={onTemplateApply}
        onTemplateChange={onTemplateChange}
        projectId={projectId}
        status="PASS"
        initialTemplate={initialTemplate}
      />
      <ApplicantMessageCard
        type="합격자"
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
