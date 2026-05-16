import apiClient from '@/lib/api';

// 스마트 시간표 생성 미리보기: 알고리즘만 실행하고 DB에는 저장하지 않습니다.
export const generateSmartSchedule = async (projectId: number, userId: number) => {
  const response = await apiClient.post(
    `/projects/${projectId}/interview/smart-schedule/generate`,
    null,
    {
      params: { userId },
    },
  );

  return response.data;
};

// 스마트 시간표 확정: 알고리즘 결과를 DB에 저장하여 최종 확정합니다.
export const confirmSmartSchedule = async (projectId: number, userId: number) => {
  const response = await apiClient.post(
    `/projects/${projectId}/interview/smart-schedule/confirm`,
    null,
    {
      params: { userId },
    },
  );

  return response.data;
};

// 기존 호출부 호환용 alias입니다. 신규 코드에서는 generateSmartSchedule을 사용합니다.
export const createSmartSchedule = generateSmartSchedule;

export const getSmartSchedulePreview = async (projectId: number) => {
  return apiClient.get(`/projects/${projectId}/interview/smart-schedule`);
};
