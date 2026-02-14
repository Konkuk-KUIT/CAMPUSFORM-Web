'use client';

import { useState } from 'react';
import Image from 'next/image';
import BottomSheet from '@/components/ui/BottomSheet';
import ApplicantSummaryCard from '@/components/ui/ApplicantSummaryCard';
import Button from '@/components/ui/Btn';
import { toast } from '@/components/Toast';
import type { DocumentApplicantResult } from '@/types/document';

interface ApplicantMessageCardProps {
  type: '합격자' | '불합격자';
  template?: string;
  isVariableEnabled?: boolean;
  list: DocumentApplicantResult[];
}

export default function ApplicantMessageCard({
  type,
  template,
  isVariableEnabled = false,
  list,
}: ApplicantMessageCardProps) {
  const [isPersonalMessageOpen, setIsPersonalMessageOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<DocumentApplicantResult | null>(null);

  const handleApplicantClick = (applicant: DocumentApplicantResult) => {
    setSelectedApplicant(applicant);
    setIsPersonalMessageOpen(true);
  };

  const replaceVariables = (text: string, applicant: DocumentApplicantResult) => {
    return text.replace(/[@＠]이름/g, applicant.name).replace(/[@＠]포지션/g, applicant.position);
  };

  const renderTemplateWithHighlight = (text: string, applicant: DocumentApplicantResult) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let keyCounter = 0;
    const regex = /[@＠]이름|[@＠]포지션/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${keyCounter++}`}>{text.substring(lastIndex, match.index)}</span>);
      }
      const variable = match[0];
      const value = variable.includes('이름') ? applicant.name : applicant.position;
      parts.push(
        <span key={`var-${keyCounter++}`} className="text-primary">
          {value}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={`text-${keyCounter++}`}>{text.substring(lastIndex)}</span>);
    }

    return parts;
  };

  const handleCopyMessage = () => {
    if (selectedApplicant && template) {
      const message = isVariableEnabled ? replaceVariables(template, selectedApplicant) : template;
      navigator.clipboard.writeText(message);
    }
  };

  const handleCopyPhone = () => {
    if (selectedApplicant?.phoneNumber) {
      navigator.clipboard.writeText(selectedApplicant.phoneNumber);
    }
  };

  const title = type === '합격자' ? '합격자 개인별 메세지' : '불합격자 개인별 메세지';

  return (
    <>
      <div className="mt-3">
        <h3 className="text-subtitle-sm-md pb-0.5">{title}</h3>
        <div className="flex items-center gap-2.5 mb-1">
          <button className="flex items-center gap-1 text-gray-400 text-[12px] font-medium leading-[22px]">
            <Image src="/icons/copy-gray.svg" alt="문자 복사하기" width={15} height={15} />
            <span>문자 복사하기</span>
          </button>
          <button className="flex items-center gap-1 text-gray-400 text-[12px] font-medium leading-[22px]">
            <Image src="/icons/hashtag-gray.svg" alt="전화번호 복사하기" width={15} height={15} />
            <span>전화번호 복사하기</span>
          </button>
        </div>

        <div className="-mx-4">
          {list.map(applicant => (
            <ApplicantSummaryCard
              key={applicant.applicantId}
              name={applicant.name}
              university={applicant.school}
              major={applicant.major}
              role={applicant.position}
              onClick={() => handleApplicantClick(applicant)}
              onCopyMessage={() => {
                if (template) {
                  const message = isVariableEnabled ? replaceVariables(template, applicant) : template;
                  navigator.clipboard.writeText(message);
                  toast.success('문자가 복사되었습니다.');
                } else {
                  toast.warning('템플릿을 먼저 작성해주세요.');
                }
              }}
              onCopyPhone={() => {
                if (applicant.phoneNumber) {
                  navigator.clipboard.writeText(applicant.phoneNumber);
                  toast.success('전화번호가 복사되었습니다.');
                }
              }}
            />
          ))}
        </div>
      </div>

      <BottomSheet isOpen={isPersonalMessageOpen} onClose={() => setIsPersonalMessageOpen(false)}>
        {selectedApplicant && (
          <>
            <h2 className="text-subtitle-sm-md text-black pt-3 pb-1">{selectedApplicant.name}</h2>
            <h3 className="text-body-rg text-gray-400">
              {selectedApplicant.school}/{selectedApplicant.major}/{selectedApplicant.position}
            </h3>
            <div className="flex gap-2 justify-center items-center pt-3">
              <Button
                variant="outline"
                size="md"
                className="inline-flex items-center justify-center gap-1"
                onClick={handleCopyMessage}
              >
                <span>문자 복사하기</span>
                <Image src="/icons/copy-blue.svg" alt="" width={15} height={15} />
              </Button>
              <Button
                variant="outline"
                size="md"
                className="inline-flex items-center justify-center gap-1"
                onClick={handleCopyPhone}
              >
                <span>전화번호 복사하기</span>
                <Image src="/icons/tag-blue.svg" alt="" width={15} height={15} />
              </Button>
            </div>

            <div className="flex flex-col gap-4 py-4 text-body-sm-rg">
              {template ? (
                <div className="whitespace-pre-wrap">
                  {isVariableEnabled ? renderTemplateWithHighlight(template, selectedApplicant) : template}
                </div>
              ) : null}
            </div>
          </>
        )}
      </BottomSheet>
    </>
  );
}