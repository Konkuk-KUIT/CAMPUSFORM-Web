// 새 프로젝트 추가 플로우에서 페이지 간 데이터 공유를 위한 전역 상태 (zustand)
import { create } from 'zustand';
import type { CreateProjectRequest } from '@/types/project';

interface MappingFields {
  name: string;
  school: string;
  major: string;
  gender: string;
  phone: string;
  email: string;
  position: string;
}

interface NewProjectStore {
  projectForm: Partial<CreateProjectRequest>;
  mappingFields: MappingFields;
  setProjectForm: (data: Partial<CreateProjectRequest>) => void;
  setMappingFields: (fields: Partial<MappingFields>) => void;
  reset: () => void;
}

const initialMappingFields: MappingFields = {
  name: '',
  school: '',
  major: '',
  gender: '',
  phone: '',
  email: '',
  position: '',
};

export const useNewProjectStore = create<NewProjectStore>(set => ({
  projectForm: {},
  mappingFields: initialMappingFields,

  setProjectForm: data => set(state => ({ projectForm: { ...state.projectForm, ...data } })),

  setMappingFields: fields => set(state => ({ mappingFields: { ...state.mappingFields, ...fields } })),

  reset: () => set({ projectForm: {}, mappingFields: initialMappingFields }),
}));
