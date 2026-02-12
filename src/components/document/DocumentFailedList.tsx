'use client';

import { useState } from 'react';
import ApplicantCountHeader from '@/components/ui/ApplicantCountHeader';
import Button from '@/components/ui/Btn';
import NotificationMessageForm from '@/components/ui/NotificationMessageForm';
import ApplicantMessageCard from '@/components/document/ApplicantMessageCard';

export default function DocumentFailedList() {
  const [template, setTemplate] = useState('');
  const [isVariableEnabled, setIsVariableEnabled] = useState(false);

  const handleTemplateApply = (appliedTemplate: string, variableEnabled: boolean) => {
    setTemplate(appliedTemplate);
    setIsVariableEnabled(variableEnabled);
  };

  return (
    <>
      <ApplicantCountHeader type="불합격자" />
      <NotificationMessageForm
        type="불합격자"
        onTemplateApply={handleTemplateApply}
      />
      <ApplicantMessageCard
        type="불합격자"
        template={template}
        isVariableEnabled={isVariableEnabled}
      />
      <div className="bg-gray-50">
        <Button variant="primary" size="lg" className="fixed bottom-20">
          서류 마감하기
        </Button>
      </div>
    </>
  );
}