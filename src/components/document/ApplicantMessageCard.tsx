'use client';

import { useState } from 'react';
import Image from 'next/image';
import BottomSheet from '@/components/ui/BottomSheet';
import ApplicantSummaryCard from '@/components/ui/ApplicantSummaryCard';
import Button from '@/components/ui/Btn';
import { mockApplicants } from '@/data/applicants';
import type { Applicant } from '@/types/applicant';

interface ApplicantMessageCardProps {
  type: '합격자' | '불합격자';
  template?: string;
  isVariableEnabled?: boolean;
}

export default function ApplicantMessageCard({ type, template, isVariableEnabled = false }: ApplicantMessageCardProps) {
  const [isPersonalMessageOpen, setIsPersonalMessageOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  // type에 따라 합격자 또는 불합격자 필터링
  const filteredApplicants = mockApplicants.filter(applicant =>
    type === '합격자' ? applicant.status === '합격' : applicant.status === '불합격'
  );

  const handleApplicantClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsPersonalMessageOpen(true);
  };

  // 변수를 실제 값으로 치환하는 함수
  const replaceVariables = (text: string, applicant: Applicant) => {
    return text.replace(/[@＠]이름/g, applicant.name).replace(/[@＠]포지션/g, applicant.position);
  };

  // 변수가 치환된 부분을 파랑색으로 표시하기 위한 함수
  const renderTemplateWithHighlight = (text: string, applicant: Applicant) => {
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

  // type에 따른 제목과 메시지
  const title = type === '합격자' ? '합격자 개인별 메세지' : '불합격자 개인별 메세지';
  const resultMessage = type === '합격자' ? '서류 전형에 통과하셨습니다!' : '서류 전형에 선발되지 않았습니다.';
  const additionalMessage =
    type === '합격자' ? '다음 단계 면접 일정 조율을 위해...' : '지원해 주신 시간과 관심에 다시 한 번 감사드립니다.';

  return (
    <>
      <div className="mt-3">
        <h3 className="text-subtitle-sm-md pb-0.5">{title}</h3>
        {/* 명단/전화번호 복사 안내 문구 */}
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
          {filteredApplicants.map(applicant => (
            <ApplicantSummaryCard
              key={applicant.applicantId}
              name={applicant.name}
              university={applicant.university}
              major={applicant.major}
              role={applicant.position}
              onClick={() => handleApplicantClick(applicant)}
            />
          ))}
        </div>
      </div>

      {/* 바텀시트 - 개인별 페이지 */}
      <BottomSheet isOpen={isPersonalMessageOpen} onClose={() => setIsPersonalMessageOpen(false)}>
        {selectedApplicant && (
          <>
            <h2 className="text-subtitle-sm-md text-black pt-3 pb-1">{selectedApplicant.name}</h2>
            <h3 className="text-body-rg text-gray-400">
              {selectedApplicant.university}/{selectedApplicant.major}/{selectedApplicant.position}
            </h3>
            {/* 버튼 */}
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

            {/* 템플릿 텍스트 */}
            <div className="flex flex-col gap-4 py-4 text-body-sm-rg">
              {template ? (
                // 커스텀 템플릿이 있을 경우
                <div className="whitespace-pre-wrap">
                  {isVariableEnabled ? renderTemplateWithHighlight(template, selectedApplicant) : template}
                </div>
              ) : (
                // 기본 템플릿
                <>
                  <h2>[요리퐁 6기 서류 결과]</h2>

                  <div>
                    <p className="mb-1">요리퐁 6기에 지원해 주셔서 감사합니다.</p>
                    <p>
                      내부 심사 결과 <span className="text-primary">{selectedApplicant.name}</span> 님은 {resultMessage}
                    </p>
                  </div>

                  <p>{additionalMessage}</p>
                </>
              )}
            </div>
          </>
        )}
      </BottomSheet>
    </>
  );
}