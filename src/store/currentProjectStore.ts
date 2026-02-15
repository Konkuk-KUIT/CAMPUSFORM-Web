import { create } from 'zustand';

interface CurrentProjectStore {
  projectId: number | null;
  projectTitle: string | null;
  setProjectId: (id: number) => void;
  setProjectTitle: (title: string) => void;
}

export const useCurrentProjectStore = create<CurrentProjectStore>(set => ({
  projectId: null,
  projectTitle: null,
  setProjectId: id => set({ projectId: id }),
  setProjectTitle: title => set({ projectTitle: title }),
}));
