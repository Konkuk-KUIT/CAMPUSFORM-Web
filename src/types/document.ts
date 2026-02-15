// types/document.ts
import type { ScreeningResult } from '@/types/project';

export type RecruitmentStage = 'DOCUMENT' | 'INTERVIEW';

// ── 합격/불합격자 조회 ─────────────────────────────────────────

export interface DocumentGenderRatio {
  malePercent: number;
  femalePercent: number;
  otherPercent: number;
}

export interface DocumentResultStats {
  totalApplicantCount: number;
  currentStagePassCount: number;
  competitionRate: string;
  genderRatio: DocumentGenderRatio;
}

export interface DocumentResultTemplate {
  content: string;
}

export interface DocumentApplicantResult {
  applicantId: number;
  name: string;
  school: string;
  major: string;
  position: string;
  phoneNumber: string;
  personalizedMessage: string;
}

export interface DocumentResultResponse {
  stats: DocumentResultStats;
  template: DocumentResultTemplate;
  applicants: DocumentApplicantResult[];
}

// ── SMS 템플릿 저장 ────────────────────────────────────────────

export interface SmsTemplateRequest {
  stage: RecruitmentStage;
  status: ScreeningResult;
  content: string;
}

// ── SMS 발송 미리보기 ──────────────────────────────────────────

export interface SmsPreviewMessage {
  applicantId: number;
  name: string;
  phoneNumber: string;
  info: string;
  content: string;
}

export interface SmsPreviewResponse {
  count: number;
  messages: SmsPreviewMessage[];
}
