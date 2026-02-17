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
  createdProjectId: number | null;
  cachedSheetHeaders: string[];
  setProjectForm: (data: Partial<CreateProjectRequest>) => void;
  setMappingFields: (fields: Partial<MappingFields>) => void;
  setCreatedProjectId: (id: number) => void;
  setCachedSheetHeaders: (headers: string[]) => void;
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
  createdProjectId: null,
  cachedSheetHeaders: [],

  setProjectForm: data => set(state => ({ projectForm: { ...state.projectForm, ...data } })),
  setMappingFields: fields => set(state => ({ mappingFields: { ...state.mappingFields, ...fields } })),
  setCreatedProjectId: id => set({ createdProjectId: id }),
  setCachedSheetHeaders: headers => set({ cachedSheetHeaders: headers }),
  reset: () => set({ projectForm: {}, mappingFields: initialMappingFields, cachedSheetHeaders: [] }),
}));
