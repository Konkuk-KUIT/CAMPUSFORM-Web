'use client';

import { useState } from 'react';
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
}

export default function DocumentPassedList({
  list,
  projectId,
  initialTemplate,
  onTemplateChange,
}: DocumentPassedListProps) {
  const [template, setTemplate] = useState('');
  const [isVariableEnabled, setIsVariableEnabled] = useState(false);

  const handleTemplateApply = (appliedTemplate: string, variableEnabled: boolean) => {
    setTemplate(appliedTemplate);
    setIsVariableEnabled(variableEnabled);
  };

  return (
    <>
      <ApplicantCountHeader type="합격자" list={list} />
      <NotificationMessageForm
        type="합격자"
        onTemplateApply={handleTemplateApply}
        onTemplateChange={onTemplateChange}
        projectId={projectId}
        status="PASS"
        initialTemplate={initialTemplate}
      />
      <ApplicantMessageCard type="합격자" template={template} isVariableEnabled={isVariableEnabled} list={list} />
      <Link href={`/document/${projectId}/complete`}>
        <Button variant="primary" size="lg" className="fixed bottom-20">
          서류 마감하기
        </Button>
      </Link>
    </>
  );
}
