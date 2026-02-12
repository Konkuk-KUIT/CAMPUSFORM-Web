'use client';

import { useState } from 'react';
import Image from 'next/image';
import BottomSheet from '@/components/ui/BottomSheet';
import ApplicantSummaryCard from '@/components/ui/ApplicantSummaryCard';
import Button from '@/components/ui/Btn';
import { getPassedInterviewApplicants, getFailedInterviewApplicants } from '@/data/interviews';
import type { InterviewApplicant } from '@/types/interview';

interface ApplicantMessageCardProps {
  type: '합격자' | '불합격자';
  template?: string;
  isVariableEnabled?: boolean;
}

export default function ApplicantMessageCard({ type, template, isVariableEnabled = false }: ApplicantMessageCardProps) {
  const [isPersonalMessageOpen, setIsPersonalMessageOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<InterviewApplicant | null>(null);

  // 합격자/불합격자 필터링
  const applicants = type === '합격자' ? getPassedInterviewApplicants() : getFailedInterviewApplicants();

  const handleApplicantClick = (applicant: InterviewApplicant) => {
    setSelectedApplicant(applicant);
    setIsPersonalMessageOpen(true);
  };

  // 변수를 실제 값으로 치환하는 함수
  const replaceVariables = (text: string, applicant: InterviewApplicant) => {
    return text.replace(/[@＠]이름/g, applicant.name).replace(/[@＠]포지션/g, applicant.position);
  };

  // 변수가 치환된 부분을 파랑색으로 표시하기 위한 함수
  const renderTemplateWithHighlight = (text: string, applicant: InterviewApplicant) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let keyCounter = 0;

    // @이름과 @포지션을 찾아서 치환 (전각문자 @도 포함)
    const regex = /[@＠]이름|[@＠]포지션/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // 일반 텍스트 부분
      if (match.index > lastIndex) {
        const normalText = text.substring(lastIndex, match.index);
        parts.push(<span key={`text-${keyCounter++}`}>{normalText}</span>);
      }

      // 치환된 변수 부분 (파랑색으로 표시)
      const variable = match[0];
      const value = variable.includes('이름') ? applicant.name : applicant.position;
      parts.push(
        <span key={`var-${keyCounter++}`} className="text-primary">
          {value}
        </span>
      );

      lastIndex = regex.lastIndex;
    }

    // 마지막 남은 텍스트
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      parts.push(<span key={`text-${keyCounter++}`}>{remainingText}</span>);
    }

    return parts;
  };

  const title = type === '합격자' ? '합격자 개인별 메세지' : '불합격자 개인별 메세지';
  const resultText =
    type === '합격자'
      ? '요리퐁 6기 최종 합격을 축하드립니다!'
      : '아쉽지만 이번 요리퐁 6기에서는 함께하지 못하게 되었습니다.';
  const additionalText =
    type === '합격자'
      ? '합격자 오리엔테이션 일정과 안내 자료는 별도로 전달드릴 예정이니 확인 부탁드립니다.'
      : '지원해 주셔서 감사드리며, 다음 기회에 다시 뵙기를 바랍니다.';

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

  return (
    <>
      <div className="mt-3">
        <h3 className="text-subtitle-sm-md pb-0.5">{title}</h3>
        {/* 명단/전화번호 복사 안내문구 */}
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
          {applicants.map(applicant => (
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

      {/* 바텀시트 - 합격자/불합격자 개인별 페이지 */}
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
                  <h2>[요리퐁 6기 최종 결과 안내]</h2>

                  <div>
                    <p>
                      <span className="text-primary">{selectedApplicant.name}</span> @이름 님, {resultText}
                    </p>
                  </div>

                  <p>{additionalText}</p>
                </>
              )}
            </div>
          </>
        )}
      </BottomSheet>
    </>
  );
}
