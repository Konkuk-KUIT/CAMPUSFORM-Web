import apiClient from '@/lib/api';
import type {
  DocumentResultResponse,
  SmsPreviewResponse,
  RecruitmentStage,
  SmsTemplateRequest,
} from '@/types/document';
import type { ScreeningResult } from '@/types/project';

class DocumentResultService {
  // GET : 합격/불합격자 목록 조회
  async getDocumentResults(projectId: number, status: ScreeningResult): Promise<DocumentResultResponse> {
    const response = await apiClient.get<DocumentResultResponse>(`/projects/${projectId}/results`, {
      params: { stage: 'DOCUMENT', status },
    });
    return response.data;
  }

  // POST : SMS 템플릿 저장
  async saveSmsTemplate(projectId: number, body: SmsTemplateRequest): Promise<void> {
    await apiClient.post(`/projects/${projectId}/sms/templates`, body, {
      params: { stage: body.stage },
    });
  }

  // GET : SMS 발송 미리보기
  async getSmsPreview(projectId: number, applicantId: number, stage: RecruitmentStage): Promise<SmsPreviewResponse> {
    const response = await apiClient.get<SmsPreviewResponse>(
      `/projects/${projectId}/applicants/${applicantId}/sms/preview`,
      {
        params: { stage },
      }
    );
    return response.data;
  }
}

export const documentResultService = new DocumentResultService();
