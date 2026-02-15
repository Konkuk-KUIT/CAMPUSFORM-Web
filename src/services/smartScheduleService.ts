import apiClient from '@/lib/api';

// 스마트 시간표 생성 및 미리보기
export const createSmartSchedule = async (projectId: number) => {
  return apiClient.post(`/projects/${projectId}/interview/smart-schedule`);
};

export const getSmartSchedulePreview = async (projectId: number) => {
  return apiClient.get(`/projects/${projectId}/interview/smart-schedule`);
};
