import { create } from 'zustand';

interface CurrentProjectStore {
  projectId: number | null;
  setProjectId: (id: number) => void;
}

export const useCurrentProjectStore = create<CurrentProjectStore>(set => ({
  projectId: null,
  setProjectId: (id) => set({ projectId: id }),
}));